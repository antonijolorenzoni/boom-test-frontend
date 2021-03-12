import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Order } from 'types/Order';
import { LineBreak, OneThirdWrapper, RowWrapper, Wrapper, TwoThirdWrapper } from './styles';
import { Typography, Icon } from 'ui-boom-components';
import moment from 'moment-timezone';
import { getDurationString } from 'utils/time';
import { useMediaQuery } from 'react-responsive';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

const getDishesOrGuidelinesElement = (
  isFoodOrderType: boolean,
  dishesNumberLabel: string,
  dishes: number | undefined,
  guidelinesLabel: string,
  readLabel: string,
  guidelines?: string
) => {
  if (isFoodOrderType && false) {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {dishesNumberLabel.toUpperCase()}
          </Typography>
          <Typography variantName="title2" textColor="#5AC0B1">
            *
          </Typography>
        </div>
        <Typography variantName="title2">{dishes}</Typography>
      </>
    );
  }

  if (guidelines) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {guidelinesLabel.toUpperCase()}
          </Typography>
        </div>
        <a href={guidelines} target="_blank" rel="noopener noreferrer" style={{ textDecorationColor: '#5AC0B1' }}>
          <Typography variantName="kpi1" textColor="#5AC0B1" style={{ textAlign: 'center' }}>
            {readLabel}
          </Typography>
        </a>
      </>
    );
  }
  return null;
};
interface Props {
  order: Order;
  navigationButtons: JSX.Element;
}

export const ReviewPanel: React.FC<Props> = ({ order, navigationButtons }) => {
  const { t } = useTranslation();

  const { name, phone, email } = order.contact;
  const { photosQuantity, shootingDuration } = order.details;
  const { address, businessName } = order;

  const isFoodOrderType = order.orderType === 'FOOD';

  const dishes = 20;

  const guidelines = order.company.guidelines?.link;

  const dateObj = moment.tz(order.startDate, order.timezone);
  const date: string = dateObj.format('DD/MM');
  const hourStart: string = dateObj.format('HH:mm');

  const hourEnd: string = dateObj.add(shootingDuration, 'minutes').format('HH:mm');

  const dayOfWeek: number = dateObj.isoWeekday();
  const dayOfWeekShort = t(`daysOfWeek.${dayOfWeek - 1}`).substr(0, 3);

  const memoizedGetDishesOrGuidelines = useCallback(
    () =>
      getDishesOrGuidelinesElement(
        isFoodOrderType,
        t('orderInfo.dishesNumber'),
        dishes,
        t('orderInfo.guidelines'),
        t('general.read'),
        guidelines
      ),
    [isFoodOrderType, dishes, guidelines, t]
  );

  const isTabletOrMobile = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RowWrapper style={{ alignItems: 'center', width: 400 }}>
          <OneThirdWrapper>
            <Typography variantName="overline" style={{ marginBottom: 5, textAlign: 'center' }}>
              {t('orderInfo.photosNumber').toUpperCase()}
            </Typography>
            <Typography variantName="title2" style={{ textAlign: 'center' }}>
              {photosQuantity}
            </Typography>
          </OneThirdWrapper>
          <OneThirdWrapper>
            <Typography variantName="overline" style={{ marginBottom: 5, textAlign: 'center' }}>
              {t('orderInfo.duration').toUpperCase()}
            </Typography>
            <Typography variantName="title2" style={{ textAlign: 'center' }}>
              {getDurationString(shootingDuration)}
            </Typography>
          </OneThirdWrapper>
          <OneThirdWrapper>{memoizedGetDishesOrGuidelines()}</OneThirdWrapper>
        </RowWrapper>
      </div>
      <LineBreak />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RowWrapper style={{ width: 400, justifyContent: 'space-between' }}>
          <div>
            <Typography variantName="overline" style={{ marginBottom: 5 }}>
              {t('general.date').toUpperCase()}
            </Typography>
            <div style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
              <Icon name="calendar_today" color="#A3ABB1" size={18} style={{ marginRight: 12 }} />
              <Typography variantName="title2" style={{ marginTop: 2 }}>
                {`${dayOfWeekShort} ${date}`}
              </Typography>
            </div>
          </div>
          <div>
            <Typography variantName="overline" style={{ marginBottom: 5 }}>
              {t('general.time').toUpperCase()}
            </Typography>
            <div style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
              <Icon name="access_time" color="#A3ABB1" size={18} style={{ marginRight: 12 }} />
              <Typography variantName="title2" style={{ marginTop: 2 }}>
                {`${hourStart} - ${hourEnd}`}
              </Typography>
            </div>
          </div>
        </RowWrapper>
      </div>
      <LineBreak style={{ marginBottom: isTabletOrMobile ? 13 : 25 }} />
      <Typography variantName="title3" style={{ marginBottom: 10 }}>
        {t('form.contactOnSite')}
      </Typography>
      <RowWrapper columnOnMobile style={{ justifyContent: 'start' }}>
        <OneThirdWrapper style={{ marginBottom: 12 }}>
          <Typography variantName="overline" style={{ marginBottom: 5 }}>
            {t('orderInfo.nameSurname').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{name}</Typography>
        </OneThirdWrapper>
        <OneThirdWrapper style={{ marginBottom: 12 }}>
          <Typography variantName="overline" style={{ marginBottom: 5 }}>
            {t('orderInfo.phone').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{phone}</Typography>
        </OneThirdWrapper>
        <OneThirdWrapper>
          <Typography variantName="overline" style={{ marginBottom: 5 }}>
            {t('orderInfo.email').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{email}</Typography>
        </OneThirdWrapper>
      </RowWrapper>
      <Typography variantName="title3" style={{ marginTop: 30, marginBottom: 10 }}>
        {t('orderInfo.address')}
      </Typography>
      <RowWrapper columnOnMobile style={{ justifyContent: 'start' }}>
        <TwoThirdWrapper style={{ marginBottom: 12 }}>
          <Typography variantName="overline" style={{ marginBottom: 5 }}>
            {t('form.address').toUpperCase()}
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon name="place" color="#A3ABB1" size={18} style={{ marginRight: 12 }} />
            <Typography variantName="kpi1">{address}</Typography>
          </div>
        </TwoThirdWrapper>
        <OneThirdWrapper style={{ marginBottom: 12 }}>
          <Typography variantName="overline" style={{ marginBottom: 5 }}>
            {t('orderInfo.businessName').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{businessName || '-'}</Typography>
        </OneThirdWrapper>
      </RowWrapper>
      {navigationButtons}
    </Wrapper>
  );
};
