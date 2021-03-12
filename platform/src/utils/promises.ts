const SettledPromiseStatus = {
  REJECTED: 'rejected',
  FULLFILLED: 'fullfilled',
};

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export { SettledPromiseStatus };
