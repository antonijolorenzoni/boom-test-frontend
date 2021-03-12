import { Ordering } from 'types/Ordering';

export const getOrderIconName = (ordering: Ordering | null): string => {
  switch (ordering) {
    case Ordering.ASC:
      return 'arrow_upward';
    case Ordering.DESC:
      return 'arrow_downward';
    default:
      return 'import_export';
  }
};
