import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import MomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import v4 from 'uuid/v4';
import _ from 'lodash';
import { onFetchGooglePlacesOptions, fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { DELIVERY_METHOD_TYPE, SHOOTINGS_STATUSES } from 'config/consts';
import translations from 'translations/i18next';
import { TextArea, Accordion, IconButton, Label, Typography, TextField, Icon, AsyncDropdown, Dropdown } from 'ui-boom-components';
import { GoogleDriveSelector } from 'components/GoogleDriveSelector';
import MDCheckBoxView from 'components/Forms/FormComponents/MDCheckBox/MDCheckBoxView';
import MDChipInputField from 'components/Forms/FormComponents/MDChipInputField';
import { FormButtons } from 'components/Forms/FormComponents/FormButtons';
import { FieldsWrapper, WrapperCallBox, WrapperPanel, GridMultiField } from './styles';
import { DatePicker, TimePicker } from 'components/Pickers';
import { OperationNotes } from 'components/OperationNotes';
import { useSelector } from 'react-redux';
import { EditingField } from 'components/Forms/UpdateUnscheduledPhotoshootForm/EditingField';
import { featureFlag } from 'config/featureFlags';
import { incrementPhoneCallCounter } from 'api/phoneCallsAPI';
import { isDayBlocked } from 'utils/date-utils';
import { EmailValidation } from 'utils/validations';
import { useCompanyPricingPackage } from 'hook/useCompanyPricingPackage';
import { packageToOption as pricingPackageToOption } from 'utils/pricing-package-utils';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const getSchemaUpdateUnscheduledOrder = (isBoom, timezone) =>
  Yup.object().shape(
    {
      fullName: Yup.string().trim().required(translations.t('forms.required')),
      email: EmailValidation(false).required(translations.t('forms.required')),
      phoneNumber: Yup.string().test('invalid-format', translations.t('forms.invalidPhone'), isValidPhoneNumber).required(),
      shootingAddress: Yup.object().typeError(translations.t('forms.required')).required(),
      businessName: Yup.string(),
      deliveryMethodsEmails: Yup.array().of(EmailValidation(true)),
      deliveryMethodsIsDriveSelected: Yup.boolean(),
      logisticInformation: Yup.string().nullable(),
      description: Yup.string().nullable(),
      date: isBoom
        ? Yup.number()
            .nullable()
            .when('startTime', (startTime, schema) => {
              return schema.test('dateFilledNoTime', translations.t('forms.fillDate'), (date) => !(startTime && !date));
            })
        : Yup.number()
            .nullable()
            .when('startTime', (startTime, schema) => {
              return schema
                .test('dateFilledNoTime', translations.t('forms.fillDate'), (date) => !(startTime && !date))
                .test('sixDaysAfter', translations.t('forms.sixDaysAfter'), (startDate) => {
                  const dateSelectedNoTime = moment(startDate);
                  const dateAndTimeSelected = dateSelectedNoTime
                    .set('hours', moment(startTime).get('hours'))
                    .set('minutes', moment(startTime).get('minutes'));
                  const dateNow = moment();

                  return dateAndTimeSelected.diff(dateNow, 'day') >= 6;
                })
                .test(
                  'sixWeeksBefore',
                  translations.t('forms.sixWeeksBefore'),
                  (startDate) => moment(startDate).diff(moment(), 'day') <= 42
                );
            }),
      startTime: isBoom
        ? Yup.number()
            .nullable()
            .when('date', (date, schema) => {
              return schema.test('dateFilledNoTime', translations.t('forms.fillTime'), (startTime) => !(date && !startTime));
            })
        : Yup.number()
            .nullable()
            .when('date', (date, schema) => {
              return schema
                .test('dateFilledNoTime', translations.t('forms.fillTime'), (startTime) => !(date && !startTime))
                .test('workingHours', translations.t('forms.workingHours'), (startTime) =>
                  _.inRange(Number(moment(startTime).format('HH')), 8, 20)
                );
            }),
    },
    ['startTime', 'date']
  );

export const UpdateUnscheduledPhotoshootForm = ({
  shooting,
  isDriveAuthorized,
  isContactCenter,
  onSubmit,
  onClose,
  customFolderInfo,
  onUpdateOrders,
}) => {
  const {
    place,
    mainContact,
    logisticInformation,
    description,
    company,
    canChangeEditingOption,
    editingOption,
    callAttempts,
    code,
    pricingPackage,
  } = shooting;

  const { fullName, phoneNumber, email } = mainContact;
  const { id: companyId, organization: organizationId } = company;

  const { t } = useTranslation();
  const [areSelectedDeliveryMethodsVisible, setAreSelectedDeliveryMethodsVisible] = React.useState(true);

  const [numberOfCalls, setNumberOfCalls] = useState(callAttempts);

  const googleSessionToken = React.useRef(v4());

  const { pricingPackages } = useCompanyPricingPackage(true, organizationId, companyId);

  const getSelectedDeliveryMethods = (emails, isDriveSelected) => {
    const selectedMethods = [];

    if (emails.length > 0) {
      selectedMethods.push(t('shootings.deliveryMethodsType.email'));
    }

    if (isDriveSelected) {
      selectedMethods.push(t('shootings.deliveryMethodsType.drive'));
    }

    return selectedMethods.join(', ');
  };

  const timezoneSelected = shooting.timezone;
  const timezone = timezoneSelected || moment.tz.guess();

  const { isBoom } = useSelector((state) => ({
    isBoom: state.user.data.isBoom,
  }));

  const isEditingEnable = featureFlag.isFeatureEnabled('editing-a1');

  const onClickTelephone = async (e) => {
    e.stopPropagation();
    await incrementPhoneCallCounter(code);
    setNumberOfCalls((value) => value + 1);
  };

  const localTime = moment().tz(timezone).format('hh:mm a');

  const packageToOption = pricingPackageToOption(t('organization.photos'));

  const optionsPricingPackage = pricingPackages.map(packageToOption);

  return (
    <Formik
      initialValues={{
        date: null,
        startTime: null,
        fullName,
        phoneNumber,
        pricingPackage,
        email,
        shootingAddress: place,
        businessName: mainContact.businessName || '',
        deliveryMethodsEmails: shooting.deliveryMethods
          .filter(({ type }) => type === DELIVERY_METHOD_TYPE.EMAIL)
          .map(({ contact }) => contact),
        deliveryMethodsIsDriveSelected: shooting.deliveryMethods.some(({ type }) => type === DELIVERY_METHOD_TYPE.DRIVE),
        logisticInformation,
        description,
        editingOption,
      }}
      validationSchema={getSchemaUpdateUnscheduledOrder(isBoom, timezone)}
      onSubmit={(values, actions) => {
        const {
          pricingPackage: { id },
        } = values;
        onSubmit({ ...values, pricingPackage: id });
        actions.setSubmitting(false);
      }}
    >
      {({ setFieldTouched, setFieldValue, isSubmitting, values }) => (
        <Form>
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <WrapperPanel>
              <Typography variantName="title3" textColor="#000000" style={{ marginBottom: 2 }}>
                {translations.t('shootings.schedulePhotoshoot')}
              </Typography>
              <Typography variantName="caption" style={{ marginBottom: 18 }}>
                {t('shootings.timeZoneDisclaimer')}
              </Typography>
              <FieldsWrapper>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={moment.locale()} moment={moment}>
                  <GridMultiField>
                    <Field name="date">
                      {({ field, meta }) => (
                        <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', flexBasis: '30%' }}>
                          <Label htmlFor={field.name}>{t('forms.newOrder.date')}</Label>
                          <DatePicker
                            id={field.name}
                            variant="outlined"
                            margin="normal"
                            format={'DD MMMM YYYY'}
                            minDate={isBoom ? undefined : moment()}
                            value={field.value ? moment(field.value) : null}
                            leftArrowIcon={<Icon name="arrow_left" />}
                            rightArrowIcon={<Icon name="arrow_right" />}
                            onChange={(value) => setFieldValue('date', value.startOf('day').valueOf())}
                            onBlur={() => {
                              setFieldTouched('startTime', true);
                              setFieldTouched('date', true);
                            }}
                            style={{ fontSize: 13, margin: 0 }}
                            onlyCalendar
                            autoOk
                            shouldDisableDate={(date) => isDayBlocked(date.format())}
                          />
                          {field.value && (
                            <div style={{ position: 'absolute', right: 2, top: 25 }}>
                              <IconButton onClick={() => setFieldValue('date', null)}>
                                <Icon name="clear" size={15} />
                              </IconButton>
                            </div>
                          )}
                          <Typography
                            variantName="error"
                            style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', minHeight: 18, marginTop: 2 }}
                          >
                            {meta.error}
                          </Typography>
                        </div>
                      )}
                    </Field>
                    <div>
                      <div style={{ position: 'absolute', right: 8, display: 'flex', alignItems: 'center', marginTop: 3 }}>
                        <Icon name="access_time" color="#A3ABB1" size="10" style={{ marginRight: 3 }} />
                        <Typography variantName="caption2">{`${t('shootings.localTime')}: ${localTime}`}</Typography>
                      </div>
                      <Field name="startTime">
                        {({ field, meta }) => (
                          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flexBasis: '30%' }}>
                            <Label htmlFor={field.name}>{t('forms.newOrder.time')}</Label>
                            <TimePicker
                              id={field.name}
                              ampm={false}
                              variant="outlined"
                              format="HH:mm"
                              value={field.value ? moment(field.value) : null}
                              onChange={(value) => setFieldValue('startTime', value.valueOf())}
                              onBlur={() => {
                                setFieldTouched('startTime', true);
                                setFieldTouched('date', true);
                              }}
                              inputProps={{ step: 300 }}
                            />
                            {field.value && (
                              <div style={{ position: 'absolute', right: 2, top: 25 }}>
                                <IconButton onClick={() => setFieldValue('startTime', null)}>
                                  <Icon name="clear" size={15} />
                                </IconButton>
                              </div>
                            )}
                            <Typography
                              variantName="error"
                              style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', minHeight: 18, marginTop: 2 }}
                            >
                              {t(meta.error)}
                            </Typography>
                          </div>
                        )}
                      </Field>
                    </div>
                  </GridMultiField>
                </MuiPickersUtilsProvider>
              </FieldsWrapper>
              <OperationNotes shootingId={shooting.id} color="#311a91" onSubmitNote={onUpdateOrders} />
            </WrapperPanel>
            <WrapperPanel>
              <Typography variantName="title3" textColor="#000000" style={{ marginBottom: 6 }}>
                {t('shootings.photoPackage')}
              </Typography>
              <Field name="pricingPackage">
                {({ field, meta }) => (
                  <Dropdown
                    {...field}
                    id={field.name}
                    value={field.value ? packageToOption(field.value) : null}
                    options={optionsPricingPackage}
                    onChange={(option) => {
                      setFieldValue('pricingPackage', option.value);
                    }}
                    onBlur={() => setFieldTouched('pricingPackage', true)}
                    error={meta.touched ? meta.error : null}
                    isClearable={false}
                    required
                    isDisabled
                  />
                )}
              </Field>
            </WrapperPanel>
            <ShowForPermissions permissions={[Permission.OrderBoInfoRead]}>
              <WrapperPanel>
                <a href={`tel:${phoneNumber}`}>
                  <WrapperCallBox onClick={onClickTelephone}>
                    <Icon name="phone" size={14} color="#ffffff" style={{ marginRight: 2 }} />
                    <Typography variantName="overline" textColor="#ffffff">
                      {`(${numberOfCalls})`}
                    </Typography>
                  </WrapperCallBox>
                </a>
                <Typography variantName="title3" textColor="#000000" style={{ marginBottom: 12 }}>
                  {translations.t('general.contacts')}
                </Typography>
                <GridMultiField>
                  <Field name="fullName">
                    {({ field, meta }) => (
                      <div style={{ flexBasis: '48%' }}>
                        <TextField
                          label={t('shootings.shootingContactsDetails.nameAndSurname')}
                          {...field}
                          error={meta.touched ? meta.error : null}
                          required
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="phoneNumber">
                    {({ field, meta }) => (
                      <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '48%' }}>
                        <Label htmlFor={field.name} required>
                          {t('shootings.shootingContactsDetails.phone')}
                        </Label>
                        <PhoneInput
                          id={field.name}
                          countrySelectProps={{ unicodeFlags: true }}
                          {...field}
                          onChange={(value) => setFieldValue('phoneNumber', value)}
                          required
                        />
                        <Typography
                          variantName="error"
                          style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', order: 3, minHeight: 18, marginTop: 2 }}
                        >
                          {meta.error}
                        </Typography>
                      </div>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field, meta }) => (
                      <TextField
                        label={t('shootings.shootingContactsDetails.email')}
                        {...field}
                        error={meta.touched ? meta.error : null}
                        required
                      />
                    )}
                  </Field>
                </GridMultiField>
              </WrapperPanel>
            </ShowForPermissions>
            <WrapperPanel data-testid="addressAndBusinessName" style={{ marginBottom: 21 }}>
              <Typography variantName="title3" textColor="#000000" style={{ marginBottom: 12 }}>
                {translations.t('general.address')}
              </Typography>
              <Field name="shootingAddress">
                {({ field, meta }) => (
                  <div style={{ flexBasis: '48%' }}>
                    <AsyncDropdown
                      label={t('general.fullAddress')}
                      {...field}
                      id={field.name}
                      value={field.value ? { label: field.value.formattedAddress, value: field.value } : null}
                      fetcher={(input) => onFetchGooglePlacesOptions(input, googleSessionToken.current)}
                      onChange={async (option) => {
                        if (option) {
                          const addressDetails = await fetchGoogleAddressDetails(option, googleSessionToken.current);
                          setFieldValue('shootingAddress', addressDetails);
                        } else {
                          setFieldValue('shootingAddress', null);
                        }
                      }}
                      onBlur={() => setFieldTouched('shootingAddress', true)}
                      error={meta.touched ? meta.error : null}
                      isClearable
                      required
                    />
                  </div>
                )}
              </Field>
              <Field name="businessName">
                {({ field }) => (
                  <div style={{ flexBasis: '48%' }}>
                    <TextField label={t('general.businessName')} {...field} />
                  </div>
                )}
              </Field>
            </WrapperPanel>
            <Typography variantName="title3" textColor="#000000">
              {t('shootings.shootingAdditionalInfo')}
            </Typography>
            <hr style={{ width: '100%', borderTop: '0.2px solid #a3abb1', borderBottom: 0 }} />
            <Accordion
              titleComponent={
                <>
                  <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
                    {t('shootings.deliveryMethods')}
                  </Typography>
                  {areSelectedDeliveryMethodsVisible && (
                    <div data-testid="selected-delivery-methods" style={{ margin: 0, right: 40, position: 'relative' }}>
                      {getSelectedDeliveryMethods(values.deliveryMethodsEmails, values.deliveryMethodsIsDriveSelected)}
                    </div>
                  )}
                </>
              }
              onToggle={(isOpen) => setAreSelectedDeliveryMethodsVisible(!isOpen)}
              color="#696767"
            >
              <Typography variantName="caption">{t('shootings.deliveryMethodsSubtitle')}</Typography>
              <div style={{ flexBasis: '100%', backgroundColor: '#F5F6F7', borderRadius: 3, padding: 10, marginTop: 8 }}>
                <div style={{ marginBottom: 29 }}>
                  <Field name="deliveryMethodsEmails">
                    {({ field, meta }) => (
                      <>
                        <Label htmlFor={field.name} style={{ marginBottom: 5 }}>
                          {t('shootings.deliveryMethodsType.email')}
                        </Label>
                        <MDChipInputField
                          id={field.name}
                          value={field.value}
                          handleAddChip={(email) => setFieldValue('deliveryMethodsEmails', [...field.value, email])}
                          handleDeleteChip={(email) =>
                            setFieldValue(
                              'deliveryMethodsEmails',
                              field.value.filter((e) => e !== email)
                            )
                          }
                          onBlur={() => setFieldTouched('deliveryMethodsEmails', true)}
                          deliveryError={false}
                          fullWidth={true}
                          disableUnderline={true}
                          disabled={isContactCenter}
                          variant="outlined"
                        />
                        <Typography
                          variantName="error"
                          style={{ visibility: meta.touched && meta.error ? 'visible' : 'hidden', order: 3, minHeight: 18, marginTop: 3 }}
                        >
                          {meta.error}
                        </Typography>
                      </>
                    )}
                  </Field>
                </div>
                <Typography variantName="overline">{t('shootings.yourDriveFolder')}</Typography>
                {isDriveAuthorized && (
                  <div style={{ marginBottom: 14, width: '100%' }}>
                    <Typography variantName="caption">{t('shootings.defaultFolderDrive')}</Typography>
                    <Typography variantName="caption">{t('shootings.indicateAnotherFolder')}</Typography>
                  </div>
                )}
                {isDriveAuthorized !== null && !isDriveAuthorized && (
                  <Typography variantName="caption">{t('company.clientNotConnectedDriveFolder')}</Typography>
                )}
                {isDriveAuthorized && (
                  <GoogleDriveSelector
                    customFolderInfo={customFolderInfo}
                    company={company}
                    driveDeliveryFormField={
                      <Field name="deliveryMethodsIsDriveSelected">
                        {({ field, meta }) => (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <MDCheckBoxView
                              checked={field.value}
                              onSelect={(value) => setFieldValue('deliveryMethodsIsDriveSelected', value)}
                            />
                          </div>
                        )}
                      </Field>
                    }
                  />
                )}
              </div>
            </Accordion>
            <hr style={{ width: '100%', borderTop: '0.2px solid #a3abb1', borderBottom: 0 }} />
            <Accordion
              wrapperStyle={{ width: '100%' }}
              titleComponent={
                <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
                  {t('shootings.notes')}
                </Typography>
              }
              color="#696767"
            >
              <div style={{ flexBasis: '100%', backgroundColor: '#F5F6F7', borderRadius: 3, padding: 10 }}>
                <Field name="description">
                  {({ field, meta }) => <TextArea rows={3} label={translations.t('calendar.info')} {...field}></TextArea>}
                </Field>
                <Field name="logisticInformation">
                  {({ field, meta }) => <TextArea rows={3} label={translations.t('calendar.logistics')} {...field}></TextArea>}
                </Field>
              </div>
            </Accordion>
            {isBoom && isEditingEnable && editingOption && (
              <>
                <hr style={{ width: '100%', borderTop: '0.2px solid #a3abb1', borderBottom: 0 }} />
                <Accordion
                  wrapperStyle={{ width: '100%' }}
                  titleComponent={
                    <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
                      {t('shootings.editing')}
                    </Typography>
                  }
                  color="#696767"
                >
                  <div style={{ flexBasis: '100%', backgroundColor: '#F5F6F7', borderRadius: 3, padding: 10 }}>
                    <EditingField disabled={!canChangeEditingOption} orderStatus={SHOOTINGS_STATUSES.UNSCHEDULED} />
                  </div>
                </Accordion>
              </>
            )}
            <hr style={{ width: '100%', borderTop: '0.2px solid #a3abb1', borderBottom: 0, marginBottom: 60 }} />
            <FormButtons onCancel={onClose} isSubmitDisabled={isSubmitting} />
          </div>
        </Form>
      )}
    </Formik>
  );
};
