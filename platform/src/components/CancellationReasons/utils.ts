import { Reason } from 'types/Reason';

export const getActorsAvailable = (reasons: Array<Reason>): Array<string> =>
  Array.from(new Set(reasons.map((r) => r.code.substring(0, 4))));
