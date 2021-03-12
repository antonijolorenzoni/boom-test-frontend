import NoShootingIcon from '@material-ui/icons/GridOff';
import React from 'react';
import translations from '../../translations/i18next';

const EmptyShootingDetails = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <NoShootingIcon style={{ marginRight: 20, color: '#80888d', fontSize: 30 }} />
    <div>
      <h4 style={{ color: '#80888d', margin: 0, marginTop: 5 }}>{translations.t('shootings.emptyShootingsDetailTitle')}</h4>
      <h5 style={{ color: '#80888d', margin: 0, marginTop: 5 }}>{translations.t('shootings.emptyShootingsDetailBody')}</h5>
    </div>
  </div>
);

export default EmptyShootingDetails;
