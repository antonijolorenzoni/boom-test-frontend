export interface FileUploadCompleteResponse {
  successful: Hash[];
  failed: Hash[];
}

interface Hash {
  hash: string;
  partNumber: number;
}
