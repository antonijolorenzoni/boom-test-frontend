import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Typography } from 'ui-boom-components/lib';
import { FieldWrapper, RowWrapper, ContainerIconAndText } from './styles';
import moment from 'moment-timezone';
import { PLACE_HOLDER } from 'config/consts';
import { calculateIsDifferentTimezone, getDiffDaysWhenDifferentTimezone } from 'config/utils';

export const DateAndLocationPanel: React.FC<{ order: any }> = ({ order }) => {
  const { t } = useTranslation();

  const {
    startDate,
    timezone: shootingTimezone,
    endDate,
    place: { formattedAddress },
  } = order;

  const isDifferentTimezone: boolean = calculateIsDifferentTimezone(order);
  const diffDays = getDiffDaysWhenDifferentTimezone(startDate, shootingTimezone);

  return (
    <RowWrapper style={{ marginBottom: 10 }}>
      <FieldWrapper>
        <Typography variantName="title3" style={{ marginBottom: 10 }}>
          {t('forms.additionalInfo.dateAndTime')}
        </Typography>
        <div style={{ display: 'flex' }}>
          <ContainerIconAndText style={{ marginRight: 15 }}>
            <Icon name="calendar_today" size={12} color="#80888D" style={{ marginRight: 6, position: 'absolute', marginTop: 2 }} />
            <Typography variantName="body1" textColor="#80888D" style={{ marginLeft: 18 }}>
              {startDate ? moment(startDate).format('LL') : PLACE_HOLDER}
            </Typography>
          </ContainerIconAndText>
          <ContainerIconAndText data-testid="start-time">
            <Icon name="access_time" size={12} color="#80888D" style={{ marginRight: 6, position: 'absolute', marginTop: 2 }} />
            <Typography variantName="body1" textColor="#80888D" style={{ marginLeft: 18 }}>
              {startDate ? `${moment(startDate).format('LT')} - ${moment(endDate).format('LT')}` : PLACE_HOLDER}
            </Typography>
            {isDifferentTimezone && (
              <Typography variantName="overline" style={{ marginLeft: 16 }}>
                {`${moment.utc(startDate).tz(shootingTimezone).zoneAbbr()} ${moment
                  .utc(startDate)
                  .tz(shootingTimezone)
                  .format('LT')} - ${moment.utc(endDate).tz(shootingTimezone).format('LT')}`}
              </Typography>
            )}
            {diffDays !== 0 && (
              <Typography variantName="overline" style={{ minWidth: 40 }}>{`(${diffDays} ${t('shootings.shortDays')})`}</Typography>
            )}
          </ContainerIconAndText>
        </div>
      </FieldWrapper>
      <FieldWrapper>
        <Typography variantName="title3" style={{ marginBottom: 10 }}>
          {t('forms.additionalInfo.address')}
        </Typography>
        <ContainerIconAndText>
          <Icon name="place" size={12} color="#80888D" style={{ marginRight: 6, position: 'absolute', marginTop: 2 }} />
          <Typography variantName="body1" textColor="#80888D" style={{ marginLeft: 18 }}>
            {formattedAddress}
          </Typography>
        </ContainerIconAndText>
      </FieldWrapper>
    </RowWrapper>
  );
};
