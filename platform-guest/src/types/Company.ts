import { Guideline } from './Guideline';

export interface Company {
  guidelines: Guideline | null;
  name: string;
  organization: {
    id: number;
  };
}
