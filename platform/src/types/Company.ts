import { Phototype } from './Phototype';

// this is what we find on redux store, not the correct API response. Once we rework the companies section we'll going to reworks also type defs :)
export interface Company {
  createdAt: number;
  id: number;
  name: string;
  tier: string;
  updatedAt: number;
  organization: number;
  parentCompany: number;
  phoneNumber?: string;
  photoTypes?: Array<Phototype>;
  language?: string;
  googleAuthorized?: boolean;
  email?: string;
  address?: string;

  logo?: string;
}
