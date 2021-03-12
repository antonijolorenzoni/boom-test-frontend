export interface SmbProfile {
  companyId: number;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  jobTitle: string;
  phoneNumber: string;
  language: string;
  languageIsoCode: string;
  activationDate: number;
  organization: number;
  roles?: RolesEntity[] | null;
  enabled: boolean;
  deleted: boolean;
}

export interface RolesEntity {
  id: number;
  name: string;
}
