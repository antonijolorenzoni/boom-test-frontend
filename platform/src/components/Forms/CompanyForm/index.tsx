import React from 'react';
import { Form, Formik } from 'formik';
import { Typography } from 'ui-boom-components';
import { FormButtons } from '../FormComponents/FormButtons';
import { useTranslation } from 'react-i18next';
import { CompanyDataSection, CompanyDataValidationSchema } from './CompanyDataSection';
import { Company } from 'types/Company';
import { Phototype } from 'types/Phototype';
import { object, string } from 'yup';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';
import { CompanyDeliveryPreferencesSection, CompanyDeliveryPrefsValidationSchema } from './CompanyDeliveryPreferencesSection';
import { Tier } from 'types/Tier';
import { useWhoAmI } from 'hook/useWhoAmI';
import { featureFlag } from 'config/featureFlags';
import { useSelector } from 'react-redux';
import { Segment } from 'types/Segment';

interface Props {
  company: Company;
  deliverToMainContact: boolean;
  subCompany: boolean;
  photoTypesList: Array<Phototype>;
  onSubmit: (companyDto: any, deliverToMainContact: boolean) => void;
  onCancel: () => void;
}

const getValidationSchema = () =>
  object({ _: string().notRequired() }).concat(CompanyDataValidationSchema).concat(CompanyDeliveryPrefsValidationSchema).required();

export const CompanyForm: React.FC<Props> = ({ company, deliverToMainContact, subCompany, photoTypesList, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const { isBoom } = useWhoAmI();
  const { selectedOrganization } = useSelector((state: any) => ({
    selectedOrganization: state.organizations.selectedOrganization,
  }));

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const { name, photoTypes, language, phoneNumber, logo } = company;

  const isEnterprise = isB1Enabled ? Segment.ENTERPRISE === selectedOrganization.segment : Tier.ENTERPRISE === company.tier;

  return (
    <Formik
      initialValues={{
        businessName: name,
        logo: '',
        phoneNumber,
        language,
        photoTypes: photoTypes?.map((pt: Phototype) => pt.type) || [],
        deliveryMainContact: deliverToMainContact,
      }}
      validationSchema={getValidationSchema}
      onSubmit={async (values, actions) => {
        const photoTypesIDList = photoTypesList
          .filter((pt: Phototype) => values.photoTypes.includes(pt.type))
          .map((pt: Phototype) => pt.id);
        const companyDto = {
          ...company,
          name: values.businessName,
          phoneNumber: values.phoneNumber,
          photoTypes: photoTypesIDList,
          language: Object.values(LANGUAGE_LOCAL_MAP).find((l) => l.key === values.language)?.backend,
          logo: values.logo,
        };
        onSubmit(companyDto, values.deliveryMainContact);
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form data-testid="company-form" noValidate>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              {logo && <img src={company.logo} style={{ height: 50, borderRadius: 10, marginRight: 20 }} alt="company_logo" />}
              <Typography variantName="title2" style={{ marginRight: 45 }}>
                {(company && company.name) || t('company.newCompany')}
              </Typography>
            </div>
            <CompanyDataSection photoTypesList={photoTypesList} />
            {isEnterprise && <CompanyDeliveryPreferencesSection disabled={subCompany || !isBoom} />}
            <div style={{ marginTop: 24 }}>
              <FormButtons loading={props.isSubmitting} onCancel={onCancel} submitLabel={t('forms.save')} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
