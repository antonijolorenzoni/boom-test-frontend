import useSWR from 'swr';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { Reason } from 'types/Reason';
import { listForceUploadReasons } from 'api/paths/reasons';
import { listRefuseReasons } from 'api/paths/reasons';
import { listReshootReasons } from 'api/paths/reasons';
import { listCancellationReasons } from 'api/paths/reasons';
import { listDiscardReasons } from 'api/paths/reasons';
import { listRevokeAvailabilityReasons } from 'api/paths/reasons';
import { ReasonRoles } from 'config/consts';

type UrlConstructor = (e: { orderStatus: string; role: Array<string> }) => string;

const getUseReason = (toUrl: UrlConstructor) => (actorReasonRole: Array<string>, orderStatus: string) => {
  const { data: reasons, error, mutate } = useSWR<{ data: Array<Reason> }>(
    actorReasonRole.length ? toUrl({ orderStatus, role: actorReasonRole }) : null,
    axiosBoomInstance.get
  );

  return { reasons: reasons?.data || [], error, mutate };
};

export const useForceUploadReasons = getUseReason(listForceUploadReasons);
export const useRefuseReasons = getUseReason(listRefuseReasons);
export const useReshootReason = getUseReason(listReshootReasons);
export const useCancellationReasons = getUseReason(listCancellationReasons);
export const usePhotographerDiscardReasons = (orderStatus: string) =>
  getUseReason(listDiscardReasons)([ReasonRoles.PHOTOGRAPHER], orderStatus);
export const usePhotographerRevokeAvailabilityReasons = (orderStatus: string) =>
  getUseReason(listRevokeAvailabilityReasons)([ReasonRoles.PHOTOGRAPHER], orderStatus);
