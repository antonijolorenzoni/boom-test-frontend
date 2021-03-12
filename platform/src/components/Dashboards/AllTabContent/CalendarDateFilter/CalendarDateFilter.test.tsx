import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import translation from 'translations/i18next';

import { CalendarDateFilter } from '.';
import { CalendarViewType } from 'types/CalendarViewType';

const changeView = jest.fn();
const previous = jest.fn();
const next = jest.fn();
const todaySelection = jest.fn();

beforeEach(jest.clearAllMocks);

test('date is correctly rendered in all the views', () => {
  render(
    <CalendarDateFilter
      from="2021-01-19T14:31:21Z"
      viewType={CalendarViewType.Week}
      onChangeView={changeView}
      onTodaySelection={todaySelection}
      onPrevious={previous}
      onNext={next}
    />
  );

  const rangeWrapper = within(screen.getByTestId('range-wrapper'));

  rangeWrapper.getByText('Jan 17 - Jan 23');
  fireEvent.click(screen.getByText(translation.t('general.day') as string));
  rangeWrapper.getByText('19 January 2021');

  fireEvent.click(screen.getByText(translation.t('general.month') as string));
  rangeWrapper.getByText('January 2021');

  expect(changeView.mock.calls.length).toBe(2);
  expect(changeView.mock.calls[0][0]).toBe(CalendarViewType.Day);
  expect(changeView.mock.calls[1][0]).toBe(CalendarViewType.Month);
});

test('actions callback are called correctly', () => {
  render(
    <CalendarDateFilter
      from="2021-01-19T14:31:21Z"
      viewType={CalendarViewType.Week}
      onChangeView={changeView}
      onTodaySelection={todaySelection}
      onPrevious={previous}
      onNext={next}
    />
  );

  fireEvent.click(screen.getByText('navigate_before'));
  fireEvent.click(screen.getByText('navigate_next'));
  expect(previous).toBeCalledTimes(1);
  expect(next).toBeCalledTimes(1);
});
