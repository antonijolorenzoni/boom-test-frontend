import { getDurationInfo, getFormattedTimer } from './timeHelpers';

describe('getDurationInfo', () => {
  it('should return one hour and an half', () => {
    const { shootingDurationHours, isHalfHour } = getDurationInfo(78);
    expect(shootingDurationHours).toBe(1);
    expect(isHalfHour).toBe(true);
  });

  it('should return half an hour', () => {
    const { shootingDurationHours, isHalfHour } = getDurationInfo(30);
    expect(shootingDurationHours).toBe(0);
    expect(isHalfHour).toBe(true);
  });

  it('should return half an hour', () => {
    const { shootingDurationHours, isHalfHour } = getDurationInfo(19);
    expect(shootingDurationHours).toBe(0);
    expect(isHalfHour).toBe(true);
  });

  it('should return two hours and an half', () => {
    const { shootingDurationHours, isHalfHour } = getDurationInfo(136);
    expect(shootingDurationHours).toBe(2);
    expect(isHalfHour).toBe(true);
  });

  it('should return two hours', () => {
    const { shootingDurationHours, isHalfHour } = getDurationInfo(135);
    expect(shootingDurationHours).toBe(2);
    expect(isHalfHour).toBe(true);
  });

  it('should return three hours', () => {
    const { shootingDurationHours, isHalfHour } = getDurationInfo(185);
    expect(shootingDurationHours).toBe(3);
    expect(isHalfHour).toBe(false);
  });
});

describe('getFormattedTimer', () => {
  it('should return a timer of 43 seconds', () => {
    const formattedTimer = getFormattedTimer(43000);
    expect(formattedTimer.hours).toBe(0);
    expect(formattedTimer.minutes).toBe(0);
    expect(formattedTimer.seconds).toBe(43);
    expect(formattedTimer.formattedValue).toBe('00h : 00m : 43s');
  });

  it('should return a timer of 25 minutes and 21 seconds', () => {
    const formattedTimer = getFormattedTimer(1521000);
    expect(formattedTimer.hours).toBe(0);
    expect(formattedTimer.minutes).toBe(25);
    expect(formattedTimer.seconds).toBe(21);
    expect(formattedTimer.formattedValue).toBe('00h : 25m : 21s');
  });

  it('should return a timer of 3 hours, 2 minutes and 1 second', () => {
    const formattedTimer = getFormattedTimer(10921000);
    expect(formattedTimer.hours).toBe(3);
    expect(formattedTimer.minutes).toBe(2);
    expect(formattedTimer.seconds).toBe(1);
    expect(formattedTimer.formattedValue).toBe('03h : 02m : 01s');
  });

  it('should return a timer of 29 hours, 0 minutes and 5 second', () => {
    const formattedTimer = getFormattedTimer(104405000);
    expect(formattedTimer.hours).toBe(29);
    expect(formattedTimer.minutes).toBe(0);
    expect(formattedTimer.seconds).toBe(5);
    expect(formattedTimer.formattedValue).toBe('29h : 00m : 05s');
  });

  it('should return a timer of 102 hours, 10 minutes and 3 second', () => {
    const formattedTimer = getFormattedTimer(367803000);
    expect(formattedTimer.hours).toBe(102);
    expect(formattedTimer.minutes).toBe(10);
    expect(formattedTimer.seconds).toBe(3);
    expect(formattedTimer.formattedValue).toBe('102h : 10m : 03s');
  });
});
