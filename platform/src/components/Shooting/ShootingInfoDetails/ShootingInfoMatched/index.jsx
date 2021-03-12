import React from 'react';
import { uniq, get } from 'lodash';
import moment from 'moment';

import { Typography, Icon } from 'ui-boom-components';
import { calculateIsDifferentTimezone, getDiffDaysWhenDifferentTimezone } from 'config/utils';
import { cutAndAppendSuffix } from 'utils/string';

import { ContainerIconAndText, Wrapper } from './styles';
import { useTranslation } from 'react-i18next';
import { GoogleMapAddress } from 'components/Shooting/GoogleMapAddress';
import { MainContactActionPanel } from 'components/Shooting/MainContactActionPanel';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const ShootingInfoMatched = ({ shooting, statusColor, isPhotographer, onShowShootingInfoForm }) => {
  const { t } = useTranslation();
  const { timezone: shootingTimezone, mainContact, startDate } = shooting;
  const isDifferentTimezone = calculateIsDifferentTimezone(shooting);

  const selectedMethods = uniq(
    shooting.deliveryMethods.map((method) => t(`shootings.deliveryMethodsType.${method.type.toLowerCase()}`))
  ).join(', ');

  const { latitude, longitude } = shooting.place.location;

  const businessName = get(shooting, 'mainContact.businessName');

  const diffDays = getDiffDaysWhenDifferentTimezone(startDate, shootingTimezone);

  return (
    <Wrapper>
      <div>
        <Typography variantName="title3">{t('shootings.shootingDateAndTime')}</Typography>
        <div style={{ display: 'flex' }}>
          <ContainerIconAndText style={{ marginRight: 25 }}>
            <Icon name="calendar_today" color="#80888D" size="12" style={{ marginRight: 8 }} />
            <Typography variantName="body1">{moment(shooting.startDate).format('LL')}</Typography>
          </ContainerIconAndText>
          <ContainerIconAndText>
            <Icon name="access_time" color="#80888D" size="12" style={{ marginRight: 8 }} />
            <Typography variantName="body1">
              {`${moment(shooting.startDate).format('LT')} - ${moment(shooting.endDate).format('LT')}`}
            </Typography>
            {isDifferentTimezone && (
              <Typography variantName="body1">
                {`${moment.tz(shootingTimezone).zoneAbbr()}: ${moment(shooting.startDate).tz(shootingTimezone).format('LT')} - ${moment(
                  shooting.endDate
                )
                  .tz(shootingTimezone)
                  .format('LT')}`}
              </Typography>
            )}
            {diffDays !== 0 && (
              <Typography variantName="overline" style={{ minWidth: 40 }}>{`(${diffDays} ${t('shootings.shortDays')})`}</Typography>
            )}
          </ContainerIconAndText>
        </div>
      </div>
      <ShowForPermissions permissions={[Permission.OrderBoInfoRead]}>
        <div>
          <Typography variantName="title3">{t('shootings.shootingContacts')}</Typography>
          {mainContact ? (
            <MainContactActionPanel contact={mainContact} color={statusColor} />
          ) : (
            <Typography variantName="body1" style={{ marginRight: 19 }}>
              {shooting.contact ? shooting.contact : 'N/A'}
            </Typography>
          )}
        </div>
      </ShowForPermissions>
      {shooting.place && shooting.place.formattedAddress && (
        <div style={{ flexBasis: '50%' }}>
          <Typography variantName="title3">{t('shootings.shootingAddress')}</Typography>
          <GoogleMapAddress address={shooting.place.formattedAddress} color={statusColor} lat={latitude} long={longitude} />
          {businessName && (
            <Typography style={{ marginLeft: 20, color: '#000000' }} variantName="title3">
              {businessName}
            </Typography>
          )}
        </div>
      )}
      <div>
        <Typography variantName="title3">{t('shootings.shootingLogisticInfo')}</Typography>
        <Typography variantName="body2">
          {shooting.logisticInformation ? cutAndAppendSuffix(shooting.logisticInformation, 70) : 'N/A'}
        </Typography>
      </div>
      {!isPhotographer && (
        <div style={{ flexBasis: '50%' }}>
          <Typography variantName="title3">{t('shootings.delivery')}</Typography>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: 14, display: 'flex' }}>
              <Typography variantName="title3" style={{ marginRight: 9 }}>
                {t('shootings.deliveryMethods').toUpperCase()}
              </Typography>
              <Typography variantName="body1">{selectedMethods || 'N/A'}</Typography>
            </div>
          </div>
        </div>
      )}
      <div>
        <Typography variantName="title3">{t('shootings.shootingDetails')}</Typography>
        <Typography variantName="body2">{shooting.description ? cutAndAppendSuffix(shooting.description, 70) : 'N/A'}</Typography>
      </div>
      <div style={{ position: 'absolute', right: 15, bottom: 10 }}>
        <Typography variantName="textButton" textColor={statusColor} onClick={onShowShootingInfoForm}>
          {t('shootings.shootingViewAll')}
        </Typography>
      </div>
    </Wrapper>
  );
};

export { ShootingInfoMatched };
