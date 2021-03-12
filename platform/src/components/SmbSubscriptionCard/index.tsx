import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import * as ModalsActions from 'redux/actions/modals.actions';
import { Button, Typography } from 'ui-boom-components/lib';
import { useTranslation } from 'react-i18next';

import { SMB_SUBSCRIPTIONS_PRICE } from 'config/consts';
import { PointedList, Panel, Header, Price, Description } from './styles';
import { Currency } from 'types/Currency';
import { ConfirmSubscribeModal } from './ConfirmSubscribeModal';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { getNumOfDaysFromToday } from 'utils/date-utils';
import { FoodnotesSubscriptionCard } from './FootnotesSubscriptionCard';

interface Props {
  currency: Currency;
  status?: SubscriptionStatus;
  subscriptionEndDate?: string;
  freeTrailRemainingDays?: number;
  onSubscribe?: () => void;
}

const SmbSubscriptionCard: React.FC<Props> = ({ currency, status, subscriptionEndDate, freeTrailRemainingDays, onSubscribe }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const subscriptionRemainingDays = getNumOfDaysFromToday(subscriptionEndDate || '');

  const isUnsubscribedActive = SubscriptionStatus.UNSUBSCRIBED_ACTIVE === status;
  const isUnsubscribed = SubscriptionStatus.UNSUBSCRIBED === status;
  const isUnsubscribedGrace = SubscriptionStatus.UNSUBSCRIBED_GRACE === status;

  const showSubscribeButton = isUnsubscribedActive || isUnsubscribed || isUnsubscribedGrace;

  const hasNotFootnotes = !status || [SubscriptionStatus.PAYMENT_FAILED, SubscriptionStatus.SUBSCRIBED].some((s) => s === status);

  const subscribe = () =>
    dispatch(
      ModalsActions.showModal('CONFIRM_SUBSCRIBE', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          content: (
            <ConfirmSubscribeModal
              currency={currency}
              remainingDays={subscriptionRemainingDays}
              isUnsubscribedActive={isUnsubscribedActive}
            />
          ),
        },
      })
    );

  const footnotes = useMemo(() => {
    return <FoodnotesSubscriptionCard status={status} endSubscription={subscriptionEndDate} endTrailDays={freeTrailRemainingDays} />;
  }, [status, subscriptionEndDate, freeTrailRemainingDays]);

  return (
    <Panel style={{ paddingBottom: hasNotFootnotes ? 70 : 20 }} data-testid="smb-subscription-card">
      <Header>
        <Typography variantName="overline" textColor="#ffffff" style={{ textTransform: 'uppercase' }}>
          {t('smb.subscription')}
        </Typography>
      </Header>
      <Price>
        <Typography variantName="kpi" textColor="#000000">{`${SMB_SUBSCRIPTIONS_PRICE.MONTHLY}${currency}`}</Typography>
        <Typography variantName="overline" textColor="#A3ABB1">
          {t('smb.monthly').toUpperCase()}
        </Typography>
        <Typography variantName="caption2" textColor="#000000" style={{ marginTop: 2 }}>
          {t('forms.newOrder.vatIncluded')}
        </Typography>
      </Price>
      <Description>
        <Typography variantName="body1" textColor="#000000" style={{ paddingLeft: 22 }}>
          {t('smb.whatIsIncluded')}
        </Typography>
        <PointedList>
          <ul style={{ margin: 0, paddingLeft: 14 }}>
            {[
              t('smb.customerSupportResponse'),
              t('smb.editingAndGuidelines'),
              t('smb.orderTracking'),
              t('smb.photoDelivery'),
              t('smb.oneUserOnly'),
            ].map((value, i) => (
              <li key={i} style={{ fontSize: 12 }}>
                <Typography variantName="caption" textColor="#000000">
                  {value}
                </Typography>
              </li>
            ))}
          </ul>
        </PointedList>
        <div style={{ flex: 0.25, paddingTop: 13, paddingLeft: 22, paddingRight: 22 }}>
          <Typography variantName="caption2" textColor="#A3ABB1">
            {t('smb.freeCancellationRescheduling')}
          </Typography>
        </div>
        {footnotes}
        {showSubscribeButton && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 15 }}>
            <Button size={'small'} onClick={onSubscribe ?? subscribe} style={{ paddingLeft: 14, paddingRight: 14 }}>
              {t('smb.subscribe')}
            </Button>
          </div>
        )}
      </Description>
    </Panel>
  );
};

export default SmbSubscriptionCard;
