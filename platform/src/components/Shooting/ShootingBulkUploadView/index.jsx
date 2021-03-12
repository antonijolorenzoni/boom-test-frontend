import React from 'react';

import translations from '../../../translations/i18next';
import MDButton from '../../MDButton/MDButton';
import { Button, OutlinedButton } from 'ui-boom-components';
import {
  parseShootings,
  validateHeaderLength,
  validateHeaderContent,
  validateParsedResult,
  buildRequestsBatches,
  buildResponseCsv,
  extractErrorsFromResponses,
  buildTemplateUrl,
  calculateShootingsLength,
  runPromiseSequence,
} from './utils';
import { download } from 'utils/download';

const errorWrapperStyle = { display: 'flex', flexDirection: 'column', height: '100%', fontSize: 14 };
const errorListStyle = { overflow: 'scroll', border: '1px solid #A3ABB1', marginTop: 4, borderRadius: 4, padding: 10 };

const jobInfoWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop: 10,
  fontSize: 14,
};

class ShootingBulkUploadView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readfileError: false,
      headerErrors: [],
      headerLengthError: false,
      csvErrors: [],
      apiErrors: [],
      originalCsv: [],
      counterUnscheduledShooting: null,
      counterNormalShooting: null,
      jobInfo: null,
      loading: false,
      processed: null,
    };
  }

  clear = () =>
    this.setState({
      readfileError: false,
      headerErrors: [],
      headerLengthError: false,
      csvErrors: [],
      apiErrors: [],
      originalCsv: [],
      counterUnscheduledShooting: null,
      counterNormalShooting: null,
      jobInfo: null,
      loading: false,
      processed: null,
    });

  onUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const csv = event.target.result;
        const result = parseShootings(csv);

        const isHeaderLengthValid = validateHeaderLength(result);

        if (!isHeaderLengthValid) {
          this.setState({ headerLengthError: true, csvErrors: [], headerErrors: [] });
        } else {
          const headerErrors = validateHeaderContent(result);
          const csvErrors = validateParsedResult(result);

          if (csvErrors.length > 0 || headerErrors.length > 0) {
            this.setState({
              headerErrors,
              headerLengthError: false,
              csvErrors,
              originalCsv: [],
              jobInfo: null,
              counterUnscheduledShooting: null,
              counterNormalShooting: null,
            });
          } else {
            const { lengthOpenDate, lengthNormal } = calculateShootingsLength(result.data);

            this.setState({
              counterUnscheduledShooting: lengthOpenDate,
              counterNormalShooting: lengthNormal,
              originalCsv: result.data.map((row, i) => ({ id: i, fields: Object.values(row) })),
              headerErrors: [],
              headerLengthError: false,
              csvErrors: [],
              readfileError: false,
              jobInfo: null,
              loading: false,
              processed: null,
            });
          }
        }
      };

      reader.onerror = (event) => {
        this.setState({ readfileError: true });
      };

      reader.readAsText(file);
    }
  };

  onApiError = (message, jobInfo) => {
    this.props.onError(message);

    this.setState({
      readfileError: false,
      headerErrors: [],
      headerLengthError: false,
      csvErrors: [],
      originalCsv: [],
      counterUnscheduledShooting: null,
      counterNormalShooting: null,
      jobInfo,
      processed: null,
    });
  };

  onConfirm = () => {
    const requestsBodies = buildRequestsBatches(this.state.originalCsv);

    this.setState((state) => ({ ...state, processed: 0, loading: true }));

    runPromiseSequence(requestsBodies, (inc) => this.setState((state) => ({ ...state, processed: state.processed + inc })))
      .then((responses) => {
        this.setState((state) => ({ ...state, loading: false }));

        const { openDateErrorsLength, normalErrorsLength, apiErrors } = extractErrorsFromResponses(responses, this.state.originalCsv);

        const jobInfo = {
          lenghtErrors: openDateErrorsLength + normalErrorsLength,
          lengthOpenDate: this.state.counterUnscheduledShooting - openDateErrorsLength,
          lengthNormal: this.state.counterNormalShooting - normalErrorsLength,
        };

        if (apiErrors.length > 0) {
          this.setState({ apiErrors }, () => {
            const { originalCsv, apiErrors: errors } = this.state;
            const csvResponse = buildResponseCsv(originalCsv, errors);

            download(csvResponse, 'errors.csv');
            this.onApiError(translations.t('shootings.bulkInsertCsvError'), jobInfo);
          });
        } else {
          this.setState(
            {
              readfileError: false,
              headerErrors: [],
              headerLengthError: false,
              csvErrors: [],
              apiErrors: [],
              originalCsv: [],
              counterUnscheduledShooting: null,
              counterNormalShooting: null,
              jobInfo,
              loading: false,
              processed: null,
            },
            () => {
              this.props.onUploadFinish();
              this.props.onCompleteInsert();
            }
          );
        }
      })
      .catch((errorMessage) => {
        this.props.onError(translations.t('shootings.bulkInsertCsvError'));
        this.setState({ processed: null, loading: false });
      });
  };

  render() {
    const {
      headerLengthError,
      headerErrors,
      csvErrors,
      originalCsv,
      readfileError,
      jobInfo,
      counterUnscheduledShooting,
      counterNormalShooting,
      processed,
    } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{translations.t('shootings.bulkInsertInstructionsTitle')}:</div>
        <ul style={{ fontSize: 14 }}>
          <li>{translations.t('shootings.csvValidationDateFormat')}</li>
          <li>{translations.t('shootings.csvValidationTimeFormat')}</li>
          <li>{translations.t('shootings.csvValidationMultiDeliveryFormat')}</li>
          <li>{translations.t('shootings.csvValidationOpenDateEvent')}</li>
        </ul>
        <div>
          <a style={{ fontWeight: 600 }} href={buildTemplateUrl()} download="shootings.csv">
            Download template
          </a>
          {translations.t('shootings.downloadCsvInfo')}
        </div>
        {originalCsv.length === 0 && (
          <div style={{ display: 'flex', marginTop: 10 }}>
            <div style={{ flexBasis: '20%' }}>
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="bulk-upload-btn"
                type="file"
                onChange={this.onUpload}
                data-testid="bulk-upload-input"
              />
              <label htmlFor="bulk-upload-btn">
                <MDButton
                  containerstyle={{ margin: 0 }}
                  buttonStyle={{ boxShadow: 'none' }}
                  backgroundColor="#5AC0B1"
                  component="span"
                  title="upload"
                />
              </label>
            </div>
          </div>
        )}
        {jobInfo && (
          <div style={jobInfoWrapperStyle} data-testid="job-info-wrapper">
            <span style={{ fontWeight: 600 }}>Import result</span>
            <span>{translations.t('shootings.bulkInsertInsertedShootings.title')}</span>
            <span>
              {translations.t('shootings.bulkInsertInsertedShootings.normalShootingsCount', {
                normalCount: jobInfo.lengthNormal,
              })}
            </span>
            <span>
              {translations.t('shootings.bulkInsertInsertedShootings.openDateShootingsCount', {
                openDateCount: jobInfo.lengthOpenDate,
              })}
            </span>
            <span style={{ color: '#FF0000' }}>
              {translations.t('shootings.bulkInsertErrorsTitle')}: {jobInfo.lenghtErrors}
            </span>
            {jobInfo.lenghtErrors > 0 && <span>{translations.t('shootings.bulkInsertFixInstructions')}</span>}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: 14, overflow: 'auto' }}>
          {readfileError && <span>{readfileError}</span>}
          {headerLengthError && <span style={{ color: '#FF0000' }}>{translations.t('shootings.csvValidationErrorHeaderLengthTitle')}</span>}
          {headerErrors.length > 0 && (
            <div data-testid="header-error-wrapper" style={errorWrapperStyle}>
              <span style={{ color: '#FF0000' }}>{translations.t('shootings.csvValidationErrorHeaderTitle')}</span>
              <div style={errorListStyle}>
                {headerErrors.map(({ expected, actual }) => (
                  <div key={expected}>{`${expected}: ${actual}`}</div>
                ))}
              </div>
            </div>
          )}
          {csvErrors.length > 0 && (
            <div data-testid="csv-error-wrapper" style={errorWrapperStyle}>
              <span style={{ color: '#FF0000' }}>{translations.t('shootings.csvValidationErrorTitle')}</span>
              <div style={errorListStyle}>
                {csvErrors.map(({ lineNumber, error }) => (
                  <div key={lineNumber}>{`${lineNumber}: ${error}`}</div>
                ))}
              </div>
            </div>
          )}
          {originalCsv.length > 0 && (
            <>
              <div
                style={{
                  fontWeight: 600,
                  margin: '20px 0 30px',
                  textAlign: 'center',
                }}
              >
                <div>{translations.t('shootings.bulkInsertPreview.title')}</div>
                <div>
                  {translations.t('shootings.bulkInsertPreview.normalShootingsCount', {
                    normalCount: counterNormalShooting,
                  })}
                </div>
                <div>
                  {translations.t('shootings.bulkInsertPreview.openDateShootingsCount', {
                    openDateCount: counterUnscheduledShooting,
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <OutlinedButton onClick={() => this.clear()} disabled={this.state.loading} style={{ marginRight: 24 }}>
                  {translations.t('modals.cancel')}
                </OutlinedButton>
                <Button onClick={this.onConfirm} loading={this.state.loading}>
                  {translations.t('modals.confirm')}
                </Button>
              </div>
              {processed !== null && (
                <div style={{ marginTop: 8, fontWeight: 600 }}>
                  {translations.t('shootings.bulkInsertProgress', {
                    processed,
                    totalLength: originalCsv.length,
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default ShootingBulkUploadView;
