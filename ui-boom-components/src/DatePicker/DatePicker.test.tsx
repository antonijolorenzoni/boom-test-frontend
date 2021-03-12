import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';

import { DatePicker } from '.';

const selectedColor = 'rgb(90, 192, 177)';

test('DatePicker date selection without date constraints', async () => {
  const onSelectDateMock = jest.fn();
  const startDate = moment().month(9).date(15).year(2020);

  const { getByTestId, getByText } = render(
    <DatePicker initialDate={startDate.format()} onSelectDate={onSelectDateMock} selectDateLabel="Select a date" />
  );

  expect(getByText('Select a date')).toBeInTheDocument();
  expect(getByTestId('days-wrapper').childElementCount).toBe(35);

  fireEvent.click(getByTestId('days-wrapper').children.item(6)!);
  expect(getByTestId('days-wrapper').children.item(6)!).toHaveStyle(`background-color: ${selectedColor}`);
  expect(onSelectDateMock).toHaveBeenCalledTimes(1);
  expect(onSelectDateMock).toHaveBeenCalledWith('2020-10-03');

  fireEvent.click(getByTestId('days-wrapper').children.item(10)!);
  expect(getByTestId('days-wrapper').children.item(6)!).toHaveStyle('background-color: #ffffff;');
  expect(getByTestId('days-wrapper').children.item(10)!).toHaveStyle(`background-color: ${selectedColor}`);
  expect(onSelectDateMock).toHaveBeenCalledTimes(2);
  expect(onSelectDateMock).toHaveBeenCalledWith('2020-10-07');
});

test('DatePicker month changes', async () => {
  const onSelectDateMock = jest.fn();
  const startDate = moment().month(9).date(15).year(2020);
  const { getByTestId, getByText } = render(<DatePicker initialDate={startDate.format()} onSelectDate={onSelectDateMock} />);

  expect(getByText('October 2020')).toBeVisible();

  fireEvent.click(getByTestId('change-month-wrapper').children.item(0)!);
  expect(getByText('September 2020')).toBeVisible();

  fireEvent.click(getByTestId('change-month-wrapper').children.item(2)!);
  expect(getByText('October 2020')).toBeVisible();

  fireEvent.click(getByTestId('change-month-wrapper').children.item(2)!);
  expect(getByText('November 2020')).toBeVisible();
});

test('DatePicker date selection with date constraints', async () => {
  const onSelectDateMock = jest.fn();
  const startDate = moment('2020-10-05', 'YYYY-MM-DD');

  const { getByTestId } = render(
    <DatePicker
      initialDate={startDate.format()}
      onSelectDate={onSelectDateMock}
      availableRange={{
        from: startDate.format(),
        to: startDate.add(5, 'days').format(),
      }}
    />
  );

  fireEvent.click(getByTestId('days-wrapper').children.item(7)!);
  expect(onSelectDateMock).toHaveBeenCalledTimes(0);

  fireEvent.click(getByTestId('days-wrapper').children.item(8)!);
  expect(getByTestId('days-wrapper').children.item(8)!).toHaveStyle(`background-color: ${selectedColor}`);
  expect(onSelectDateMock).toHaveBeenCalledTimes(1);
  expect(onSelectDateMock).toHaveBeenCalledWith('2020-10-05');

  fireEvent.click(getByTestId('days-wrapper').children.item(12)!);
  expect(getByTestId('days-wrapper').children.item(12)!).toHaveStyle(`background-color: ${selectedColor}`);
  expect(onSelectDateMock).toHaveBeenCalledTimes(2);
  expect(onSelectDateMock).toHaveBeenCalledWith('2020-10-09');

  fireEvent.click(getByTestId('days-wrapper').children.item(13)!);
  expect(onSelectDateMock).toHaveBeenCalledTimes(3);
  expect(onSelectDateMock).toHaveBeenCalledWith('2020-10-10');

  fireEvent.click(getByTestId('days-wrapper').children.item(14)!);
  expect(onSelectDateMock).not.toHaveBeenCalledWith('2020-10-11');
  expect(onSelectDateMock).toHaveBeenCalledTimes(3);
});

test('DatePicker date selection with date unavailable', async () => {
  const onSelectDateMock = jest.fn();
  const startDate = moment('2020-12-10', 'YYYY-MM-DD');

  const { getByTestId } = render(
    <DatePicker
      initialDate={startDate.format()}
      onSelectDate={onSelectDateMock}
      isDayBlocked={(date) => {
        const dateMoment = moment(date)
        return (dateMoment.get('month') + 1 === 12 && dateMoment.get('date') === 25) || (dateMoment.get('month') + 1 === 1 && dateMoment.get('date') === 1)}}
    />
  );

  fireEvent.click(getByTestId('days-wrapper').children.item(26)!);
  expect(onSelectDateMock).toHaveBeenCalledTimes(0);

  fireEvent.click(getByTestId('change-month-wrapper').children.item(2)!);

  fireEvent.click(getByTestId('days-wrapper').children.item(5)!);
  expect(onSelectDateMock).toHaveBeenCalledTimes(0);
});
