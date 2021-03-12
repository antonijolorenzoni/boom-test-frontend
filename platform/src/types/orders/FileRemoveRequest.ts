import { FileType } from './OrderFileUploadRequest';

export interface FileRemoveRequest {
  type: FileType;
  fileName: string;
}
