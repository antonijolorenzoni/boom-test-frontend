import React from 'react';
import { InferType, mixed, object, string } from 'yup';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Typography, RadioButtonGroup, RadioButton, TextField, Button, Label } from 'ui-boom-components';

import { createOrganization } from 'api/organizationsAPI';
import { fetchRootCompanies } from 'redux/actions/companies.actions';
import { hideModal } from 'redux/actions/modals.actions';
import translations from 'translations/i18next';
import { OrganizationTier } from 'config/consts';
import { featureFlag } from 'config/featureFlags';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { Segment } from 'types/Segment';
import { getTypedField } from 'components/TypedFields';
import { useAlertModal } from 'hook/useAlertModal';

const OrganizationValidationSchema = object({
  name: string().nullable().trim().required(translations.t('forms.required')),
  segment: mixed().oneOf(Object.values(Segment)).required(translations.t('forms.required')),
}).required();

type FormFields = InferType<typeof OrganizationValidationSchema>;
const Field = getTypedField<FormFields>();

const segmentOption = [
  { value: Segment.SMB, label: 'smallMediumBusiness' },
  { value: Segment.MID_MARKET, label: 'midMarket' },
  { value: Segment.ENTERPRISE, label: 'enterprise' },
];

const segmentOptionNoMM = [
  { value: Segment.SMB, label: 'smallMediumBusiness' },
  { value: Segment.ENTERPRISE, label: 'enterprise' },
];

export const CreateOrganizationForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const showAlert = useAlertModal();

  const isSmbS1Enabled = featureFlag.isFeatureEnabled('smb-s1');
  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const getTier = (segment: Segment) => {
    if (Segment.SMB === segment) {
      return OrganizationTier.SMB;
    }
    return OrganizationTier.Enterprise;
  };

  return (
    <div style={{ marginTop: 20, marginRight: 20, padding: 20 }}>
      <Typography variantName="title2" style={{ marginBottom: 10 }}>
        {t(isB1Enabled ? 'organization.newOrganizationTitle' : 'organization.createOrganizationTitle')}
      </Typography>
      <Typography variantName="body2" style={{ marginBottom: 30 }}>
        {t('organization.createOrganizationSubtitle')}
      </Typography>
      {isB1Enabled && <FormSectionHeader label={t('organization.generalInfo')} iconName="domain" />}
      <Formik
        initialValues={{
          name: '',
          segment: Segment.ENTERPRISE,
        }}
        validationSchema={OrganizationValidationSchema}
        onSubmit={async (values) => {
          try {
            await createOrganization({ name: values.name, segment: values.segment, tier: getTier(values.segment) });
            dispatch(fetchRootCompanies());
            dispatch(hideModal('ORGANIZATION_FORM'));
            showAlert(t('organization.createOrganizationSuccess'), 'success');
          } catch (error) {
            showAlert(t('organization.createOrganizationError'), 'error');
          }
        }}
      >
        {(props) => {
          return (
            <Form noValidate>
              <Field name="name">
                {({ field, meta }) => (
                  <TextField label={t('organization.name')} {...field} error={meta.touched ? t(meta.error!) : undefined} required />
                )}
              </Field>
              {isSmbS1Enabled && (
                <Field name="segment">
                  {({ field }) => (
                    <>
                      <Label htmlFor={field.name} required>
                        {isB1Enabled ? t('organization.segment') : t('organization.tier')}
                      </Label>
                      <RadioButtonGroup
                        name={field.name}
                        onClick={(value) => {
                          props.setFieldValue(field.name, value);
                        }}
                        selectedValue={field.value}
                        color="#5AC0B1"
                      >
                        {(isB1Enabled ? segmentOption : segmentOptionNoMM).map((segment) => (
                          <RadioButton key={segment.value} value={segment.value} labelText={t(`organization.${segment.label}`)} />
                        ))}
                      </RadioButtonGroup>
                    </>
                  )}
                </Field>
              )}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  data-testid="create-organization-btn"
                  style={{
                    marginTop: 60,
                    width: 95,
                  }}
                  type="submit"
                  disabled={props.isSubmitting}
                >
                  {t('forms.save')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
