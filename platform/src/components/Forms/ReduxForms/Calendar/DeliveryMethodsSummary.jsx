import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'ui-boom-components/lib';

export const DeliveryMethodSummary = ({ deliveryEmails, driveDelivery, deliveryFolderName }) => {
  const { t } = useTranslation();

  const selectedMethods = [
    deliveryEmails.length > 0 ? t('shootings.deliveryMethodsType.email') : '',
    driveDelivery ? t('shootings.deliveryMethodsType.drive') : '',
  ].filter((method) => method !== '');

  const labels = selectedMethods.join(', ');
  const bodyTextStyle = { fontSize: 18, marginTop: 0, fontWeight: '100', marginBottom: 0, color: '#80888d' };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
        <Icon name="send" style={{ color: '#000000', marginRight: 10, fontSize: 17 }} />
        <h3 style={{ margin: 0 }}>{`${t('shootings.deliveryMethods')}: ${labels}`.toUpperCase()}</h3>
      </div>
      {deliveryEmails.length > 0 && <h4 style={bodyTextStyle}>{deliveryEmails.join(', ')}</h4>}
      {driveDelivery && <h4 style={bodyTextStyle}>{`${t('general.folder')} "${deliveryFolderName}"`}</h4>}
    </>
  );
};
