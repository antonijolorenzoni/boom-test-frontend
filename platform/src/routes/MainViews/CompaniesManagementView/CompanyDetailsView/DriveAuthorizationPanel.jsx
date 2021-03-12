import React from 'react';
import { Button, OutlinedButton, Typography } from 'ui-boom-components';
import AbilityProvider from '../../../../utils/AbilityProvider';

import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../../config/consts';
import Permission from '../../../../components/Permission/Permission';
import { useTranslation } from 'react-i18next';

const driveIcon = require('../../../../assets/icons/drive.png');

const DriveAuthorizationPanel = ({ isBoom, isGoogleAuthorized, onAuth, onRevoke }) => {
  const driveIconElement = <img src={driveIcon} style={{ width: 16, height: 16, marginRight: 6 }} alt="drive" />;

  const { t } = useTranslation();

  return (
    <>
      {isBoom && (
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 500 }}>
          {driveIconElement}
          <Typography variantName="body1">
            {t(isGoogleAuthorized ? 'company.clientConnectedDriveFolder' : 'company.clientNotConnectedDriveFolder')}
          </Typography>
        </div>
      )}
      {!isBoom && (
        <Permission do={[PERMISSIONS.UPDATE]} on={PERMISSION_ENTITIES.COMPANY} abilityHelper={AbilityProvider.getCompanyAbilityHelper()}>
          <div>
            <Typography variantName="title2">{t('forms.getYourPhotoOnDrive')}</Typography>
            <Typography variantName="caption">{t('company.driveInfo')}</Typography>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
              {driveIconElement}
              {isGoogleAuthorized ? (
                <>
                  <Typography variantName="body1" style={{ margin: '0 26px 0 13px' }}>
                    {t('company.driveAccountConnected')}
                  </Typography>
                  <OutlinedButton size="small" color="#5AC0B1" onClick={(e) => onRevoke()}>
                    {t('company.disconnectDriveAccount')}
                  </OutlinedButton>
                </>
              ) : (
                <Button size="small" backgroundColor="#5AC0B1" onClick={(e) => onAuth()}>
                  {t('company.connectDriveAccount')}
                </Button>
              )}
            </div>
          </div>
        </Permission>
      )}
    </>
  );
};

export { DriveAuthorizationPanel };
