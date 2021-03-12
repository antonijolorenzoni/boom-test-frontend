export interface PricingPackage {
  authorizedCompanies?: AuthorizedCompaniesEntity[] | null;
  canChangeEditingOption: boolean;
  companyPrice: number;
  currency: Currency;
  deleted: boolean;
  editingOption: string;
  id: number;
  name: string;
  organizationId: number;
  photoType: PhotoType;
  photographerEarning: number;
  photosQuantity: number;
  shootingDuration: number;
}
export interface AuthorizedCompaniesEntity {
  createdAt: number;
  id: number;
  name: string;
  organization: number;
  parentCompany: number;
  tier: string;
  updatedAt: number;
}
export interface Currency {
  id: number;
  alphabeticCode: string;
  numericCode: number;
  displayName: string;
  symbol: string;
}
export interface PhotoType {
  id: number;
  type: string;
}
