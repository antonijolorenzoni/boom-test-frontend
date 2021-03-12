export const toHumanReadableSize = (size: number) => {
  const pow = Math.floor(Math.log2(size) / 10);
  const index = Number.isFinite(pow) ? pow : 0;
  const suffix = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][index];

  return `${(size / 1024 ** index).toFixed(2)} ${suffix}`;
};
