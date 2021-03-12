const buildUrl = (csv) => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const type = isSafari ? 'application/csv' : 'text/csv';
  const blob = new Blob([csv], { type });
  const dataURI = `data:${type};charset=utf-8,${csv}`;

  const URL = window.URL || window.webkitURL;

  return typeof URL.createObjectURL === 'undefined' ? dataURI : URL.createObjectURL(blob);
};

export { buildUrl };
