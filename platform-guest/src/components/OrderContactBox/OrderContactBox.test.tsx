import React from 'react';
import { render } from '@testing-library/react';

import i18n from 'i18n';

import { OrderContactBox } from '.';
import { OrderStatus } from 'types/OrderStatus';
import { OrderType } from 'types/OrderType';

test('all labels appear correctly', () => {
  const { queryByText } = render(
    <OrderContactBox
      orderType="FOOD"
      status={OrderStatus.Unscheduled}
      nameSurname="Alessia Ciao"
      phoneNumber="39 34544555654"
      email="provaemail@email.com"
      address="Via Milano, 12, Milano"
      businessName="Business name Activity"
      editMode={false}
      onSetEditMode={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.whoIsContactOnSite'))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.editContactOnSite'))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.nameSurname').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.phone').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.email').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.business'))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.address').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.businessName').toUpperCase())).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.anyQuestions'))).toBeVisible();
  expect(queryByText(i18n.t('orderInfo.boomLocationAndVatnumber'))).toBeVisible();

  expect(queryByText('Alessia Ciao')).toBeVisible();
  expect(queryByText('39 34544555654')).toBeVisible();
  expect(queryByText('provaemail@email.com')).toBeVisible();
  expect(queryByText('Via Milano, 12, Milano')).toBeVisible();
  expect(queryByText('Business name Activity')).toBeVisible();
});

test('edit link is not showed in COMPLETED status', () => {
  const { queryByText } = render(
    <OrderContactBox
      orderType="FOOD"
      status={OrderStatus.Completed}
      nameSurname="Alessia Ciao"
      phoneNumber="39 34544555654"
      email="provaemail@email.com"
      address="Via Milano, 12, Milano"
      businessName="Business name Activity"
      editMode={false}
      onSetEditMode={() => {}}
    />
  );

  expect(queryByText(i18n.t('orderInfo.editContactOnSite'))).toBeNull();
});
