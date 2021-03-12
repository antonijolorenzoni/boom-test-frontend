import { Segment } from './Segment';

export interface Organization {
  createdAt: number;
  domain: string;
  id: number;
  name: string;
  tier: string;
  segment: Segment;
  updatedAt: number;
  deliverToMainContact: boolean;
}
