import moment from 'moment';
import React from 'react';
import { PERMISSIONS, PERMISSION_ENTITIES, ReasonRoles } from 'config/consts';
import AbilityProvider from 'utils/AbilityProvider';
import InvoicingItemsView from 'components/Invoicing/InvoicingItemsView';
import PermissionOld from 'components/Permission/Permission';
import ShootingRewardSection from 'components/Shooting/ShootingRewardSection';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import { Button, Typography, Icon } from 'ui-boom-components';
import { PhotographerRefusePanel } from 'components/CancellationReasons/PhotographerRefusePanel';
import { useWhoAmI } from 'hook/useWhoAmI';
import { useTranslation } from 'react-i18next';
import { useModal } from 'hook/useModal';
import { Modal } from 'components/Modals';
import { UploadSection } from './UploadSection';
import { getMaxUploadPhotos, getRequiredUploadPhotos, getMinUploadPhotosToConfirm } from 'utils/numberPhotos';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';
import { useForceUploadReasons } from 'hook/reasons';

interface Props {
  onUnassignPhotographer: () => void;
  shooting: any;
  onRefuseShooting: (selectedReason: string, textReason: string) => void;
  statusColor: string;
  onCompleteUpload: (comment: string) => void;
}

export const ShootingAcceptedView_REFACTOR: React.FC<Props> = ({
  onUnassignPhotographer,
  shooting,
  onRefuseShooting,
  statusColor,
  onCompleteUpload,
}) => {
  const { isPhotographer, isBoom } = useWhoAmI();
  const { t } = useTranslation();
  const { state, pricingPackage, refund, photographerItems, photographer, endDate, code } = shooting;
  const {
    photosQuantity,
    photoType: { type: packageType },
  } = pricingPackage;

  const maxPhotos = getMaxUploadPhotos({ packageType, photosQuantity });
  const requiredPhotos = getRequiredUploadPhotos({ packageType, photosQuantity });
  const minPhotosToConfirm = getMinUploadPhotosToConfirm({ packageType });
  const { reasons } = useForceUploadReasons(isPhotographer ? [ReasonRoles.PHOTOGRAPHER] : [], state);

  const { openModal, onClose } = useModal();

  const isPastOrder = moment(endDate).isBefore(moment().valueOf());

  return (
    <>
      {isPhotographer && (
        <>
          {pricingPackage && (
            <div style={{ margin: '20px 0', width: '100%' }}>
              <ShootingRewardSection
                shooting={shooting}
                pricingPackage={pricingPackage}
                refund={refund}
                photographerItems={photographerItems}
              />
            </div>
          )}
          <UploadSection
            orderCode={code}
            onCompleteUpload={onCompleteUpload}
            uploadPhotosSubTitle={t('views.accepted.makeGoodSelection')}
            uploadReleaseFormSubTitle={t('views.accepted.requiredInPdfFormat')}
            minFilesToConfirm={minPhotosToConfirm}
            minFilesForWarning={1}
            requiredFiles={requiredPhotos}
            maxFiles={maxPhotos}
            reasons={reasons.map(({ code, requiresText }) => ({
              value: code,
              label: t(`cancellationReasons.${code}`),
              requiresText,
            }))}
          />
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <Typography variantName="body1" textColor="#80888D" style={{ marginRight: 14 }}>
              {t('views.accepted.availableAnymore')}
            </Typography>
            <Typography
              variantName="overline"
              style={{ textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => openModal('discardInvite')}
              textColor="#000000"
            >
              {t('views.accepted.revokeAvailability')}
            </Typography>
          </div>
        </>
      )}
      {isBoom && photographer && (
        <div style={{ marginTop: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 17 }}>
            <div style={{ fontSize: 17, fontWeight: 500, flexBasis: '85%' }}>{t('views.accepted.assignedPhotographer')}</div>
            <ShowForPermissions permissions={[Permission.ShootingUnassign]}>
              <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                <Button disabled={isPastOrder} backgroundColor="#D84315" onClick={onUnassignPhotographer} size="small">
                  {t('views.accepted.unassignPhotographer')}
                </Button>
              </div>
            </ShowForPermissions>
          </div>
          <AssignedPhotographerPanel />
          {isPastOrder && (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 17 }}>
              <Icon name="warning" size={15} color="#FF8A80" style={{ marginRight: 10 }} />
              <Typography variantName="title3" textColor="#FF8A80" style={{ fontSize: 15 }}>
                {t('views.accepted.unassignPhotographerForbidden')}
              </Typography>
            </div>
          )}
        </div>
      )}
      {isBoom && (
        <PermissionOld
          do={[PERMISSIONS.READ]}
          on={PERMISSION_ENTITIES.INVOICEITEM}
          abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
        >
          <div style={{ marginTop: 30 }}>
            <InvoicingItemsView statusColor={statusColor} />
          </div>
        </PermissionOld>
      )}
      <Modal id="discardInvite" style={{ overflow: 'initial' }}>
        <PhotographerRefusePanel
          orderStatus={state}
          onConfirmCancellation={(selectedReason: string, textReason: string) => {
            onRefuseShooting(selectedReason, textReason);
            onClose('discardInvite');
          }}
        />
      </Modal>
      <Modal id="uploadInfo" style={{ width: 450 }}>
        <Typography variantName="body1" textColor="#000">
          {t('views.accepted.uploadYourPhotos')}
        </Typography>
        <ul>
          {(t('views.accepted.uploadInfo', { returnObjects: true }) as Array<string>).map((info, i) => (
            <li key={i}>
              <Typography variantName="caption" textColor="#000">
                {info}
              </Typography>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => onClose('uploadInfo')}>{t('general.ok')}</Button>
        </div>
      </Modal>
    </>
  );
};
