import { axiosBoomInstance } from 'api/axiosBoomInstance';

export const updateBoLanguage = (orderCode: string, language: string) =>
  axiosBoomInstance.put(`/orders/${orderCode}/business-owner/language`, { language });
