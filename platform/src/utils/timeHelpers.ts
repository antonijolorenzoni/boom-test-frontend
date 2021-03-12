import _ from 'lodash';
import translations from 'translations/i18next';

export const MINUTES_IN_HOUR = 60;

export const getDurationInfo = (shootingDuration: number) => {
  let shootingDurationHours = Math.floor(shootingDuration / MINUTES_IN_HOUR);
  // approximate to half an hour
  const shootingDurationMinutes = shootingDuration % MINUTES_IN_HOUR;
  const isHalfHour = shootingDurationMinutes >= 15 && shootingDurationMinutes <= 45;

  if (shootingDurationMinutes > 45) {
    shootingDurationHours += 1;
  }

  return { shootingDurationHours, isHalfHour };
};

export const getDurationInfoString = (shootingDuration: number) => {
  const { shootingDurationHours: hours, isHalfHour } = getDurationInfo(shootingDuration);

  if (hours === 0) {
    return translations.t('organization.lt_hour');
  }

  const hoursInfo = `${hours > 0 ? `${hours} ${translations.t('organization.hour', { count: hours })}` : ''}`;
  const and = `${hours > 0 && isHalfHour ? translations.t('general.and') : ''}`;
  const half = isHalfHour ? translations.t('organization.half_hour') : '';

  return `${hoursInfo} ${and} ${half}`.trim();
};

export const getFormattedTimer = (ms: number) => {
  const hours: number = Math.floor(ms / 3600000);
  const minutes: number = Math.floor((ms % 3600000) / 60000);
  const seconds: number = Math.floor(((ms % 360000) % 60000) / 1000);

  const padTimerValue = (value: number) => _.padStart(value.toString(), 2, '0');

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    formattedValue: `${padTimerValue(hours)}h : ${padTimerValue(minutes)}m : ${padTimerValue(seconds)}s`,
  };
};

export const getDurationString = (duration: number, short: boolean = true): string => {
  const minutes: number = duration % 60;
  const hours: number = (duration - minutes) / 60;

  const hoursLabel = `${hours} ${translations.t(short ? 'general.hourShort' : 'general.hour', { count: hours })}`;
  const minutesLabel = `${minutes} ${translations.t(short ? 'general.minuteShort' : 'general.minute', { count: minutes })}`;

  return hours !== 0 && minutes !== 0 ? `${hoursLabel} ${minutesLabel}` : hours !== 0 ? hoursLabel : minutesLabel;
};
