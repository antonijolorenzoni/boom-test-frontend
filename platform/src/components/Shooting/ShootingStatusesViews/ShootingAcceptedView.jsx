//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: V I E W   F O R   A C C E P T E D   S H O O T I N G S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import WarningIcon from '@material-ui/icons/Warning';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { change, submit } from 'redux-form';
import { PERMISSIONS, PERMISSION_ENTITIES } from 'config/consts';
import translations from 'translations/i18next';
import AbilityProvider from 'utils/AbilityProvider';
import UploadPhotoForm from 'components/Forms/ReduxForms/Shootings/UploadPhotoForm';
import InvoicingItemsView from 'components/Invoicing/InvoicingItemsView';
import MDButton from 'components/MDButton/MDButton';
import PermissionOld from 'components/Permission/Permission';
import ShootingRewardSection from 'components/Shooting/ShootingRewardSection';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import { Button as Btn } from 'ui-boom-components';
import * as ModalsActions from 'redux/actions/modals.actions';
import { PhotographerRefusePanel } from 'components/CancellationReasons/PhotographerRefusePanel';
import { useDispatch } from 'react-redux';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const ShootingAcceptedView = ({
  isBoom,
  onUnassignPhotographer,
  isPhotographer,
  shooting,
  onRefuseShooting,
  onUploadShootingPhotos,
  statusColor,
}) => {
  const dispatch = useDispatch();

  const onDiscardInvite = () => {
    dispatch(
      ModalsActions.showModal('CANCELLATION_DISCARD_INVITE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          paperStyle: { overflowY: 'unset' },
          content: <PhotographerRefusePanel orderStatus={shooting.state} onConfirmCancellation={onRefuseShooting} />,
        },
      })
    );
  };

  return (
    <div>
      {isPhotographer ? (
        <div>
          {shooting.pricingPackage && (
            <div style={{ margin: '20px 0', width: '100%' }}>
              <ShootingRewardSection
                shooting={shooting}
                pricingPackage={shooting.pricingPackage}
                refund={shooting.refund}
                photographerItems={shooting.photographerItems}
              />
            </div>
          )}
          <Grid item xs={12} md={12} style={{ padding: 0 }}>
            <UploadPhotoForm
              title={translations.t('shootings.uploadFileTitle')}
              subtitle={translations.t('shootings.uploadFileDescription')}
              onSubmit={(formData) => onUploadShootingPhotos(formData && formData.zipFile && _.first(formData.zipFile), formData.comments)}
              onDeleteFile={() => dispatch(change('UploadPhotoForm', 'zipFile', null))}
              dispatch={dispatch}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <MDButton
              title={translations.t('shootings.submitShootingPhotos')}
              backgroundColor="#5AC0B1"
              containerstyle={{ marginTop: 20, marginBottom: 20 }}
              onClick={() => dispatch(submit('UploadPhotoForm'))}
            />
          </Grid>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h5 style={{ margin: 0, fontSize: '0.875em', color: '#80888d' }}>{translations.t('shootings.notAvailableAnymore')}</h5>
            <Button style={{ marginLeft: 10 }} onClick={onDiscardInvite}>
              <span style={{ textDecoration: 'underline' }}>{translations.t('shootings.revoke')}</span>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {isBoom && shooting && shooting.photographer && (
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 17 }}>
                <div style={{ fontSize: 17, fontWeight: 500, flexBasis: '85%' }}>{translations.t('shootings.assignedPhotographer')}</div>
                <ShowForPermissions permissions={[Permission.ShootingUnassign]}>
                  <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                    <Btn
                      disabled={moment(shooting.endDate).isBefore(moment().valueOf())}
                      backgroundColor="#D84315"
                      onClick={() => onUnassignPhotographer()}
                      size="small"
                    >
                      {translations.t('shootings.unassignPhotographer')}
                    </Btn>
                  </div>
                </ShowForPermissions>
              </div>
              <AssignedPhotographerPanel />
              {moment(shooting.endDate).isBefore(moment().valueOf()) && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 17 }}>
                  <WarningIcon style={{ marginRight: 10, fontSize: 15, color: '#FF8A80' }} />
                  <h3 style={{ color: '#FF8A80', margin: 0, fontSize: 15 }}>{translations.t('shootings.unassignPhotographerForbidden')}</h3>
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
        </div>
      )}
    </div>
  );
};

export { ShootingAcceptedView };
