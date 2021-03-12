import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import moment from 'moment';

import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { Typography } from 'ui-boom-components';
import { getNumOfDaysFromToday } from 'utils/date-utils';

interface PropsFn {
  title?: string;
  body: any;
}
const Footnotes: React.FC<PropsFn> = ({ title, body }) => {
  return (
    <div style={{ padding: '20px 22px', paddingTop: Boolean(title) ? 20 : 45 }}>
      {Boolean(title) && <Typography variantName="body1">{title}</Typography>}
      <Typography variantName="caption2">{body}</Typography>
    </div>
  );
};

interface Props {
  status?: SubscriptionStatus;
  endSubscription?: string;
  endTrailDays?: number;
}

export const FoodnotesSubscriptionCard: React.FC<Props> = ({ status, endSubscription, endTrailDays }) => {
  const { t } = useTranslation();

  const endSubDays = getNumOfDaysFromToday(endSubscription || '');

  switch (status) {
    case SubscriptionStatus.ACTIVE:
      const formatDate = moment(endSubscription).format('MMM D YYYY');
      return <Footnotes body={<Trans i18nKey="smb.planActive" values={{ date: formatDate }} />} />;
    case SubscriptionStatus.TRIALING:
      return (
        <Footnotes
          title={t('smb.planTrailingTitle')}
          body={<Trans i18nKey="smb.planTrailingDescription" values={{ remainingDays: endTrailDays }} />}
        />
      );
    case SubscriptionStatus.UNSUBSCRIBED_ACTIVE:
      return (
        <Footnotes
          title={t('smb.planUnsubscribedTitle')}
          body={<Trans i18nKey="smb.planUnsubscribedDescription" values={{ remainingDays: endSubDays }} />}
        />
      );
    case SubscriptionStatus.UNSUBSCRIBED_GRACE:
      return <Footnotes title={t('smb.planExpiredTitle')} body={t('smb.planExpiredGraceDescription')} />;
    default:
      return null;
  }
};
