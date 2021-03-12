import { API_VERSION } from 'config/configurations';

export const getPricingPackage = (organizationId: number) => `/api/${API_VERSION}/organizations/${organizationId}/pricingPackages`;

export const getCompanyPricingPackage = (organizationId: number, companyId: number) =>
  `/api/${API_VERSION}/organizations/${organizationId}/companies/${companyId}/pricingPackages`;
