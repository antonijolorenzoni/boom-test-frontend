import { AxiosPromise } from 'axios';
import { API_VERSION } from 'config/configurations';
import { FileRemoveRequest } from 'types/orders/FileRemoveRequest';
import { FileRemoveResponse } from 'types/orders/FileRemoveResponse';
import { FileUploadCompleteRequest } from 'types/orders/FileUploadCompleteRequest';
import { FileUploadCompleteResponse } from 'types/orders/FileUploadCompleteResponse';
import { FileType, OrderFileUploadRequest } from 'types/orders/OrderFileUploadRequest';
import { OrderFileUploadResponse } from 'types/orders/OrderFileUploadResponse';
import { FilesUploadedResponse } from 'types/orders/FilesUploadedResponse';
import { axiosBoomInstance } from './instances/boomInstance';

export const generateUploadUrls = (orderCode: string, payload: OrderFileUploadRequest): AxiosPromise<OrderFileUploadResponse> =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderCode}/media/initiate`, payload);

export const completeUpload = (orderCode: string, payload: FileUploadCompleteRequest): AxiosPromise<FileUploadCompleteResponse> =>
  axiosBoomInstance.post(`/api/${API_VERSION}/orders/${orderCode}/media/complete`, payload);

export const removeUploadedFile = (orderCode: string, payload: FileRemoveRequest): AxiosPromise<FileRemoveResponse> =>
  axiosBoomInstance.delete(`/api/${API_VERSION}/orders/${orderCode}/media`, { data: payload });

export const getUploadedFiles = (orderCode: string, type: FileType): AxiosPromise<FilesUploadedResponse> =>
  axiosBoomInstance.get(`/api/${API_VERSION}/orders/${orderCode}/media/${type}`);
