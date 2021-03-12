import React, { useRef } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import qs from 'query-string';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import moment from 'moment-timezone';
import { OutlinedButton, ProgressBar, Typography } from 'ui-boom-components';
import { useTranslation, Trans } from 'react-i18next';

import { axiosBoomInstance } from 'api/axiosBoomInstance';
import { ApiResponse } from 'types/api-response/ApiResponse';
import { ApiPath } from 'types/ApiPath';
import { Order } from 'types/Order';

import { getDurationString } from 'utils/time';
import { orderSteps } from 'utils/const';
import { Path } from 'types/Path';

const ConfirmButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 80px;

  @media only screen and (max-height: 750px) {
    padding-top: 20px;
  }
`;

const ConfirmationPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const isSmallMobile = useMediaQuery({ query: 'screen and (max-height: 750px)' });

  const orderCode = localStorage.getItem('order_code');
  const random = useRef(Date.now());

  const { data: orderResponse, error: orderError } = useSWR<ApiResponse<Order>>(
    [`${ApiPath.Order}/${orderCode}`, random],
    axiosBoomInstance.get
  );

  if (orderError) {
    return <div>Error...</div>;
  }

  if (!orderResponse) {
    return <div>Loading...</div>;
  }

  const steps = orderSteps.map((step) => t(`confirmationPage.${step}`));

  const order = orderResponse.data;

  const timezoneSelected: string = order.timezone;
  const timezone: string = timezoneSelected || moment.tz.guess();

  const date: string = moment.tz(moment.utc(order.startDate), timezone).format('DD/MM/YYYY');
  const time: string = moment.tz(moment.utc(order.startDate), timezone).format('HH:mm');

  const durationPhotoshoot: string = getDurationString(order.details.shootingDuration, false);

  const rescheduled: boolean = Object.keys(qs.parse(history.location.search)).some((k) => k === 'rescheduled');

  return (
    <div style={{ width: '100vw' }}>
      <div style={{ padding: '0 28px' }}>
        <ProgressBar
          steps={steps}
          currentIndex={3}
          colorSettings={{ activeColor: '#ffffff', inactiveColor: '#5ac0b1', borderColor: '#5AC0B1' }}
          style={{ maxWidth: 900, margin: 'auto' }}
        />
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variantName="title1" textColor="#FFFFFF" style={{ paddingTop: isSmallMobile ? 10 : 60 }}>
          {t('confirmationPage.congratulations').toUpperCase()}
        </Typography>
        <Typography variantName="title2" textColor="#FFFFFF" style={{ paddingTop: isSmallMobile ? 20 : 60 }}>
          {t(rescheduled ? 'confirmationPage.bookingRescheduledAndConfirmedFor' : 'confirmationPage.bookingConfirmedFor', {
            date,
            time,
          })}
        </Typography>
        <Typography variantName="title2" textColor="#FFFFFF" style={{ marginTop: 20 }}>
          <Trans i18nKey={t('confirmationPage.photographerWillCome', { durationPhotoshoot })} />
        </Typography>
        <ConfirmButtonWrapper>
          <OutlinedButton
            color="#ffffff"
            backgroundColor="transparent"
            onClick={() => history.push(`${Path.HomePage}${rescheduled ? '?rescheduled' : ''}`)}
            style={{ width: 150 }}
          >
            {t('confirmationPage.yourBooking')}
          </OutlinedButton>
        </ConfirmButtonWrapper>
      </div>
    </div>
  );
};

export { ConfirmationPage };
