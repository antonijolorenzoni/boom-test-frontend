import { FileType } from './OrderFileUploadRequest';

export interface FileUploadCompleteRequest {
  hashes: Hash[];
  type: FileType;
  fileName: string;
}

export interface Hash {
  etag: string;
  partNumber: number;
}
