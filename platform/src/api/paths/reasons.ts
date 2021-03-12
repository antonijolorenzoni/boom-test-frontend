import qs from 'query-string';
import { API_VERSION } from 'config/configurations';

type ReasonsDto = {
  orderStatus: string;
  role: Array<string>;
};

export const listCancellationReasons = (reasonDto: ReasonsDto) => `/api/${API_VERSION}/reasons/cancellation?${qs.stringify(reasonDto)}`;

export const listDiscardReasons = (reasonDto: ReasonsDto) => `/api/${API_VERSION}/reasons/discard?${qs.stringify(reasonDto)}`;

export const listRevokeAvailabilityReasons = (reasonDto: ReasonsDto) => `/api/${API_VERSION}/reasons/revoke?${qs.stringify(reasonDto)}`;

export const listRefuseReasons = (reasonDto: ReasonsDto) => `/api/${API_VERSION}/reasons/refuse?${qs.stringify(reasonDto)}`;

export const listReshootReasons = (reasonDto: ReasonsDto) => `/api/${API_VERSION}/reasons/reshoot?${qs.stringify(reasonDto)}`;

export const listForceUploadReasons = (reasonDto: ReasonsDto) => `/api/${API_VERSION}/reasons/force-upload?${qs.stringify(reasonDto)}`;
