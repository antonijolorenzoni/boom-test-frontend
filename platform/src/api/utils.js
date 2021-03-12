const HttpStatus = {
  OK: 200,
};

const isStatusSuccess = (status) => status >= 200 && status < 300;
const isStatusOk = (status) => status === HttpStatus.OK;

export { HttpStatus, isStatusSuccess, isStatusOk };
