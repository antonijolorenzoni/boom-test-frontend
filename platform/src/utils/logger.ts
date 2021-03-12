import { datadogLogs } from '@datadog/browser-logs';
import { FileType } from 'types/orders/OrderFileUploadRequest';

export enum LogMessage {
  uploadRAWPhotos = 'uploadRAWPhotos',
  acceptShooting = 'acceptShooting',
  refuseShooting = 'refuseShooting',
  uploadMonitoring = 'uploadMonitoring',
}

export enum UploadMonitoringPhase {
  uploadFinished = 'file_upload_finished',
  uploadConfirmed = 'upload_confirmed',
}

export interface SingleUploadInfo {
  orderCode: string;
  startTime: Date;
  endTime: Date;
  fileName: string;
  fileSize: number;
  type: FileType;
  outcome: 'success' | 'failed';
}

export const logSingleUploadFileInfo = ({ orderCode, startTime, endTime, fileName, fileSize, type, outcome }: SingleUploadInfo) => {
  const totalTime = endTime.valueOf() - startTime.valueOf();
  const mbSize = Number((fileSize / 1024 / 1024).toFixed(2));
  const speed = Number((mbSize / (totalTime / 1000)).toFixed(4));

  datadogLogs.logger.info(LogMessage.uploadMonitoring, {
    orderCode,
    fileName,
    fileType: type,
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    fileSize: mbSize,
    speed,
    eventType: UploadMonitoringPhase.uploadFinished,
    outcome,
  });
};

export const logNumberOfFiles = ({
  orderCode,
  photoNumber,
  releaseFormNumber,
}: {
  orderCode: string;
  photoNumber: number;
  releaseFormNumber: number;
}) => {
  datadogLogs.logger.info(LogMessage.uploadMonitoring, {
    orderCode,
    photoNumber,
    releaseFormNumber,
    eventType: UploadMonitoringPhase.uploadConfirmed,
  });
};

export const logExceededFilesNumber = ({ orderCode, filesNumber, limit }: { orderCode: string; filesNumber: number; limit: number }) => {
  datadogLogs.logger.info(LogMessage.uploadMonitoring, {
    orderCode,
    filesNumber,
    limit,
  });
};
