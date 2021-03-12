export type OrderFileUploadResponse = {
  fileLinks: UploadLinks[];
};

export interface UploadLinks {
  fileName: string;
  presignedLinks: string[];
}
