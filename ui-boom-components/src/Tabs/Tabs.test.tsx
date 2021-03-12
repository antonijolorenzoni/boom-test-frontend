import React, { useState } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tabs } from '.';
import { Tab } from '../Tab';

const TabsGroupTestComponent: React.FC<{ color?: string }> = ({ color }) => {
  const [activeTab, setActiveTab] = useState('test2');

  const onClickTab = (tabName: string) => setActiveTab(tabName);

  return (
    <Tabs onClick={onClickTab} activeTab={activeTab} color={color}>
      <Tab iconName="reorder" name="test1" label="Test 1" counter={500}>
        Body of test n one
      </Tab>
      <Tab name="test2" label="Test 2" counter={500}>
        Body of test n two
      </Tab>
      <Tab name="test3" label="Test 3" iconName="info">
        Body of test n three
      </Tab>
      <Tab name="test4" label="Test 4">
        Body of test n four
      </Tab>
    </Tabs>
  );
};

test('tabs children are correct', async () => {
  const { findByText } = render(<TabsGroupTestComponent />);

  await findByText('Test 1');
  await findByText('Test 2');
  await findByText('Test 3');
  await findByText('Test 4');
});

test('clicking on a tab the corresponding tab is selected and the content appears', async () => {
  const { getByText, queryByText } = render(<TabsGroupTestComponent />);

  const tab4 = getByText('Test 4');
  await waitFor(() => fireEvent.click(tab4));

  expect(queryByText(/Body of test n four/i)).toBeVisible();
  expect(queryByText(/Body of test n three/i)).toHaveStyle('display: none;');
});

test('color of tab is correct', async () => {
  const { queryByText } = render(<TabsGroupTestComponent />);

  const tab4 = queryByText(/Test 4/i);

  expect(tab4).toHaveStyle('color: #5ac0b1');

  await waitFor(() => fireEvent.click(tab4!));

  expect(tab4).toHaveStyle('color: #5ac0b1');
});
