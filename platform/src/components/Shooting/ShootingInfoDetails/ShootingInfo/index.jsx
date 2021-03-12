import React from 'react';
import { uniq, get } from 'lodash';

import moment from 'moment-timezone';

import { Typography, Icon } from 'ui-boom-components';
import { calculateIsDifferentTimezone, getDiffDaysWhenDifferentTimezone } from 'config/utils';

import { Wrapper, ContainerIconAndText } from './styles';
import { useTranslation } from 'react-i18next';
import { GoogleMapAddress } from 'components/Shooting/GoogleMapAddress';
import { SHOOTINGS_STATUSES } from 'config/consts';
import constsWithTranslations from 'config/constsWithTranslations';
import { MainContactActionPanel } from 'components/Shooting/MainContactActionPanel';

const ShootingInfo = ({ shooting, onShowShootingInfoForm, statusColor, isPhotographer, isAccepted, showDeliveryStatus }) => {
  const { t } = useTranslation();
  const { startDate, endDate, timezone: shootingTimezone } = shooting;
  const isDifferentTimezone = calculateIsDifferentTimezone(shooting);

  const existDeliveryStatus = get(shooting, 'deliveryStatus');
  const deliveryStatus = existDeliveryStatus ? constsWithTranslations.DELIVERY_STATUS_UI[existDeliveryStatus] : { label: 'N/A' };

  const { latitude, longitude } = shooting.place.location;

  const selectedMethods = uniq(
    shooting.deliveryMethods.map((method) => t(`shootings.deliveryMethodsType.${method.type.toLowerCase()}`))
  ).join(', ');

  const businessName = isPhotographer && shooting.state === SHOOTINGS_STATUSES.ASSIGNED ? null : get(shooting, 'mainContact.businessName');

  const diffDays = startDate ? getDiffDaysWhenDifferentTimezone(startDate, shootingTimezone) : 0;

  return (
    <Wrapper>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
        <ContainerIconAndText style={{ marginRight: 22 }} data-testid="start-date">
          <Icon name="calendar_today" size="12" color="#80888D" style={{ marginRight: 8 }} />
          <Typography variantName="body1">{startDate ? moment(shooting.startDate).format('LL') : '-'}</Typography>
        </ContainerIconAndText>
        <ContainerIconAndText style={{ marginTop: 8 }} data-testid="start-time">
          <Icon name="access_time" size="12" color="#80888D" style={{ marginRight: 8 }} />
          <Typography variantName="body1">
            {startDate ? `${moment(shooting.startDate).format('LT')} - ${moment(shooting.endDate).format('LT')}` : '-'}
          </Typography>
          {isDifferentTimezone && startDate && (
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
      {shooting.place && shooting.place.formattedAddress && (
        <GoogleMapAddress address={shooting.place.formattedAddress} color={statusColor} lat={latitude} long={longitude} />
      )}
      {businessName && (
        <Typography style={{ marginLeft: 20, color: '#000000' }} variantName="title3" data-testid="businessName">
          {businessName}
        </Typography>
      )}
      {!isPhotographer && (
        <div style={{ display: 'flex', marginTop: 10 }}>
          <Typography variantName="overline" style={{ marginRight: 10 }}>
            {t('shootings.deliveryMethods').toUpperCase()}
          </Typography>
          <Typography variantName="body1" style={{ marginRight: 20 }}>
            {selectedMethods || 'N/A'}
          </Typography>
          {showDeliveryStatus && (
            <>
              <Typography variantName="title3" style={{ marginRight: 10 }}>
                {t('shootings.shotingStatus').toUpperCase()}
              </Typography>
              <Typography variantName="body1" textColor={deliveryStatus.color}>
                {deliveryStatus.label}
              </Typography>
            </>
          )}
        </div>
      )}
      {isPhotographer && isAccepted && (
        <div style={{ marginTop: 3 }}>
          <Typography variantName="title3">{t('shootings.shootingContacts')}</Typography>
          {shooting.mainContact ? (
            <MainContactActionPanel contact={shooting.mainContact} color={statusColor} showInfo />
          ) : (
            <Typography variantName="body1" style={{ marginRight: 19 }}>
              {shooting.contact ? shooting.contact : 'N/A'}
            </Typography>
          )}
        </div>
      )}
      <div style={{ position: 'absolute', right: 9, bottom: 5 }}>
        <Typography variantName="textButton" textColor={statusColor} onClick={onShowShootingInfoForm}>
          {t('shootings.shootingViewAll')}
        </Typography>
      </div>
    </Wrapper>
  );
};

export { ShootingInfo };
