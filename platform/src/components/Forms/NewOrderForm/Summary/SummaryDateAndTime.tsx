import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { ImportantSpacedWrapper, SpacedRowWrapper } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';
import { TextSummary } from 'components/TextSummary';

import { KNOWN_VALUE, PLACE_HOLDER } from 'config/consts';
import { Typography } from 'ui-boom-components/lib';
import { PricingPackage } from 'types/PricingPackage';
import { toTime } from 'utils/date-utils';

interface Props {
  knowDateAndTime: string | null;
  date?: number | null;
  startTime?: number | null;
  pricingPackage: PricingPackage | null;
  place?: { timezone: any } | null;
}

export const SummaryDateAndTime: React.FC<Props> = ({ knowDateAndTime, date, startTime, pricingPackage, place }) => {
  const { t } = useTranslation();

  return (
    <>
      <ImportantSpacedWrapper>
        <FormSectionHeader iconName="calendar_today" label={t('forms.newOrder.summary.dateAndTime')} />
      </ImportantSpacedWrapper>
      <Typography variantName="caption" style={{ marginBottom: 10 }}>
        {t('forms.newOrder.summary.timeZoneDisclaimer')}
      </Typography>
      {knowDateAndTime === KNOWN_VALUE && startTime ? (
        <SpacedRowWrapper>
          <TextSummary
            label={t('forms.newOrder.summary.date')}
            value={moment.tz(moment.utc(date), place?.timezone).format('DD MMMM YYYY')}
          />
          <TextSummary
            label={t('forms.newOrder.summary.time')}
            value={pricingPackage && place?.timezone ? toTime(startTime, pricingPackage.shootingDuration, place.timezone) : PLACE_HOLDER}
          />
        </SpacedRowWrapper>
      ) : (
        <SpacedRowWrapper>
          <Typography variantName="body2">{t('forms.newOrder.summary.unscheduled')}</Typography>
        </SpacedRowWrapper>
      )}
    </>
  );
};
