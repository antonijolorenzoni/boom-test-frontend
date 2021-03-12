import { uploadMediaS3 } from 'api/awsAPI';
import { completeUpload, generateUploadUrls, removeUploadedFile } from 'api/orderFileAPI';
import { RemoteFile } from 'components/common/FileUpload';
import { sleep } from 'utils/promises';
import { FileType, OrderFileUploadRequest } from 'types/orders/OrderFileUploadRequest';
import { logSingleUploadFileInfo, SingleUploadInfo } from 'utils/logger';

// 10 MB in order to pass the minimum allowed object size by AWS fixed to 5MB
const FILE_CHUNK_SIZE = 10_485_760;
const HOUR_IN_MILLISECONDS = 3600_000;

type PushProgress = (f: File, l: number, failed: boolean, completed?: boolean) => void;

export const upload = async (orderCode: string, type: FileType, files: File[], pushProgress: PushProgress) => {
  const payload: OrderFileUploadRequest = {
    uploads: [
      {
        type,
        files: files.map((file) => ({
          fileName: file.name,
          numberOfParts: Math.ceil(file.size / FILE_CHUNK_SIZE),
        })),
      },
    ],
  };

  const fileNameToFile = new Map(files.map((f) => [f.name, f]));

  try {
    const response = await generateUploadUrls(orderCode, payload);
    response.data.fileLinks.forEach((uploadLinks) =>
      uploadFile(orderCode, fileNameToFile.get(uploadLinks.fileName)!, type, uploadLinks.presignedLinks, FILE_CHUNK_SIZE, pushProgress)
    );
  } catch {
    files.forEach((file) => pushProgress(file, 0, true));
  }
};

export const remove = async (orderCode: string, type: FileType, files: RemoteFile[]) =>
  await Promise.all(files.map((file) => removeUploadedFile(orderCode, { fileName: file.name, type })));

const uploadFile = async (orderCode: string, file: File, type: FileType, urls: string[], chunkSize: number, pushProgress: PushProgress) => {
  const totalChunks = urls.length;
  const startTime = new Date();

  try {
    const eTags: string[] = await urls.reduce<Promise<string[]>>(async (accP, url, index) => {
      const start = index * chunkSize;
      const end = (index + 1) * chunkSize;
      const blobChunk = file.slice(start, end);

      const acc = await accP;

      let attempt = 0;

      while (true) {
        try {
          const response = await uploadMediaS3(url, blobChunk, (progress: number) =>
            pushProgress(file, (100 / totalChunks) * index + progress / totalChunks, false)
          );
          return [...acc, (response.headers.etag as string).replace(/"/g, '')];
        } catch (e) {
          const waitingTime = 2 ** attempt * 100;
          attempt += 1;
          await sleep(waitingTime);
          if (waitingTime > HOUR_IN_MILLISECONDS) {
            return Promise.reject(e);
          }
        }
      }
    }, Promise.resolve([]));

    const payload = {
      hashes: eTags.map((etag, index) => ({
        etag,
        partNumber: index + 1,
      })),
      type,
      fileName: file.name,
    };

    const {
      data: { failed },
    } = await completeUpload(orderCode, payload);

    const endTime = new Date();
    const logInfo: Omit<SingleUploadInfo, 'outcome'> = {
      orderCode,
      startTime,
      endTime,
      fileName: file.name,
      fileSize: file.size,
      type,
    };

    if (failed.length) {
      pushProgress(file, 0, true);
      logSingleUploadFileInfo({
        ...logInfo,
        outcome: 'failed',
      });
    } else {
      pushProgress(file, 100, false, true);
      logSingleUploadFileInfo({
        ...logInfo,
        outcome: 'success',
      });
    }
  } catch (error) {
    pushProgress(file, 0, true);
  }
};
