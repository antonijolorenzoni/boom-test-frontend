export const download = (url: string, title: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = title;
  link.click();
};
