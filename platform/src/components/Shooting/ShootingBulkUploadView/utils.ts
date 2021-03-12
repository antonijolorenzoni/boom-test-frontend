import _ from 'lodash';
import moment from 'moment';
import { parse, unparse, ParseResult } from 'papaparse';

import translations from 'translations/i18next';
import { isStatusOk } from 'api/utils';
import { emailValidationRegexp, phoneValidationRegexp } from 'utils/validations';
import { buildUrl } from 'utils/csv';
import { bulkInsertShootings } from 'api/shootingsAPI';

export interface Row {
  Address: string;
  Company: string;
  Description: string;
  Email: string;
  'Full name': string;
  'Logistic Information': string;
  Organization: string;
  Package: string;
  'Phone number': string;
  'Start Date': string;
  'Start Time': string;
  Title: string;
  'Multidelivery Emails': string;
}
interface RequestBody {
  organizationName: string;
  companyName: string;
  packageName: string;
  address: string;
  title: string;
  description: string;
  logisticInformation: string;
  contactFullName: string;
  contactPhone: string;
  contactEmail: string;
  businessName: string;
  startDate: number;
  multiDeliveryEmails: Array<string>;
}

type ApiRequests = Array<{ id: number; body: RequestBody }>;

interface ApiError {
  id: string;
  message: string;
}

interface CsvRow {
  id: number;
  fields: Array<string>;
}

const rawRequestFields = [
  'organizationName',
  'companyName',
  'packageName',
  'address',
  'title',
  'description',
  'logisticInformation',
  'contactFullName',
  'contactPhone',
  'contactEmail',
  'businessName',
];

const headerFields = [
  { label: 'Organization', required: true },
  { label: 'Company', required: true },
  { label: 'Package', required: true },
  { label: 'Start Date', required: false },
  { label: 'Start Time', required: false },
  { label: 'Address', required: true },
  { label: 'Title', required: false },
  { label: 'Description', required: false },
  { label: 'Logistic Information', required: false },
  { label: 'Full name', required: true },
  { label: 'Phone number', required: true },
  { label: 'Email', required: true },
  { label: 'Business name', required: false },
  { label: 'Multidelivery emails', required: false },
];

const exampleRow = [
  'SweetGuest',
  'SweetGuest',
  'Prova',
  '30/08/2020',
  '14:30',
  'Corso Magenta, 85, Milano, Italia, 20123',
  'Sample shooting',
  'Sample description',
  'Logistic information here!',
  'Marco Rossi',
  '+393401234567',
  'marco.rossi@mail.co',
  'My business SRL',
  'email1@boom.co;email2@boom.co;email3@boom.co',
];

const FIELDS_NUMBER = headerFields.length;

const DATE_FORMAT = 'DD/MM/YYYY';
const TIME_FORMAT = 'HH:mm';
const START_DATE_IDX = 3;
const START_TIME_IDX = 4;
const PHONE_IDX = 10;
const EMAIL_IDX = 11;
const MULTIDELIVERY_EMAIL_IDX = 13;

const CHUNK_SIZE = 5;

export const errors = {
  WRONG_FIELDS_NUMBER: translations.t('shootings.csvValidationErrors.wrongFieldsNumber'),
  EMPTY_FIELDS: translations.t('shootings.csvValidationErrors.emptyFields'),
  WRONG_DATE_FORMAT: translations.t('shootings.csvValidationErrors.wrongDateFormat'),
  WRONG_TIME_FORMAT: translations.t('shootings.csvValidationErrors.wrongTimeFormat'),
  WRONG_PHONE: translations.t('shootings.csvValidationErrors.wrongPhoneFormat'),
  WRONG_EMAIL: translations.t('shootings.csvValidationErrors.wrongEmailFormat'),
  WRONG_DELIVERY_EMAILS: translations.t('shootings.csvValidationErrors.wrongMultideliveryEmailsFormat'),
  MISSING_DATE: translations.t('shootings.csvValidationErrors.timeWithoutDate'),
  MISSING_TIME: translations.t('shootings.csvValidationErrors.dateWithoutTime'),
};

const checkFieldsNumber = (rowLength: number) => rowLength === FIELDS_NUMBER;

const checkRequiredFields = (fields: Array<string>) =>
  fields.filter((field, i) => headerFields[i].required && field.trim().length === 0).length > 0;

const checkDateAndTime = (fields: Array<string>) => {
  const isDateValid = moment(fields[START_DATE_IDX], DATE_FORMAT, true).isValid();
  const isTimeValid = moment(fields[START_TIME_IDX], TIME_FORMAT, true).isValid();
  return { isDateValid, isTimeValid };
};

const checkEmail = (fields: Array<string>) => emailValidationRegexp.test(fields[EMAIL_IDX]);

const checkPhoneNumber = (fields: Array<string>) => phoneValidationRegexp.test(fields[PHONE_IDX]);

const checkMultiDeliveryEmails = (fields: Array<string>) => {
  const emailsString = fields[MULTIDELIVERY_EMAIL_IDX];
  const emails = emailsString === '' ? [] : emailsString.split(';');

  return emails.reduce((acc, mail) => emailValidationRegexp.test(mail) && acc, true);
};

const validateHeaderLength = (result: ParseResult<Row>) => {
  return result.meta.fields?.length === FIELDS_NUMBER;
};

const validateHeaderContent = (result: ParseResult<Row>): Array<{ expected: string; actual: string }> => {
  let headerErrors: Array<{ expected: string; actual: string }> = [];
  result.meta.fields?.forEach((field: string, i: number) => {
    if (field !== headerFields[i].label) {
      headerErrors = [...headerErrors, { expected: headerFields[i].label, actual: field }];
    }
  });
  return headerErrors;
};

const validateParsedResult = (result: ParseResult<Row>): Array<{ lineNumber: number; error: string }> => {
  // parse errors from library
  if (result.errors.length > 0) {
    return result.errors.map((error) => ({ lineNumber: error.row, error: error.message }));
  }

  // our validation errors
  const rowsErrors = result.data.reduce<Array<{ lineNumber: number; error: string }>>((acc, row, i) => {
    const fields = Object.values(row);
    const lineNumber = i + 1;

    const isNumberOfFieldsCorrect = checkFieldsNumber(fields.length);
    if (!isNumberOfFieldsCorrect) {
      return [...acc, { lineNumber, error: errors.WRONG_FIELDS_NUMBER }];
    }

    const areRequiredFieldsEmpty = checkRequiredFields(fields);
    if (areRequiredFieldsEmpty) {
      return [...acc, { lineNumber, error: errors.EMPTY_FIELDS }];
    }

    if (fields[START_DATE_IDX] || fields[START_TIME_IDX]) {
      const dateTimeErrors = [];

      if (!fields[START_DATE_IDX]) {
        dateTimeErrors.push(errors.MISSING_DATE);
      }

      if (!fields[START_TIME_IDX]) {
        dateTimeErrors.push(errors.MISSING_TIME);
      }

      const { isDateValid, isTimeValid } = checkDateAndTime(fields);

      if (fields[START_DATE_IDX] && !isDateValid) {
        dateTimeErrors.push(errors.WRONG_DATE_FORMAT);
      }

      if (fields[START_TIME_IDX] && !isTimeValid) {
        dateTimeErrors.push(errors.WRONG_TIME_FORMAT);
      }

      if (dateTimeErrors.length) {
        return [...acc, { lineNumber, error: dateTimeErrors.join(', ') }];
      }
    }

    if (!checkPhoneNumber(fields)) {
      return [...acc, { lineNumber, error: errors.WRONG_PHONE }];
    }

    if (!checkEmail(fields)) {
      return [...acc, { lineNumber, error: errors.WRONG_EMAIL }];
    }

    if (!checkMultiDeliveryEmails(fields)) {
      return [...acc, { lineNumber, error: errors.WRONG_DELIVERY_EMAILS }];
    }

    return acc;
  }, []);

  return rowsErrors;
};

const parseShootings = (csv: string) => {
  const parsed = parse(csv, {
    skipEmptyLines: true,
    header: true,
    transformHeader: (header) => header.trim(),
    transform: (value, field) => value.trim(),
  });

  return parsed;
};

const removeDateAndTime = (field: string, i: number) => i !== START_DATE_IDX && i !== START_TIME_IDX;

const buildRequestBody = (chunk: Array<CsvRow>): ApiRequests =>
  chunk.map((row) => {
    const body = row.fields.filter(removeDateAndTime).reduce((acc, field, i) => {
      return {
        ...acc,
        [rawRequestFields[i]]: field,
      };
    }, {});

    const startDate = moment(`${row.fields[START_DATE_IDX]} ${row.fields[START_TIME_IDX]}`, `${DATE_FORMAT} ${TIME_FORMAT}`)
      .utc()
      .valueOf();

    const multiDeliveryEmails = row.fields[MULTIDELIVERY_EMAIL_IDX].split(';');

    return { id: row.id, body: { ...body, startDate, multiDeliveryEmails } as RequestBody };
  });

const buildRequestsBatches = (rows: Array<any>) => _.chunk(rows, CHUNK_SIZE).map(buildRequestBody);

const extractErrorsFromResponses = (
  responses: Array<{ data: Array<{ status: number; id: number; error: string }> }>,
  originalCsv: Array<CsvRow>
) => {
  const apiErrors = responses
    .map((response) => {
      const responseBody = response.data;
      const idWithError = responseBody
        .filter((rowInsertionResult) => !isStatusOk(rowInsertionResult.status))
        .map(({ id, error }) => ({ id, message: error }));

      return idWithError;
    })
    .flat();

  const openDateErrorsShooting = apiErrors.filter((shootingResponse) => {
    const associatedRowInOriginal = originalCsv.find((row) => row.id === Number(shootingResponse.id));
    if (!associatedRowInOriginal) {
      return false;
    }
    const fields = Object.values(associatedRowInOriginal.fields);

    return !fields[START_TIME_IDX] && !fields[START_DATE_IDX];
  });

  const openDateErrorsLength = openDateErrorsShooting.length;
  const normalErrorsLength = apiErrors.length - openDateErrorsLength;

  return { openDateErrorsLength, normalErrorsLength, apiErrors };
};

const buildResponseCsv = (originalCsv: Array<CsvRow>, apiErrors: Array<ApiError>) => {
  const byId = (row: { id: number; fields: Array<string> }) => (e: ApiError) => String(e.id) === String(row.id);

  const rowsWithErrors = originalCsv
    .filter((row) => {
      return apiErrors.find(byId(row));
    })
    .map((row) => {
      const error = apiErrors.find(byId(row))!;
      return [...row.fields, error.message];
    });

  const headersWithError = [...headerFields.map(({ label }) => label), 'Error'];
  return unparse([headersWithError, ...rowsWithErrors], { header: true });
};

const buildTemplateUrl = () => {
  const templateCsv = unparse([headerFields.map(({ label }) => label), exampleRow], { header: true });
  return buildUrl(templateCsv);
};

export {
  headerFields,
  parseShootings,
  validateHeaderLength,
  validateHeaderContent,
  validateParsedResult,
  buildRequestsBatches,
  extractErrorsFromResponses,
  buildResponseCsv,
  buildTemplateUrl,
};

export const calculateShootingsLength = (shootings: Array<Row>) => {
  const shootingsOpenDate = shootings.filter((shooting) => {
    const fields = Object.values(shooting);
    return !fields[START_DATE_IDX] && !fields[START_TIME_IDX];
  });

  const lengthOpenDate = shootingsOpenDate.length;
  const lengthNormal = shootings.length - lengthOpenDate;

  return { lengthOpenDate, lengthNormal };
};

export const runPromiseSequence = async (requestsBodies: ApiRequests, cb: (chunkSize: number) => void) => {
  const results = [];
  for (let job of requestsBodies.map((body) => () =>
    new Promise((resolve, reject) =>
      setTimeout(() => {
        bulkInsertShootings(body)
          .then((response) => {
            cb(CHUNK_SIZE);
            resolve(response);
          })
          .catch((err) => reject(err));
      }, 2000)
    )
  )) {
    const result = await job();
    results.push(result);
  }

  return results;
};
