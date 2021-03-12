import { Ordering } from 'types/Ordering';

export const invertOrdering = (ordering: Ordering | null) => {
  switch (ordering) {
    case Ordering.ASC:
      return Ordering.DESC;
    case Ordering.DESC:
      return Ordering.ASC;
    default:
      return ordering;
  }
};
