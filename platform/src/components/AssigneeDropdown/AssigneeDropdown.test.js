import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssigneeDropdown } from '../AssigneeDropdown';
import translations from '../../translations/i18next';

const AssigneeDropdownTest = () => {
  const [assigneeValue, setAssigneeValue] = useState();

  const onFetchAssigneeOptions = async (input) => {
    return [
      { value: 'Isotta', label: 'Isotta' },
      { value: 'Sara', label: 'Sara' },
      { value: 'Michela', label: 'Michela' },
    ];
  };

  return (
    <AssigneeDropdown
      value={assigneeValue}
      fetcher={onFetchAssigneeOptions}
      onChange={async (option) => {
        if (option) {
          setAssigneeValue(option);
        } else {
          setAssigneeValue(null);
        }
      }}
      showError={false}
    />
  );
};

it('should render without crashing', async () => {
  const { getByText } = render(<AssigneeDropdownTest />);

  await waitFor(() => getByText(translations.t('forms.select')));

  expect(getByText(translations.t('forms.select'))).toBeTruthy();
});

it('option change and is the one clicked', async () => {
  const { getByText, container, queryByText } = render(<AssigneeDropdownTest />);

  await waitFor(() => fireEvent.keyDown(container.firstChild, { key: 'ArrowDown' }));
  await waitFor(() =>
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'a' },
    })
  );
  await waitFor(() => getByText('Isotta'));
  await waitFor(() => fireEvent.click(getByText('Isotta')));

  expect(queryByText(/Isotta/i)).toBeInTheDocument();
  expect(queryByText(/Michela/i)).toBeNull();
  expect(queryByText(/Sara/i)).toBeNull();
});

it('all options are rendered', async () => {
  const { container, queryByText, getByText } = render(<AssigneeDropdownTest />);

  await waitFor(() => fireEvent.keyDown(container.firstChild, { key: 'ArrowDown' }));
  await waitFor(() =>
    fireEvent.change(container.querySelector('input'), {
      target: { value: 'a' },
    })
  );

  await waitFor(() => getByText('Isotta'));

  expect(queryByText(/Isotta/i)).toBeVisible();
  expect(queryByText(/Michela/i)).toBeVisible();
  expect(queryByText(/Sara/i)).toBeVisible();
});
