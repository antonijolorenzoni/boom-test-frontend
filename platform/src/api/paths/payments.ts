import { API_VERSION } from 'config/configurations';

export const getPaymentMethodById = (id: string, companyId: number) =>
  `/api/${API_VERSION}/payment-gateway/companies/${companyId}/payment-method/${id}`;

export const getPaymentMethod = (companyId: number) => `/api/${API_VERSION}/payment-gateway/companies/${companyId}/payment-method`;

export const getSubscription = (companyId: number) => `/api/${API_VERSION}/payment-gateway/companies/${companyId}/subscriptions`;
