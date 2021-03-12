import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment';

import { TimePicker } from '.';

const selectedColor = 'rgb(90, 192, 177)';

test('TimePicker time selection with default constraints', async () => {
  const fakeOnSelectTime = jest.fn();

  const { getByText, getByTestId } = render(
    <TimePicker minutesDuration={120} onSelectTime={fakeOnSelectTime} selectTimeLabel="Select starting time" />
  );

  expect(getByText('Select starting time')).toBeVisible();
  expect(getByTestId('times-wrapper').children.length).toBe(24);

  fireEvent.click(getByTestId('times-wrapper').children.item(2)!);
  expect(getByTestId('times-wrapper').children.item(2)!).toHaveStyle(`background-color: ${selectedColor}`);
  expect(fakeOnSelectTime).toBeCalledTimes(1);
  expect(fakeOnSelectTime).toBeCalledWith('09:00');

  fireEvent.click(getByTestId('times-wrapper').children.item(4)!);
  expect(getByTestId('times-wrapper').children.item(2)!).toHaveStyle(`background-color: #ffffff`);
  expect(getByTestId('times-wrapper').children.item(4)!).toHaveStyle(`background-color: ${selectedColor}`);
  expect(fakeOnSelectTime).toBeCalledTimes(2);
  expect(fakeOnSelectTime).toBeCalledWith('10:00');

  expect(getByTestId('times-wrapper').children.item(5)!).toHaveStyle('opacity: 0.5;');
  expect(getByTestId('times-wrapper').children.item(6)!).toHaveStyle('opacity: 0.5;');
  expect(getByTestId('times-wrapper').children.item(7)!).toHaveStyle('opacity: 0.5;');
  expect(getByTestId('times-wrapper').children.item(8)!).toHaveStyle('opacity: 0.5;');

  expect(getByText('18:30')).toHaveStyle('cursor: not-allowed;');
  expect(getByText('19:00')).toHaveStyle('cursor: not-allowed;');
  expect(getByText('19:30')).toHaveStyle('cursor: not-allowed;');

  fireEvent.click(getByText('18:30'));
  expect(fakeOnSelectTime).not.toBeCalledWith('18:30');
});

test('TimePicker time selection with custom constraints', async () => {
  const fakeOnSelectTime = jest.fn();

  const { getByText } = render(
    <TimePicker minutesDuration={120} onSelectTime={fakeOnSelectTime} selectTimeLabel="Select starting time" disabledAfter="12:00" />
  );

  expect(getByText('12:00')).not.toHaveStyle('cursor: not-allowed;');
  expect(getByText('12:30')).toHaveStyle('cursor: not-allowed;');

  fireEvent.click(getByText('12:30'));
  fireEvent.click(getByText('12:00'));
  expect(fakeOnSelectTime).toBeCalledTimes(1);
  expect(fakeOnSelectTime).toBeCalledWith('12:00');
});
