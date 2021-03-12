import React from 'react';
import get from 'lodash/get';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { Icon, Chip, Typography } from 'ui-boom-components';
import { getDurationInfoString } from '../../../../utils/timeHelpers';
import { DELIVERY_METHOD_TYPE } from '../../../../config/consts';

import { Wrapper, InfoWrapper, Hr, DeliveryToggler, DeliveryInfoWrapper } from './styles';

import driveIcon from '../../../../assets/icons/drive.png';
import { GoogleMapAddress } from '../../GoogleMapAddress';

const ClientShootingInfoDetails = ({ shooting, statusColor, onShowShootingInfoForm, canEdit }) => {
  const { t } = useTranslation();

  const { company, pricingPackage, place, contact, mainContact, deliveryMethods } = shooting;
  const { name, photosQuantity, shootingDuration, photoType } = pricingPackage;

  const deliveryEmails = deliveryMethods.filter((method) => method.type === DELIVERY_METHOD_TYPE.EMAIL).map(({ contact }) => contact);
  const gdriveMethod = deliveryMethods.find((method) => method.type === DELIVERY_METHOD_TYPE.DRIVE);
  const driveFolderName = get(gdriveMethod, 'alias') || t('shootings.defaultDriveFolder');

  const [isDeliveryEmailToggled, setDeliveryEmailToggled] = React.useState(false);
  const [isDeliveryGdriveToggled, setDeliveryGdriveToggled] = React.useState(false);

  const businessName = get(shooting, 'mainContact.businessName');

  return (
    <Wrapper>
      <Typography variantName="title2" style={{ marginBottom: 10 }}>
        {company.name}
      </Typography>
      <InfoWrapper>
        <div style={{ flexBasis: '25%', flexShrink: 0 }}>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.shootType')}
          </Typography>
          <div style={{ display: 'flex ' }}>
            <Chip name={t(`photoTypes.${photoType.type}`)} />
          </div>
        </div>
        <div style={{ flexBasis: '25%', flexShrink: 0 }}>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.packageType')}
          </Typography>
          <Typography variantName="body1">{name}</Typography>
          <Typography variantName="body1">
            {`${photosQuantity} ${t('shootings.photosLabel')} - ${getDurationInfoString(shootingDuration)}`}
          </Typography>
        </div>
        <div style={{ flexBasis: '50%', flexShrink: 0 }}>
          <Typography variantName="title3" style={{ marginBottom: 5 }}>
            {t('shootings.shootingDateAndTime')}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Icon name="calendar_today" color="#80888D" size="12" style={{ marginRight: 8, marginTop: 2 }} />
              <Typography variantName="body1">{shooting.startDate ? moment(shooting.startDate).format('LL') : '-'}</Typography>
              <div style={{ display: 'flex', marginLeft: 25, alignItems: 'flex-start' }}>
                <Icon name="access_time" color="#80888D" size="12" style={{ marginRight: 8, marginTop: 2 }} />
                <Typography variantName="body1">
                  {shooting.startDate ? `${moment(shooting.startDate).format('LT')} - ${moment(shooting.endDate).format('LT')}` : '-'}
                </Typography>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 17 }}>
              <Typography variantName="title3">{t('shootings.shootingAddress')}</Typography>
              <GoogleMapAddress
                address={place.formattedAddress}
                color={statusColor}
                lat={place.location.latitude}
                long={place.location.longitude}
              />
              {businessName && (
                <Typography style={{ marginLeft: 20, color: '#000000' }} variantName="title3">
                  {businessName}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </InfoWrapper>
      <Hr />
      <div style={{ position: 'relative' }}>
        {canEdit && (
          <Typography
            variantName="textButton"
            textColor={statusColor}
            style={{ position: 'absolute', right: 0, top: 0 }}
            onClick={onShowShootingInfoForm}
          >
            {t('forms.edit')}
          </Typography>
        )}
        <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
          {t('shootings.shootingInfo')}
        </Typography>
        <Typography variantName="title3" style={{ marginTop: 10 }}>
          {t('shootings.shootingContacts')}
        </Typography>
        {mainContact ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 50, marginTop: 14 }}>
            <div style={{ display: 'flex', marginBottom: 16 }}>
              <Icon name="perm_identity" color="#80888D" size={17} style={{ marginRight: 7 }} />
              <Typography variantName="body1">{mainContact.fullName}</Typography>
            </div>
            <div style={{ display: 'flex', marginBottom: 16 }}>
              <Icon name="mail_outline" color="#80888D" size={17} style={{ marginRight: 7 }} />
              <Typography variantName="body1">{mainContact.email}</Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Icon name="local_phone" color="#80888D" size={17} style={{ marginRight: 7 }} />
              <Typography variantName="body1">{mainContact.phoneNumber}</Typography>
            </div>
            {mainContact.additionalPhoneNumber && (
              <div style={{ display: 'flex' }}>
                <Icon name="local_phone" color="#80888D" size={17} style={{ marginRight: 7 }} />
                <Typography variantName="body1">{mainContact.additionalPhoneNumber}</Typography>
              </div>
            )}
          </div>
        ) : (
          <Typography variantName="body1">{contact}</Typography>
        )}
        <Typography variantName="title3" style={{ marginTop: 12, marginBottom: 8 }}>
          {t('shootings.deliveryMethods')}
        </Typography>
        {deliveryEmails.length > 0 && (
          <DeliveryToggler onClick={() => setDeliveryEmailToggled((toggled) => !toggled)}>
            <Icon
              name={isDeliveryEmailToggled ? 'arrow_drop_down' : 'arrow_right'}
              color="#80888D"
              size="17"
              style={{ marginRight: 2, cursor: 'pointer' }}
            />
            <Typography variantName="overline" style={{ cursor: 'pointer' }}>
              {t('shootings.deliveryMethodsType.email')}
            </Typography>
          </DeliveryToggler>
        )}
        {isDeliveryEmailToggled && (
          <DeliveryInfoWrapper style={{ marginBottom: 20 }}>
            <Typography variantName="caption">{deliveryEmails.join(' ')}</Typography>
          </DeliveryInfoWrapper>
        )}
        {gdriveMethod && (
          <DeliveryToggler onClick={() => setDeliveryGdriveToggled((toggled) => !toggled)}>
            <Icon
              name={isDeliveryGdriveToggled ? 'arrow_drop_down' : 'arrow_right'}
              color="#80888D"
              size="17"
              style={{ marginRight: 2, cursor: 'pointer' }}
            />
            <Typography variantName="overline" style={{ cursor: 'pointer' }}>
              {t('shootings.yourDriveFolder')}
            </Typography>
          </DeliveryToggler>
        )}
        {isDeliveryGdriveToggled && (
          <DeliveryInfoWrapper>
            <img src={driveIcon} alt="Drive" height={16} style={{ marginRight: 10, display: 'flex' }} />
            <Typography variantName="caption">{driveFolderName}</Typography>
          </DeliveryInfoWrapper>
        )}
        <div style={{ display: 'flex', marginTop: 25 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '50%' }}>
            <Typography variantName="title3">{t('shootings.shootingLogisticInfo')}</Typography>
            <Typography variantName="body2">{shooting.logisticInformation || 'N/A'}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '50%' }}>
            <Typography variantName="title3">{t('shootings.shootingDetails')}</Typography>
            <Typography variantName="body2">{shooting.description || 'N/A'}</Typography>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export { ClientShootingInfoDetails };
