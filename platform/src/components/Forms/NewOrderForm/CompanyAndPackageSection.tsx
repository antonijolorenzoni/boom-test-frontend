import React from 'react';
import _ from 'lodash';
import { object, InferType } from 'yup';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { FormSectionHeader } from 'components/FormSectionHeader';
import { AsyncDropdown, Typography } from 'ui-boom-components';
import { RowWrapper, FieldWrapper, SpacedWrapper } from '../styles';
import { OrganizationTier } from 'config/consts';
import { NewOrderFields } from '.';
import { Api } from 'components/FormSection/Api';
import { PricingPackage } from 'types/PricingPackage';
import { Option } from 'types/Option';
import { PackageRow } from './PackageRow';
import { requiredMessageKey } from 'utils/validations';
import { getTypedField } from 'components/TypedFields';
import { Segment } from 'types/Segment';

interface Props {
  api: Api;
  pricingPackages: Array<PricingPackage>;
  onSetPricingPackages: (ps: Array<PricingPackage>) => void;
  onSetCompanyDetails: (d: any) => void;
  isBoom: boolean;
}

export const CompanyValidationSchema = object({
  organization: object<Option, Option>().nullable().required(requiredMessageKey),
  company: object<Option, Option>().nullable().required(requiredMessageKey),
}).required();

type FormFields = InferType<typeof CompanyValidationSchema>;
const Field = getTypedField<FormFields>();

export const CompanyAndPackageSection: React.FC<Props> = ({ api, pricingPackages, onSetPricingPackages, onSetCompanyDetails, isBoom }) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext<NewOrderFields>();
  const { t } = useTranslation();

  const organizationId = values?.organization?.value ?? null;
  const company = values.company;

  const fetchOrganizationsByName = (name: any) =>
    api
      .fetchOrganizations({
        name,
        page: 0,
        pageSize: 20,
        tier: isBoom ? OrganizationTier.Enterprise : undefined,
        segment: isBoom ? Segment.ENTERPRISE : undefined,
      })
      .then((response: any) =>
        response.data.content.map((item: any) => ({
          label: item.name,
          value: item.id,
          deliverToMainContact: item.deliverToMainContact,
        }))
      );

  const fetchCompaniesByOrganizationId = (organizationId: any) => (name: any) =>
    organizationId === null || typeof organizationId === 'undefined'
      ? Promise.resolve([])
      : api
          .fetchOrganizationCompanies(organizationId, {
            name,
            page: 0,
            pageSize: 20,
          })
          .then((response: any) =>
            response.data.content.map((item: any) => ({
              label: item.name,
              value: item.id,
            }))
          );

  const fetchCompaniesDetailsById = (organizationId: any, companyId: any) =>
    organizationId !== null && companyId !== null
      ? api.fetchCompanyDetails(organizationId, companyId).then((response: any) => response.data)
      : Promise.resolve(null);

  const fetchPricingPackageByOrganizationIdAndCompanyId = (organizationId: any, companyId: any) =>
    organizationId !== null && companyId !== null
      ? api
          .fetchCompanyPricingPackage(organizationId, companyId)
          .then((response: any) => response.data)
          .catch(() => [])
      : Promise.resolve([]);

  return (
    <>
      <FormSectionHeader iconName="domain" label={t('forms.newOrder.shootingCompanyData')} />
      <RowWrapper>
        <FieldWrapper>
          <Field name="organization">
            {({ field, meta }) =>
              isBoom ? (
                <AsyncDropdown
                  label={t('forms.newOrder.organizationName')}
                  fetcher={fetchOrganizationsByName}
                  {...field}
                  id={field.name}
                  value={field.value}
                  onChange={(option: any) => {
                    if (!_.isEqual(option, field.value)) {
                      setFieldValue('organization', option);
                      setFieldValue('company', null);
                      setFieldValue('pricingPackage', null);
                      setFieldValue('editingOption', null);
                      setFieldValue('deliveryMethodsIsDriveSelected', false);
                      setFieldValue('driveFolderId', null);
                      setFieldValue('driveFolderName', null);
                      onSetCompanyDetails(null);
                      onSetPricingPackages([]);
                    }
                  }}
                  onBlur={() => setFieldTouched('organization', true)}
                  isClearable
                  error={meta.touched ? t(meta.error!) : undefined}
                  required
                />
              ) : (
                <>
                  <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
                    {t('forms.newOrder.organizationName')}
                  </Typography>
                  <SpacedWrapper>
                    <Typography variantName="title3" textColor="#000000">
                      {values.organization?.label}
                    </Typography>
                  </SpacedWrapper>
                </>
              )
            }
          </Field>
        </FieldWrapper>
        <FieldWrapper>
          <Field name="company">
            {({ field, meta }) => (
              <AsyncDropdown
                label={t('forms.newOrder.companyName')}
                fetcher={fetchCompaniesByOrganizationId(organizationId)}
                {...field}
                id={field.name}
                value={field.value}
                onChange={(option: any) => {
                  if (!_.isEqual(option, field.value)) {
                    setFieldValue('company', option);
                    setFieldValue('pricingPackage', null);
                    setFieldValue('editingOption', null);
                    setFieldValue('driveFolderId', null);
                    setFieldValue('driveFolderName', null);
                    fetchPricingPackageByOrganizationIdAndCompanyId(organizationId, option?.value ?? null).then(onSetPricingPackages);
                    fetchCompaniesDetailsById(organizationId, option?.value ?? null).then((details: any) => {
                      onSetCompanyDetails(details);
                      setFieldValue('deliveryMethodsIsDriveSelected', !!details?.googleAuthorized);
                    });
                  }
                }}
                onBlur={() => setFieldTouched('company', true)}
                isClearable
                error={meta.touched ? t(meta.error!) : undefined}
                required
                disabled={organizationId === null}
              />
            )}
          </Field>
        </FieldWrapper>
      </RowWrapper>
      <PackageRow pricingPackages={pricingPackages} disabled={organizationId === null || company === null} />
    </>
  );
};
