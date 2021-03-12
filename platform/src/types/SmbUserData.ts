import { SmbProfile } from './SmbProfile';

export type SmbUserData = Pick<SmbProfile, 'firstName' | 'lastName' | 'phoneNumber' | 'email' | 'companyId'> & { language: string };
