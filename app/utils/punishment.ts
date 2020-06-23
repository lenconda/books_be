import moment from 'moment';

export const punishment = (start: Date) => {
  const current = new Date();
  return moment(current).diff(moment(start), 'days');
};
