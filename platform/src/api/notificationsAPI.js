//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A P I S   F O R   R E T R I E V E   P L A T F O R M   N O T I F I C A T I O N S   A N D   M A R K   T H E M   A S   R E A D : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export function fetchNotifications(params) {
  const paramsToSend = {
    params,
  };
  return axiosBoomInstance.get(`/api/${API_VERSION}/notifications`, paramsToSend);
}

export function markNotificationAsRead(notificationId) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/notifications/${notificationId}/seen`);
}
