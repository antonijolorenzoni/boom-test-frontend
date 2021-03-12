export type FileType = 'RAW' | 'RELEASE_FORM';

export interface OrderFileUploadRequest {
  uploads: UploadRequest[];
}

export interface UploadRequest {
  type: FileType;
  files: FileMeta[];
}

export interface FileMeta {
  fileName: string;
  numberOfParts: number;
}
