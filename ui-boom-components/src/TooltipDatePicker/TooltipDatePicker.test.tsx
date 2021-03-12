import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';
import translation from 'i18next';

import { TooltipDatePicker } from '.';

beforeEach(jest.clearAllMocks);

const onChangeDate = jest.fn();
const label = 'date';

test('datePicker will be displayed only after clicking', async () => {
  render(<TooltipDatePicker label={label} onChangeDate={onChangeDate} />);

  await waitFor(() => screen.findByTestId('tooltip-date-picker'));

  expect(screen.getByText(label)).toBeInTheDocument();

  expect(screen.queryByTestId('mini-date-picker')).not.toBeInTheDocument();
  fireEvent.click(screen.getByTestId('tooltip-date-picker'));
  expect(screen.queryByTestId('mini-date-picker')).toBeInTheDocument();
});

test('if any date is it selected, `done` button is disabled', async () => {
  render(
    <div data-testid="parent">
      <TooltipDatePicker label={label} onChangeDate={onChangeDate} />
    </div>
  );

  await waitFor(() => screen.findByTestId('tooltip-date-picker'));

  expect(screen.getByText(label)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('tooltip-date-picker'));
  expect(screen.getByText('Done')).toHaveStyle('cursor: not-allowed');

  fireEvent.click(screen.getByTestId('parent'));
  expect(screen.queryByTestId('mini-date-picker')).not.toBeInTheDocument();
});

test('when the mouse came over a day it should be #cdece7', async () => {
  render(<TooltipDatePicker label={label} onChangeDate={onChangeDate} />);

  screen.findByTestId('tooltip-date-picker');

  fireEvent.click(screen.getByTestId('tooltip-date-picker'));

  fireEvent.mouseOver(screen.getByText('18'));
  expect(screen.getByText('18').parentElement).toHaveStyle('background-color: #cdece7');
});

test('select a day', async () => {
  render(
    <div data-testid="parent">
      <TooltipDatePicker label={label} onChangeDate={onChangeDate} />
    </div>
  );

  screen.findByTestId('tooltip-date-picker');

  fireEvent.click(screen.getByTestId('tooltip-date-picker'));

  fireEvent.click(screen.getByText('8'));
  expect(screen.getByText('8').parentElement).toHaveStyle('background-color: #5ac0b1');
  expect(screen.getByText('8').parentElement?.parentElement?.childNodes).toHaveLength(1);

  fireEvent.click(screen.getByText('Done'));

  const date = moment().set('date', 8).set('minute', 0).set('second', 0).set('millisecond', 0);
  expect(onChangeDate).toHaveBeenCalledTimes(1);
  expect(onChangeDate).toHaveBeenCalledWith(date.toDate(), null);
});

test('select a range of date', async () => {
  render(
    <div data-testid="parent">
      <TooltipDatePicker label={label} onChangeDate={onChangeDate} />
    </div>
  );

  screen.findByTestId('tooltip-date-picker');

  fireEvent.click(screen.getByTestId('tooltip-date-picker'));

  fireEvent.click(screen.getByText('8'));
  expect(screen.getByText('8').parentElement).toHaveStyle('background-color: #5ac0b1');
  expect(screen.getByText('8').parentElement?.parentElement?.childNodes).toHaveLength(1);

  fireEvent.mouseOver(screen.getByText('11'));
  expect(screen.getByText('11').parentElement).toHaveStyle('background-color: #cdece7');
  expect(screen.getByText('8').parentElement?.parentElement?.childNodes).toHaveLength(2);
  expect(screen.getByText('11').parentElement?.parentElement?.childNodes).toHaveLength(2);
  fireEvent.mouseLeave(screen.getByText('11'));

  fireEvent.click(screen.getByText('11'));
  expect(screen.getByText('11').parentElement).toHaveStyle('background-color: #5ac0b1');

  expect(screen.getByText('8').parentElement?.parentElement?.childNodes).toHaveLength(2);
  expect(screen.getByText('11').parentElement?.parentElement?.childNodes).toHaveLength(2);

  expect(screen.getByText('9').parentElement).toHaveStyle('background-color: #cdece7');
  expect(screen.getByText('10').parentElement).toHaveStyle('background-color: #cdece7');

  fireEvent.click(screen.getByText('Done'));

  const start = moment().set('date', 8).set('minute', 0).set('second', 0).set('millisecond', 0);
  const end = moment().set('date', 11).set('minute', 0).set('second', 0).set('millisecond', 0);

  expect(onChangeDate).toHaveBeenCalledTimes(1);
  expect(onChangeDate).toHaveBeenCalledWith(start.toDate(), end.toDate());
});
