import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import translation from 'translations/i18next';

import { CalendarTableSwitch } from '.';

test('"order list" label is #000000, not "calendar"', () => {
  const onChangeCalendarVisible = jest.fn();
  const { container } = render(<CalendarTableSwitch onChangeCalendarVisible={onChangeCalendarVisible} calendarVisible={false} />);
  expect(screen.getByText(translation.t('dashboards.orderList') as string)).toHaveStyle('color: #000000');
  expect(screen.getByText(translation.t('dashboards.calendar') as string)).toHaveStyle('color: #80888D');

  fireEvent.click(container.querySelector('[for="calendarVisible"]')!);
  expect(onChangeCalendarVisible).toBeCalledTimes(1);
  expect(onChangeCalendarVisible).toBeCalledWith(true);
});
