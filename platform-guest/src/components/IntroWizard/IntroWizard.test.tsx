import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import i18n from 'i18n';
import { IntroWizard } from '.';

const history = createMemoryHistory();

const checkActiveIndicator = (indicators: HTMLCollection, index: number) => {
  Array.from(indicators).forEach((indicator, i) => {
    expect(indicator).toHaveStyle('background-color: #ffffff;');
    if (i === index) {
      expect(indicator).not.toHaveStyle('opacity: 0.5;');
    } else {
      expect(indicator).toHaveStyle('opacity: 0.5;');
    }
  });
};

test('indicators works correctly when user interact to change step', () => {
  const { getByTestId } = render(
    <Router history={history}>
      <IntroWizard orderType="FOOD" companyName="OYO" />
    </Router>
  );
  const indicatorWrapper = getByTestId('indicator-wrapper');
  const indicators = indicatorWrapper.children;

  expect(indicators.length).toBe(5);
  checkActiveIndicator(indicators, 0);

  fireEvent.click(indicators.item(2)!);
  expect(indicators.item(2)).not.toHaveStyle('opacity: 0.5;');
  expect(indicators.item(0)).toHaveStyle('opacity: 0.5;');
});

test('clicking on "next" button forward user to next step and correct translations', () => {
  const { getByText, getByTestId } = render(
    <Router history={history}>
      <IntroWizard orderType="FOOD" companyName="DoorDash" />
    </Router>
  );
  const indicatorWrapper = getByTestId('indicator-wrapper');
  const indicators = indicatorWrapper.children;

  checkActiveIndicator(indicators, 0);
  getByText(i18n.t('welcomeWizard.FOOD.1.title', { companyName: 'DoorDash' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 1);
  getByText(i18n.t('welcomeWizard.FOOD.2.title', { companyName: 'DoorDash' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 2);
  getByText(i18n.t('welcomeWizard.FOOD.3.title', { companyName: 'DoorDash' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 3);
  getByText(i18n.t('welcomeWizard.FOOD.4.title', { companyName: 'DoorDash' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 4);
  getByText(i18n.t('welcomeWizard.FOOD.5.title', { companyName: 'DoorDash' }));
  fireEvent.click(getByText(i18n.t('general.next')));
});

test('clicking on "next" button forward user to next step and correct translations, REAL_ESTATE photo type', () => {
  const { getByText, getByTestId } = render(
    <Router history={history}>
      <IntroWizard orderType="REAL_ESTATE" companyName="SweetGuest" />
    </Router>
  );
  const indicatorWrapper = getByTestId('indicator-wrapper');
  const indicators = indicatorWrapper.children;

  checkActiveIndicator(indicators, 0);
  getByText(i18n.t('welcomeWizard.REAL_ESTATE.1.title', { companyName: 'SweetGuest' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 1);
  getByText(i18n.t('welcomeWizard.REAL_ESTATE.2.title', { companyName: 'SweetGuest' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 2);
  getByText(i18n.t('welcomeWizard.REAL_ESTATE.3.title', { companyName: 'SweetGuest' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 3);
  getByText(i18n.t('welcomeWizard.REAL_ESTATE.4.title', { companyName: 'SweetGuest' }));
  fireEvent.click(getByText(i18n.t('general.next')));

  checkActiveIndicator(indicators, 4);
  getByText(i18n.t('welcomeWizard.REAL_ESTATE.5.title', { companyName: 'SweetGuest' }));
  fireEvent.click(getByText(i18n.t('general.next')));
});
