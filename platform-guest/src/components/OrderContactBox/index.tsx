import React, { Dispatch, SetStateAction } from 'react';

import { useTranslation } from 'react-i18next';
import { Typography } from 'ui-boom-components';

import { GridWrapper, RowWrapper } from './styles';
import { useMediaQuery } from 'react-responsive';
import { Overlay } from 'components/OrderPanel/styles';
import { OrderStatus } from 'types/OrderStatus';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { OrderType } from 'types/OrderType';

export const OrderContactBox: React.FC<{
  orderType: OrderType;
  status: OrderStatus;
  nameSurname: string;
  phoneNumber: string;
  additionalPhone?: string;
  email: string;
  address: string;
  businessName: string;
  editMode: boolean;
  onSetEditMode: Dispatch<SetStateAction<boolean>>;
}> = ({ orderType, status, nameSurname, phoneNumber, additionalPhone, email, address, businessName, editMode, onSetEditMode }) => {
  const { t } = useTranslation();

  const isDesktop = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Desktop}px)` });
  const isDisabled = status === OrderStatus.Canceled || status === OrderStatus.Reshoot;

  const isUnscheduled = status === OrderStatus.Unscheduled;

  const businessLabelMargin = isDesktop ? 0 : -20;

  return (
    <>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 10,
          marginBottom: isDesktop ? 0 : 10,
        }}
      >
        {isDisabled && <Overlay />}
        <Typography variantName="body1" textColor="#80888D">
          {t('orderInfo.whoIsContactOnSite')}
        </Typography>
        {isUnscheduled && (
          <Typography
            variantName="body1"
            textColor="#5AC0B1"
            style={{ textAlign: 'right', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => onSetEditMode(!editMode)}
          >
            {t('orderInfo.editContactOnSite')}
          </Typography>
        )}
      </div>
      <GridWrapper>
        {isDisabled && <Overlay />}
        <RowWrapper>
          <Typography variantName="overline" style={{ marginTop: 5, marginBottom: 4 }}>
            {t('orderInfo.nameSurname').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{nameSurname}</Typography>
        </RowWrapper>
        <RowWrapper>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('orderInfo.email').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{email}</Typography>
        </RowWrapper>
        {isDisabled && <Overlay />}
        <RowWrapper>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('orderInfo.phone').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{phoneNumber}</Typography>
        </RowWrapper>
        {additionalPhone && (
          <RowWrapper>
            <Typography variantName="overline" style={{ marginBottom: 4 }}>
              {t('orderInfo.additionalPhone').toUpperCase()}
            </Typography>
            <Typography variantName="kpi1">{additionalPhone}</Typography>
          </RowWrapper>
        )}
        {isDisabled && <Overlay />}
        <Typography
          variantName="body1"
          textColor="#80888D"
          style={{ gridColumnStart: 1, gridColumnEnd: 3, marginBottom: businessLabelMargin }}
        >
          {t('orderInfo.business')}
        </Typography>
        <RowWrapper>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('orderInfo.address').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{address}</Typography>
        </RowWrapper>
        <RowWrapper>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('orderInfo.businessName').toUpperCase()}
          </Typography>
          <Typography variantName="kpi1">{businessName || '-'}</Typography>
        </RowWrapper>
      </GridWrapper>
      <a href={t(`faq.${orderType}`)} target="_blank" rel="noopener noreferrer">
        <Typography variantName="body1" textColor="#5AC0B1" style={{ marginBottom: 2, textDecoration: 'underline', cursor: 'pointer' }}>
          {t('orderInfo.anyQuestions')}
        </Typography>
      </a>
      <Typography variantName="body3" textColor="#80888D" style={{ marginBottom: 10 }}>
        {t('orderInfo.boomLocationAndVatnumber')}
      </Typography>
    </>
  );
};
