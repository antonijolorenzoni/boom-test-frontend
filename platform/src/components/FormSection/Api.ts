import { fetchOrganizations } from 'api/organizationsAPI';
import { fetchOrganizationCompanies, fetchCompanyPricingPackage, fetchCompanyDetails } from 'api/companiesAPI';
import { onFetchGooglePlacesOptions, fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { createShooting } from 'api/shootingsAPI';

export interface Api {
  fetchOrganizations: typeof fetchOrganizations;
  fetchOrganizationCompanies: typeof fetchOrganizationCompanies;
  fetchCompanyPricingPackage: typeof fetchCompanyPricingPackage;
  fetchCompanyDetails: typeof fetchCompanyDetails;
  onFetchGooglePlacesOptions: typeof onFetchGooglePlacesOptions;
  fetchGoogleAddressDetails: typeof fetchGoogleAddressDetails;
  createShooting: typeof createShooting;
}
