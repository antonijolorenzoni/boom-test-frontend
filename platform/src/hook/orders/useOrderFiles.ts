import { getUploadedFiles } from 'api/orderFileAPI';
import { FileUpload, isFile } from 'components/common/FileUpload';
import { useState, useEffect } from 'react';
import { upload, remove } from 'service/uploadOrderFiles';
import { FileType } from 'types/orders/OrderFileUploadRequest';

export const useOrderFiles = (orderCode: string, type: FileType) => {
  const [files, setFiles] = useState<FileUpload[]>([]);

  const uploadFiles = (newFiles: File[]) => {
    upload(orderCode, type, newFiles, (f: File, l: number, failed: boolean, completed?: boolean) =>
      setFiles((files) =>
        files.map((fileUpload) =>
          fileUpload.file === f
            ? {
                ...fileUpload,
                load: fileUpload.failed || failed ? 0 : l,
                failed: fileUpload.failed || failed,
                completed: Boolean(completed),
              }
            : fileUpload
        )
      )
    );
  };

  const addFiles = (newFiles: File[]) => {
    setFiles((files) => {
      const oldFiles = files.filter((fileUpload) => !newFiles.some((file) => file.name === fileUpload.file.name));

      return [...oldFiles, ...newFiles.map((file) => ({ file, load: 0, failed: false, completed: false }))];
    });

    uploadFiles(newFiles);
  };

  const removeFiles = (filesToRemove: FileUpload[]) =>
    remove(
      orderCode,
      type,
      filesToRemove.map(({ file }) => file)
    ).then(() => setFiles((files) => files.filter((fileUpload) => !filesToRemove.includes(fileUpload))));

  const retryFiles = async (filesToRetry: FileUpload[]) => {
    setFiles((files) =>
      files.map((fileUpload) => (filesToRetry.includes(fileUpload) ? { ...fileUpload, load: 0, failed: false } : fileUpload))
    );
    try {
      await remove(
        orderCode,
        type,
        filesToRetry.map(({ file }) => file)
      );
    } finally {
      uploadFiles(filesToRetry.map(({ file }) => file).filter(isFile));
    }
  };

  useEffect(() => {
    const fetchOrderFiles = async () => {
      const {
        data: { files },
      } = await getUploadedFiles(orderCode, type);

      const uploadedFiles = files.map(({ name, size }) => ({
        file: { name, size },
        load: 100,
        completed: true,
        failed: false,
      }));

      setFiles((fs) => [...uploadedFiles, ...fs]);
    };

    fetchOrderFiles();
  }, [orderCode, type]);

  return { files, addFiles, removeFiles, retryFiles };
};
