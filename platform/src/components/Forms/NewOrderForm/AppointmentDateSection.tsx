import React, { createRef, useState, useEffect } from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { object, number, string, InferType, NumberSchema } from 'yup';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { IconButton, Typography, Label, Icon, RadioButtonGroup, RadioButton, Tooltip } from 'ui-boom-components';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import constsWithTranslations from 'config/constsWithTranslations';
import { UNKNOWN_VALUE, KNOWN_VALUE, PHOTO_TYPES_OPEN_DATE } from 'config/consts';
import { RowWrapper, FieldWrapper } from '../styles';
import { DatePicker, TimePicker } from 'components/Pickers';
import { getDurationInfoString } from 'utils/timeHelpers';
import { isDayBlocked } from 'utils/date-utils';
import { NewOrderFields } from '.';
import { requiredMessageKey } from 'utils/validations';
import { inRange } from 'lodash';
import { getTypedField } from 'components/TypedFields';

interface Props {
  isBoom: boolean;
}

const buildAppointmentDateValidationSchema = (isBoom: boolean) =>
  object({
    knowDateAndTime: string().trim().nullable().required(requiredMessageKey),
    date: number()
      .nullable()
      .when('knowDateAndTime', {
        is: KNOWN_VALUE,
        then: number().required(requiredMessageKey),
      }),
    startTime: isBoom
      ? number()
          .nullable()
          .when('knowDateAndTime', {
            is: KNOWN_VALUE,
            then: number().required(requiredMessageKey),
          })
      : number()
          .nullable()
          .when('knowDateAndTime', {
            is: KNOWN_VALUE,
            then: number().required(requiredMessageKey),
          })
          .when('date', (date: number, schema: NumberSchema) => {
            return schema
              .test('dateFilledNoTime', 'forms.fillTime', (startTime) => !(date && !startTime))
              .test('workingHours', 'forms.workingHours', (startTime) => inRange(Number(moment(startTime).format('HH')), 8, 20));
          }),
  }).required();

export const BoomAppointmentDateValidationSchema = buildAppointmentDateValidationSchema(true);
export const AppointmentDateValidationSchema = buildAppointmentDateValidationSchema(false);

type FormFields = InferType<ReturnType<typeof buildAppointmentDateValidationSchema>>;
const Field = getTypedField<FormFields>();

export const AppointmentDateSection: React.FC<Props> = ({ isBoom }) => {
  const { t } = useTranslation();
  const { values, setFieldTouched, setFieldValue } = useFormikContext<NewOrderFields>();
  const [isTooltipHovered, setTooltipHovered] = useState(false);
  const RadioButtonRef = createRef<HTMLLabelElement>();

  const photoType = values.pricingPackage?.photoType?.type;
  const isOpenDatePackage = PHOTO_TYPES_OPEN_DATE.includes(`${photoType}`);
  const shootingDuration = values.pricingPackage?.shootingDuration;
  const effectiveDurationInfo = shootingDuration ? getDurationInfoString(shootingDuration) : undefined;

  useEffect(() => {
    isOpenDatePackage
      ? values.knowDateAndTime === null && setFieldValue('knowDateAndTime', KNOWN_VALUE)
      : setFieldValue('knowDateAndTime', !!photoType ? KNOWN_VALUE : null);
  }, [values.knowDateAndTime, photoType, setFieldTouched, setFieldValue, isOpenDatePackage]);

  return (
    <>
      <FormSectionHeader iconName="calendar_today" label={t('forms.newOrder.dateAndTime')} />
      <Typography variantName="caption" style={{ marginBottom: 8 }}>
        {t('shootings.timeZoneDisclaimer')}
      </Typography>
      {isBoom && (
        <RadioButtonGroup
          name="knowDateAndTime"
          onClick={(selectedValue?: string | null) => setFieldValue('knowDateAndTime', selectedValue)}
          selectedValue={values.knowDateAndTime}
          color="#5AC0B1"
        >
          {constsWithTranslations.optionsRadioGroupDate.map(({ value, labelText }: { value: string; labelText: string }) =>
            !isOpenDatePackage && value === UNKNOWN_VALUE ? (
              <React.Fragment key={`rb-${value}`}>
                <Tooltip
                  isVisible={isTooltipHovered}
                  message={t('shootings.openDateNotBookable')}
                  placement="top-start"
                  targetRef={RadioButtonRef}
                  isArrowVisible={false}
                />
                <div onMouseEnter={() => setTooltipHovered(true)} onMouseLeave={() => setTooltipHovered(false)}>
                  <RadioButton value={value} labelText={labelText} reference={RadioButtonRef} disabled />
                </div>
              </React.Fragment>
            ) : (
              <RadioButton key={`rb-${value}`} value={value} labelText={labelText} disabled={!photoType} />
            )
          )}
        </RadioButtonGroup>
      )}
      <RowWrapper>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={moment.locale()} moment={moment}>
          <FieldWrapper>
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
                    value={field.value ? moment.tz(moment.utc(field.value), values.place?.timezone || moment.tz.guess()) : null}
                    leftArrowIcon={<Icon name="arrow_left" />}
                    rightArrowIcon={<Icon name="arrow_right" />}
                    onChange={(value) => {
                      setFieldValue('date', value.valueOf());
                      setFieldValue('startTime', value.valueOf());
                    }}
                    onBlur={() => {
                      setFieldTouched('startTime', true);
                      setFieldTouched('date', true);
                    }}
                    style={{ fontSize: 13, margin: 0 }}
                    disabled={values.knowDateAndTime === UNKNOWN_VALUE || values.pricingPackage === null}
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
                    {t(meta.error!)}
                  </Typography>
                </div>
              )}
            </Field>
          </FieldWrapper>
          <FieldWrapper>
            <Field name="startTime">
              {({ field, meta }) => (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flexBasis: '30%' }}>
                  <Label htmlFor={field.name}>{t('forms.newOrder.time')}</Label>
                  <TimePicker
                    id={field.name}
                    ampm={false}
                    variant="outlined"
                    format="HH:mm"
                    value={field.value ? moment.tz(moment.utc(field.value), values.place?.timezone || moment.tz.guess()) : null}
                    onChange={(value) => {
                      setFieldValue('date', value.valueOf());
                      setFieldValue('startTime', value.valueOf());
                    }}
                    onBlur={() => {
                      setFieldTouched('startTime', true);
                      setFieldTouched('date', true);
                    }}
                    disabled={values.knowDateAndTime === UNKNOWN_VALUE || values.pricingPackage === null}
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
                    {meta.error && t(meta.error!)}
                  </Typography>
                </div>
              )}
            </Field>
          </FieldWrapper>
        </MuiPickersUtilsProvider>
      </RowWrapper>
      <RowWrapper>
        <Typography
          variantName="caption"
          style={{ visibility: effectiveDurationInfo ? 'visible' : 'hidden', marginBottom: 8, display: 'flex' }}
        >
          <Icon name="query_builder" size={16} style={{ marginRight: 13 }} />
          {`${t('forms.shootingWillLast')}: ${effectiveDurationInfo}`}
        </Typography>
      </RowWrapper>
    </>
  );
};
