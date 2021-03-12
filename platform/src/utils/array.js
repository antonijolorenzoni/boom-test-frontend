const join = (arr, value) => arr.reduce((acc, e, index) => (!!index ? [...acc, value, e] : [e]), []);

export { join };
