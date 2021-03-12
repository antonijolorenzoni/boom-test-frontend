import { FileType } from './OrderFileUploadRequest';

export interface FileRemoveResponse {
  type: FileType;
  fileName: string;
}
