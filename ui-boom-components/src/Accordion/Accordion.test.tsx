import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion } from '.';

test('check accordion max-height', async () => {
  const { container, getByTestId } = render(<Accordion title="titleAccordion" color="#a3abb1" />);
  expect(container).toBeVisible();
  expect(getByTestId('accordion-content')).toHaveStyle('max-height: 0');

  await fireEvent.click(getByTestId('accordion-header'));
  expect(getByTestId('accordion-content')).toHaveStyle('max-height: 1000px');
});

test('children length', async () => {
  const { getByTestId } = render(
    <Accordion title="titleAccordion" color="#a3abb1">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </Accordion>
  );
  expect(getByTestId('accordion-content').children.length).toBe(3);
});

test('onToggle is correctly called', async () => {
  const fakeOnToggle = jest.fn();
  const { getByTestId } = render(
    <Accordion title="titleAccordion" color="#a3abb1" onToggle={fakeOnToggle}>
      <div>content</div>
    </Accordion>
  );
  await fireEvent.click(getByTestId('accordion-header'));
  expect(fakeOnToggle).toBeCalledTimes(1);
  expect(fakeOnToggle).toBeCalledWith(true);

  await fireEvent.click(getByTestId('accordion-header'));
  expect(fakeOnToggle).toBeCalledTimes(2);
  expect(fakeOnToggle).toBeCalledWith(false);
});

test('disabled accordion, onToggle not called', async () => {
  const fakeOnToggle = jest.fn();
  const { getByTestId } = render(
    <Accordion title="titleAccordion" color="#a3abb1" onToggle={fakeOnToggle} disabled>
      <div>content</div>
    </Accordion>
  );

  await fireEvent.click(getByTestId('accordion-header'));
  expect(fakeOnToggle).toBeCalledTimes(0);
});
