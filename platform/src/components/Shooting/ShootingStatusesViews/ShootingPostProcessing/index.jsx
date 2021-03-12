import PhotoIcon from '@material-ui/icons/Photo';
import React from 'react';

import _ from 'lodash';
import {
  PERMISSIONS,
  PERMISSION_ENTITIES,
  SHOOTING_STATUSES_UI_ELEMENTS,
  SHOOTINGS_STATUSES,
  EXTERNAL_EDITING_VALUE,
  ORDER_EDITING_FE_STATUSES,
  MAP_DATA_PIPELINE_TO_FE_STATUS,
  NOT_AVAILABLE,
} from 'config/consts';
import AbilityProvider from 'utils/AbilityProvider';
import BoomCompleteShootingForm from 'components/Forms/ReduxForms/Shootings/BoomCompleteShootingForm';
import InvoicingItemsView from 'components/Invoicing/InvoicingItemsView';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import Permission from 'components/Permission/Permission';
import ShootingRewardSection from 'components/Shooting/ShootingRewardSection';
import { DownloadLink } from 'components/Shooting/DownloadLink';
import { Button, Typography, OutlinedButton, Icon } from 'ui-boom-components';
import { useDispatch } from 'react-redux';
import * as ShootingActions from 'redux/actions/shootings.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import { useTranslation } from 'react-i18next';
import { AdminRefuseAndReshootPhotoPanel } from 'components/CancellationReasons/AdminRefuseAndReshootPhotoPanel';
import { featureFlag } from 'config/featureFlags';
import {
  ActionDescriptionTitle,
  DownloadLinkWrapper,
  PhotographerAdviceWrapper,
  WrapperButtons,
  WrapperShootingActions,
  WrapperEditingStatus,
  Spinner,
} from './styles';
import { refuseOrder, reshootOrder } from 'api/photos';
import spinnerImg from 'assets/icons/spinner.png';
import { Modal } from 'components/Modals';
import { useModal } from 'hook/useModal';

const ShootingPostProcessingView = ({
  onMarkShootingCompleted,
  onDownloadShootingPhotosToReview,
  onDownloadReleaseForm,
  isPhotographer,
  isBoom,
  shooting,
  onUpdateOrders,
  onClose,
}) => {
  const statusColor = SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.POST_PROCESSING].color;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isEditingEnable = featureFlag.isFeatureEnabled('editing-a1');

  const {
    downloadLink,
    editingOption,
    editorName,
    code,
    editingStatus: editingStatusDataPipeline,
    pricingPackage,
    refund,
    photographerItems,
    photographer,
    uploadComments,
    releaseFormDownloadLink,
    state,
  } = shooting;

  const finalEditorName = editorName ? _.capitalize(editorName) : _.toLower(t('shootings.theExternalEditor'));
  const isOrderExternalEditing = editingOption === EXTERNAL_EDITING_VALUE;
  const editingStatus = MAP_DATA_PIPELINE_TO_FE_STATUS[editingStatusDataPipeline];

  const { onClose: onCloseModal, openModal } = useModal();

  const onReshootShootingConfirm = async (reasonCode, reasonText) => {
    try {
      dispatch(ModalsActions.hideModal('RESHOOT_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await reshootOrder(code, reasonCode, reasonText);
      onUpdateOrders && onUpdateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));

      dispatch(
        ModalsActions.showModal('RESHOOT_SHOOTING_DIALOG_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('shootings.reshootShootingConfirmSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('RESHOOT_SHOOTING_DIALOG_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('shootings.reshootShootingConfirmError'),
          },
        })
      );
    }
  };

  const onRefuseShootingPhotosConfirm = async (shooting, reasonCode, reasonText) => {
    try {
      dispatch(ModalsActions.hideModal('REFUSE_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await refuseOrder(shooting.code, reasonCode, reasonText);
      onUpdateOrders && onUpdateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));

      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('shootings.refuseShootingsPhotosConfirmSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('shootings.refuseShootingsPhotosConfirmError'),
          },
        })
      );
    }
  };

  const isBoomCompleteOrderFormDisabled =
    isEditingEnable &&
    isOrderExternalEditing &&
    editingStatus !== ORDER_EDITING_FE_STATUSES.DONE &&
    editingStatus !== ORDER_EDITING_FE_STATUSES.ERROR_ZIPPING &&
    editingStatus !== ORDER_EDITING_FE_STATUSES.DONE_WITHOUT_ZIP;

  const isDownloadLinkActive = isOrderExternalEditing && editingStatus === ORDER_EDITING_FE_STATUSES.DONE;

  return (
    <>
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
          <PhotographerAdviceWrapper>
            <PhotoIcon alt="address" style={{ color: '#80888d', fontSize: 50 }} />
            <ActionDescriptionTitle>{t('shootings.postProcessingPendingPhotographer')}</ActionDescriptionTitle>
          </PhotographerAdviceWrapper>
        </div>
      )}
      {isBoom && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {shooting && photographer && (
            <div style={{ marginBottom: 30 }}>
              <div style={{ fontSize: 17, fontWeight: 500, flexBasis: '85%', marginBottom: 17 }}>{t('shootings.assignedPhotographer')}</div>
              <AssignedPhotographerPanel />
            </div>
          )}
          <Permission
            do={[PERMISSIONS.READ]}
            on={PERMISSION_ENTITIES.INVOICEITEM}
            abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
          >
            <InvoicingItemsView statusColor={statusColor} />
          </Permission>
          {isEditingEnable && isOrderExternalEditing && (
            <div style={{ marginTop: 26 }}>
              {editingStatus === ORDER_EDITING_FE_STATUSES.CREATING && (
                <WrapperEditingStatus color="#FFF3DC">
                  <Spinner src={spinnerImg} />
                  <Typography variantName="body2">{t('shootings.sendingPhotosToEditor', { editorName: finalEditorName })}</Typography>
                </WrapperEditingStatus>
              )}
              {editingStatus === ORDER_EDITING_FE_STATUSES.ERROR_CREATING && (
                <WrapperEditingStatus color="#F5F6F7">
                  <Icon name="warning" color="#D84315" size={16} style={{ marginRight: 10 }} />
                  <div>
                    <Typography variantName="body1" textColor="#D84315">
                      {t('shootings.errorSendingPhotosToEditor', { editorName: finalEditorName })}
                    </Typography>
                    <Typography variantName="caption">{t('shootings.errorSendingPhotosSubTitle')}</Typography>
                  </div>
                </WrapperEditingStatus>
              )}
              {editingStatus === ORDER_EDITING_FE_STATUSES.PROCESSING && (
                <WrapperEditingStatus color="#FFF3DC">
                  <Spinner src={spinnerImg} />
                  <Typography variantName="body2">
                    {t('shootings.externalEditorIsProcessing', { editorName: _.capitalize(finalEditorName) })}
                  </Typography>
                </WrapperEditingStatus>
              )}
              {editingStatus === ORDER_EDITING_FE_STATUSES.ERROR_PROCESSING && (
                <WrapperEditingStatus color="#F5F6F7">
                  <Icon name="warning" color="#F2994A" size={16} style={{ marginRight: 10 }} />
                  <div>
                    <Typography variantName="body1" textColor="#F2994A">
                      {t('shootings.externalEditorIsProcessing', { editorName: _.capitalize(finalEditorName) })}
                    </Typography>
                    <Typography variantName="caption">
                      {t('shootings.errorProcessingPhotosEditor', { editorName: finalEditorName })}
                    </Typography>
                  </div>
                </WrapperEditingStatus>
              )}
              {editingStatus === ORDER_EDITING_FE_STATUSES.ERROR_ZIPPING && (
                <WrapperEditingStatus color="#F5F6F7">
                  <Icon name="warning" color="#F2994A" size={16} style={{ marginRight: 10 }} />
                  <div>
                    <Typography variantName="body1" textColor="#F2994A">
                      {t('shootings.externalEditorEnded', { editorName: _.capitalize(finalEditorName) })}
                    </Typography>
                    <Typography variantName="caption">
                      {t('shootings.errorTransferringPhotosToPlatform', { editorName: finalEditorName })}
                    </Typography>
                  </div>
                </WrapperEditingStatus>
              )}
              {editingStatus === ORDER_EDITING_FE_STATUSES.DONE && (
                <WrapperEditingStatus color="#EFF9F8">
                  <Icon name="check" color="#000000" size={16} style={{ marginRight: 10 }} />
                  <div>
                    <Typography variantName="body2">
                      {t('shootings.externalEditorEnded', { editorName: _.capitalize(finalEditorName) })}
                    </Typography>
                    <Typography variantName="caption">{t('shootings.externalEditorEndedCaption')}</Typography>
                  </div>
                </WrapperEditingStatus>
              )}
              {editingStatus === ORDER_EDITING_FE_STATUSES.DONE_WITHOUT_ZIP && (
                <WrapperEditingStatus color="#EFF9F8">
                  <Icon name="check" color="#000000" size={16} style={{ marginRight: 10 }} />
                  <div>
                    <Typography variantName="body2">
                      {t('shootings.externalEditorEnded', { editorName: _.capitalize(finalEditorName) })}
                    </Typography>
                    <Typography variantName="caption">{t('shootings.transferringPhotosToPlatform')}</Typography>
                  </div>
                </WrapperEditingStatus>
              )}
            </div>
          )}
          <div style={{ marginTop: 30 }}>
            <BoomCompleteShootingForm
              onSubmit={(data) => onMarkShootingCompleted(data)}
              color={statusColor}
              disabled={isBoomCompleteOrderFormDisabled}
              downloadLink={downloadLink}
              isDownloadLinkActive={isDownloadLinkActive}
              code={code}
              isExternalEditing={isOrderExternalEditing}
            />
          </div>
          <Typography variantName="title2" style={{ marginBottom: 12 }}>
            {t('shootings.photographerPhotos')}
          </Typography>
          <WrapperShootingActions style={{ marginBottom: 25 }}>
            <DownloadLinkWrapper>
              <DownloadLink filename={`${code}.zip`} onDownload={onDownloadShootingPhotosToReview} color={statusColor} />
            </DownloadLinkWrapper>
            {isEditingEnable && (
              <WrapperButtons>
                <OutlinedButton
                  size="small"
                  onClick={() => openModal('refuse')}
                  style={{ marginRight: 17 }}
                  disabled={isOrderExternalEditing && (!editingStatus || editingStatus === ORDER_EDITING_FE_STATUSES.CREATING)}
                >
                  {t('shootings.refuse')}
                </OutlinedButton>
                <Button
                  backgroundColor={statusColor}
                  size="small"
                  onClick={() => openModal('reshot')}
                  disabled={isOrderExternalEditing && (!editingStatus || editingStatus === ORDER_EDITING_FE_STATUSES.CREATING)}
                >
                  {t('shootings.reshoot')}
                </Button>
              </WrapperButtons>
            )}
          </WrapperShootingActions>
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
        </div>
      )}
      <Modal id={'refuse'} style={{ overflow: 'initial' }}>
        <AdminRefuseAndReshootPhotoPanel
          orderStatus={state}
          subTitle={isOrderExternalEditing ? t('shootings.refuseShootingSubtitle') : undefined}
          onConfirmCancellation={(reasonCode, reasonText) => {
            onRefuseShootingPhotosConfirm(shooting, reasonCode, reasonText);
            onCloseModal('refuse');
          }}
          onClose={() => onCloseModal('refuse')}
          isRefusing
        />
      </Modal>
      <Modal id={'reshot'} style={{ overflow: 'initial' }}>
        <AdminRefuseAndReshootPhotoPanel
          orderStatus={state}
          subTitle={t('shootings.reshootShootingSubtitle')}
          infoMessage={isOrderExternalEditing ? t('shootings.reshootShootingInfoMessage') : undefined}
          onConfirmCancellation={(reasonCode, reasonText) => {
            onReshootShootingConfirm(reasonCode, reasonText);
            onCloseModal('reshot');
          }}
          onClose={() => onCloseModal('reshot')}
        />
      </Modal>
    </>
  );
};

export default ShootingPostProcessingView;
