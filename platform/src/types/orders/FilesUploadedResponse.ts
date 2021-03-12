export interface UploadedFile {
  name: string;
  size: number;
}

export interface FilesUploadedResponse {
  files: UploadedFile[];
}
