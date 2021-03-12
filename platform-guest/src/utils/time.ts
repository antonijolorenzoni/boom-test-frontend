import i18n from 'i18n';

export const getDurationString = (duration: number, short: boolean = true): string => {
  const minutes: number = duration % 60;
  const hours: number = (duration - minutes) / 60;

  const hoursLabel = `${hours} ${i18n.t(short ? 'general.hourShort' : 'general.hour', { count: hours })}`;
  const minutesLabel = `${minutes} ${i18n.t(short ? 'general.minuteShort' : 'general.minute', { count: minutes })}`;

  return hours !== 0 && minutes !== 0 ? `${hoursLabel} ${minutesLabel}` : hours !== 0 ? hoursLabel : minutesLabel;
};
