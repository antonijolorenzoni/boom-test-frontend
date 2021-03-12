import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Typography } from 'ui-boom-components/lib';
import { FormButtons } from '../FormComponents/FormButtons';
import { useTranslation } from 'react-i18next';
import { Tier } from 'types/Tier';
import { Badge } from 'components/Badge';
import { CompanyDataSection, CompanyDataValidationSchema } from './CompanyDataSection';
import { Company } from 'types/Company';
import { Phototype } from 'types/Phototype';
import { BillingInfoSection, BillingInfoValidationSchema } from '../common/BillingInfoSection';
import { object, string } from 'yup';
import { AddressDto } from 'types/AddressDto';
import { fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { useSubscription } from 'hook/useSubscription';
import { ImportantSpacedWrapper } from '../styles';
import { LANGUAGE_LOCAL_MAP } from 'config/consts';
import { BillingInfoDto } from 'types/SubscriptionResponse';
import { LineBreak } from 'components/common/LineBreak';
import { useWhoAmI } from 'hook/useWhoAmI';
import { useSelector } from 'react-redux';
import { Segment } from 'types/Segment';
import { featureFlag } from 'config/featureFlags';

interface Props {
  company: Company;
  photoTypesList: Array<Phototype>;
  onSubmit: (companyDto: any, billingInfos: BillingInfoDto) => void;
  onCancel: () => void;
}

const getValidationSchema = (isBoom: boolean) =>
  object({ _: string().notRequired() }).concat(CompanyDataValidationSchema).concat(BillingInfoValidationSchema(isBoom)).required();

export const CompanyFormSmb: React.FC<Props> = ({ company, photoTypesList, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [initialFullAddress, setInitialFullAddress] = useState<{ value: AddressDto; label: string }>();
  const { selectedOrganization } = useSelector((state: any) => ({
    selectedOrganization: state.organizations.selectedOrganization,
  }));
  const { isBoom } = useWhoAmI();

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const { name, photoTypes, language, phoneNumber, logo, tier } = company;
  const smbCompany = isB1Enabled ? Segment.SMB === selectedOrganization.segment : Tier.SMB === tier;
  const { subscription } = useSubscription(smbCompany, company.id);
  const corporateName = subscription?.billingInfoDto.corporateName || '';
  const vatNumber = subscription?.billingInfoDto.vatNumber || '';
  const country = subscription?.billingInfoDto.country || '';
  const address = subscription?.billingInfoDto.address || '';
  const city = subscription?.billingInfoDto.city || '';
  const zipCode = subscription?.billingInfoDto.zipCode || '';
  const sdiCode = subscription?.billingInfoDto.sdiCode || '';
  const vatRate = subscription?.billingInfoDto.vatRate || '';

  useEffect(() => {
    // to be complaint to the current fetchGoogleAddressDetails implementation we need to pass the object :|
    fetchGoogleAddressDetails({ label: address }).then((result) => {
      if (result) {
        const street = result.street ?? '';
        const streetNumber = result.street_number ?? '';
        setInitialFullAddress({ value: result, label: `${street} ${streetNumber}`.trim() });
      }
    });
  }, [address]);

  return (
    <Formik
      initialValues={{
        businessName: name,
        logo: '',
        phoneNumber,
        language,
        photoTypes: photoTypes?.map((pt: Phototype) => pt.type) || [],
        corporateName,
        vatNumber,
        vatRate,
        country,
        address: initialFullAddress,
        city,
        zipCode,
        sdiCode,
      }}
      validationSchema={() => getValidationSchema(isBoom)}
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
        const billingInfo: BillingInfoDto = {
          address: values.address!.label,
          city: values.city,
          corporateName: values.corporateName,
          country: values.country,
          sdiCode: values.sdiCode,
          vatNumber: values.vatNumber,
          zipCode: values.zipCode,
          vatRate: values.vatRate,
        };
        onSubmit(companyDto, billingInfo);
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form data-testid="company-form-smb" noValidate>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              {logo && <img src={company.logo} style={{ height: 50, borderRadius: 10, marginRight: 20 }} alt="company_logo" />}
              <Typography variantName="title2" style={{ marginRight: 45 }}>
                {(company && company.name) || t('company.newCompany')}
              </Typography>
              <Badge color="#A3ABB1" text="SMB" />
            </div>
            <CompanyDataSection photoTypesList={photoTypesList} />
            <ImportantSpacedWrapper>
              <LineBreak />
            </ImportantSpacedWrapper>
            <BillingInfoSection />
            <div style={{ marginTop: 24 }}>
              <FormButtons loading={props.isSubmitting} onCancel={onCancel} submitLabel={t('forms.save')} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
