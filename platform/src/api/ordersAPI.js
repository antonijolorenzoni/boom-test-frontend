import { axiosBoomInstance } from './instances/boomInstance';
import { API_VERSION } from '../config/configurations';

export const deleteOrder = (orderId, cancellationReason, textReason, customPenalties) =>
  axiosBoomInstance.delete(`/api/${API_VERSION}/orders/${orderId}`, {
    data: {
      customPenalties,
      cancellationReason,
      textReason,
    },
  });

export const submitOperationNote = (orderId, text) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderId}/operation-notes`, {
    text,
  });
