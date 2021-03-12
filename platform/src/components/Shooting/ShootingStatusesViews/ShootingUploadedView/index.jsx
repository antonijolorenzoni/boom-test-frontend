import React from 'react';
import { SHOOTING_STATUSES_UI_ELEMENTS, SHOOTINGS_STATUSES, NOT_AVAILABLE } from 'config/consts';
import ShootingRewardSection from 'components/Shooting/ShootingRewardSection';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import Permission from 'components/Permission/Permission';
import { PERMISSIONS, PERMISSION_ENTITIES } from 'config/consts';
import AbilityProvider from 'utils/AbilityProvider';
import InvoicingItemsView from 'components/Invoicing/InvoicingItemsView';
import { Icon, Button, OutlinedButton, Typography } from 'ui-boom-components';
import { DownloadLink } from 'components/Shooting/DownloadLink';
import { useTranslation } from 'react-i18next';
import { useWhoAmI } from 'hook/useWhoAmI';

import { CustomerDescription, DownloadLinkWrapper, DownloadWithActionsWrapper, ActionDescriptionTitle } from './styles';

const ShootingUploadedView = ({
  shooting,
  onRefuseShootingPhotos,
  onAcceptShootingPhotos,
  onReshootShooting,
  onDownloadShootingPhotosToReview,
  onDownloadReleaseForm,
}) => {
  const statusColor = SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.UPLOADED].color;

  const { t } = useTranslation();

  const { isPhotographer, isBoom } = useWhoAmI();

  const { pricingPackage, refund, photographerItems, photographer, code, uploadComments, processing, releaseFormDownloadLink } = shooting;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {isPhotographer && (
        <div>
          {pricingPackage && (
            <div style={{ width: '100%' }}>
              <ShootingRewardSection
                shooting={shooting}
                pricingPackage={pricingPackage}
                refund={refund}
                photographerItems={photographerItems}
              />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon alt="address" name="folder_shared" color="#A3ABB1" size={50} style={{ marginRight: 20 }} />
            <ActionDescriptionTitle>{t('shootings.postProcessingPendingPhotographer')}</ActionDescriptionTitle>
          </div>
        </div>
      )}
      {isBoom && (
        <div>
          {photographer && (
            <>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 17 }}>{t('shootings.assignedPhotographer')}</div>
              <AssignedPhotographerPanel />
            </>
          )}
          <Permission
            do={[PERMISSIONS.READ]}
            on={PERMISSION_ENTITIES.INVOICEITEM}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <div style={{ marginTop: 30 }}>
              <InvoicingItemsView statusColor={statusColor} />
            </div>
          </Permission>
          <div style={{ fontSize: 17, fontWeight: 500, marginTop: 30, marginBottom: 17 }}>{t('shootings.photographerPhotos')}</div>
          <DownloadWithActionsWrapper style={{ marginBottom: 18 }}>
            <DownloadLinkWrapper>
              <DownloadLink filename={`${code}.zip`} onDownload={onDownloadShootingPhotosToReview} color={statusColor} />
            </DownloadLinkWrapper>
            <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'space-evenly' }}>
              <Permission
                do={[PERMISSIONS.ACCEPT_PHOTOS]}
                on={PERMISSION_ENTITIES.SHOOTING}
                abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
              >
                <Button size="small" onClick={onAcceptShootingPhotos} backgroundColor="#5AC0B1" style={{ width: 85 }}>
                  {t('shootings.acceptShootingPhotos')}
                </Button>
              </Permission>
              <Permission
                do={[PERMISSIONS.REFUSE_PHOTOS]}
                on={PERMISSION_ENTITIES.SHOOTING}
                abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
              >
                <OutlinedButton size="small" onClick={onRefuseShootingPhotos} color="#D84315" style={{ width: 85 }}>
                  {t('shootings.refuseShootingPhotos')}
                </OutlinedButton>
              </Permission>
              <Button size="small" onClick={onReshootShooting} backgroundColor="#D84315" style={{ width: 85 }}>
                {t('shootings.markAsReshoot')}
              </Button>
            </div>
          </DownloadWithActionsWrapper>
          {releaseFormDownloadLink && (
            <>
              <Typography variantName="title2" style={{ marginBottom: 6 }}>
                {t('shootings.releaseForm')}
              </Typography>
              <DownloadLinkWrapper style={{ marginBottom: 15 }}>
                <DownloadLink filename={`${code}_release_form.zip`} onDownload={onDownloadReleaseForm} color={statusColor} />
              </DownloadLinkWrapper>
            </>
          )}
          <Typography variantName="overline" style={{ textTransform: 'uppercase', marginBottom: 7 }}>
            {t('shootings.uploadComments')}
          </Typography>
          <Typography variantName="body1">{uploadComments ?? NOT_AVAILABLE}</Typography>
          {processing && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
              <Icon name="build" color="#A3ABB1" size={13} />
              <span style={{ marginLeft: 6, color: '#A3ABB1', fontWeight: 100, fontSize: 13 }}>
                {t('forms.shootingAlreadyPostProcessed')}
              </span>
            </div>
          )}
        </div>
      )}
      {!isPhotographer && !isBoom && (
        <CustomerDescription>
          <Icon name="folder_shared" color="#A3ABB1" size={50} />
          <ActionDescriptionTitle>{t('shootings.shootingUploadedCustomerDescription')}</ActionDescriptionTitle>
        </CustomerDescription>
      )}
    </div>
  );
};

export default ShootingUploadedView;
