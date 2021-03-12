import { AxiosPromise } from 'axios';
import { API_VERSION } from 'config/configurations';
import { BillingInfoDto } from 'types/SubscriptionResponse';
import { OrderPaymentIntentRequest } from 'types/OrderPaymentIntentRequest';
import { OrderPaymentIntentResponse } from 'types/OrderPaymentIntentResponse';
import { axiosBoomInstance } from './instances/boomInstance';
import { ConfirmAndSubscribeResponse } from 'types/ConfirmAndSubscribeResponse';
import { RetrySubscriptionPaymentResponse } from 'types/RetrySubscriptionPaymentResponse';

export const createCardSetupIntent = (companyId?: number) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/cards/setup`);

export const cancelCard = (companyId?: number) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/cards/cancel`);

export const confirmAndSubscribe = (companyId: number, confirmAndSubscribeDto: BillingInfoDto): AxiosPromise<ConfirmAndSubscribeResponse> =>
  axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/subscriptions`, confirmAndSubscribeDto);

export const deleteSubscription = (companyId: number, subscriptionId: string) =>
  axiosBoomInstance.delete(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/subscriptions/${subscriptionId}`);

export const updateSubscription = (companyId: number, subscriptionId: string, subscriptionDto: { billingInfo: BillingInfoDto }) =>
  axiosBoomInstance.patch(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/subscriptions/${subscriptionId}`, subscriptionDto);

export const createPaymentSetupIntent = (companyId?: number) =>
  axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/setup-payment`);

export const createOrderPaymentIntent = (
  companyId: number,
  orderPaymentIntentRequest: OrderPaymentIntentRequest
): AxiosPromise<OrderPaymentIntentResponse> =>
  axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/setup-order-payment`, orderPaymentIntentRequest);

export const retrySubscriptionPayment = (companyId: number): AxiosPromise<RetrySubscriptionPaymentResponse> =>
  axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/retry-latest-invoice-payment`);

export function calcuteOrderPrice(companyId: number, pricingPackageId: number) {
  return axiosBoomInstance.post(`/api/${API_VERSION}/payment-gateway/companies/${companyId}/calculate-total-amount`, {
    pricingPackage: pricingPackageId,
  });
}
