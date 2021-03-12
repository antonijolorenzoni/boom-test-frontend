import { revertToOriginalStatuses } from './utils';
import { SHOOTINGS_STATUSES, COMPANIES_ORDER_STATUSES_TRANSLATION_MAP } from './consts';

describe('revertToOriginalStatuses', () => {
  it('should return original statuses from COMPANIES_ORDER_STATUSES_TRANSLATION_MAP for ACCEPTED status', () => {
    expect(revertToOriginalStatuses([SHOOTINGS_STATUSES.ACCEPTED], COMPANIES_ORDER_STATUSES_TRANSLATION_MAP)).toMatchSnapshot();
  });

  it('should return original statuses from COMPANIES_ORDER_STATUSES_TRANSLATION_MAP for POST_PROCESSING status', () => {
    expect(revertToOriginalStatuses([SHOOTINGS_STATUSES.POST_PROCESSING], COMPANIES_ORDER_STATUSES_TRANSLATION_MAP)).toMatchSnapshot();
  });

  it('should return original statuses from COMPANIES_ORDER_STATUSES_TRANSLATION_MAP for a mix of statuses', () => {
    expect(
      revertToOriginalStatuses(
        [SHOOTINGS_STATUSES.DONE, SHOOTINGS_STATUSES.ACCEPTED, SHOOTINGS_STATUSES.POST_PROCESSING],
        COMPANIES_ORDER_STATUSES_TRANSLATION_MAP
      )
    ).toMatchSnapshot();
  });
});
