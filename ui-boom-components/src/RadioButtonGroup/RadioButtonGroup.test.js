import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RadioButtonGroup } from '.';
import { RadioButton } from '../RadioButton';

const RadioGroupTestComponent = () => {
  const [valueRadioGroup, setValueRadioGroup] = useState();
  return (
    <RadioButtonGroup
      name="testRadioGroup"
      onClick={(selectedValue) => setValueRadioGroup(selectedValue)}
      selectedValue={valueRadioGroup}
      color={'red'}
    >
      <RadioButton value={'a'} labelText={'label a'} />
      <RadioButton value={'b'} labelText={'label b'} />
      <RadioButton value={'c'} labelText={'label c'} />
    </RadioButtonGroup>
  );
};

test('RadioButton children are correct', async () => {
  const { getByRole } = render(<RadioGroupTestComponent />);

  const checkboxA = getByRole('radio', {
    name: 'label a',
  });
  const checkboxB = getByRole('radio', {
    name: 'label b',
  });
  const checkboxC = getByRole('radio', {
    name: 'label c',
  });

  expect(checkboxA).toBeInTheDocument();
  expect(checkboxB).toBeInTheDocument();
  expect(checkboxC).toBeInTheDocument();
});

test('clicking on a label the corresponding radio is selected (value change)', async () => {
  const { getByLabelText, getByRole } = render(<RadioGroupTestComponent />);

  const labelC = getByLabelText('label c');
  await waitFor(() => fireEvent.click(labelC));

  const checkboxA = getByRole('radio', {
    name: 'label a',
  });
  const checkboxB = getByRole('radio', {
    name: 'label b',
  });
  const checkboxC = getByRole('radio', {
    name: 'label c',
  });

  expect(checkboxC.checked).toEqual(true);
  expect(checkboxA.checked).toEqual(false);
  expect(checkboxB.checked).toEqual(false);

  const labelA = getByLabelText('label a');
  await waitFor(() => fireEvent.click(labelA));

  expect(checkboxA.checked).toEqual(true);
  expect(checkboxB.checked).toEqual(false);
  expect(checkboxC.checked).toEqual(false);
});

test('color of radio is correct', async () => {
  const { getByLabelText, getByRole } = render(<RadioGroupTestComponent />);

  const labelC = getByLabelText('label c');
  await waitFor(() => fireEvent.click(labelC));

  const checkboxC = getByRole('radio', {
    name: 'label c',
  });

  expect(checkboxC).toHaveStyle(`background-color: red`);
});
