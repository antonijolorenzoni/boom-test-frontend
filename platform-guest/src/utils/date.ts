import moment from 'moment';

export const isDayBlocked = (date: string) => {
  const momentDate = moment(date);
  return [
    [1, 1],
    [12, 25],
  ].some((arr) => arr[0] === momentDate.get('month') + 1 && arr[1] === momentDate.get('date'));
};
