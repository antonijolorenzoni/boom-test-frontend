///
// ──────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: V I E W   F O R   R E F U S E D   S H O O T I N G S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//

import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { change, submit } from 'redux-form';
import translations from 'translations/i18next';
import UploadPhotoForm from 'components/Forms/ReduxForms/Shootings/UploadPhotoForm';
import MDButton from 'components/MDButton/MDButton';
import ShootingRewardSection from 'components/Shooting/ShootingRewardSection';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import { LabelTitle } from './styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CancellationActors, PLACE_HOLDER } from 'config/consts';
import { ReasonSection } from '../ReasonSection';

const ShootingRefusedView = ({ shooting, onUploadShootingPhotos }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { reasonCode, pricingPackage, refund, photographerItems, photographer, reasonText } = shooting;

  const { isBoom, isPhotographer } = useSelector((state) => ({
    isBoom: state.user.data.isBoom,
    isPhotographer: state.user.data.isPhotographer,
  }));

  const isPhReason = reasonCode?.includes(CancellationActors.PHOTOGRAPHER);

  return (
    <>
      {isPhotographer && pricingPackage && (
        <div style={{ margin: '20px 0', width: '100%' }}>
          <ShootingRewardSection
            shooting={shooting}
            pricingPackage={pricingPackage}
            refund={refund}
            photographerItems={photographerItems}
          />
        </div>
      )}
      {isBoom && shooting && photographer && (
        <>
          <LabelTitle>{translations.t('shootings.assignedPhotographer')}</LabelTitle>
          <AssignedPhotographerPanel />
        </>
      )}

      {isPhotographer && (
        <>
          <Grid item xs={12} md={12} style={{ padding: 0 }}>
            <UploadPhotoForm
              title={translations.t('shootings.uploadFileTitle')}
              subTitle={translations.t('shootings.uploadFileDescription')}
              onSubmit={(formData) => onUploadShootingPhotos(formData && formData.zipFile && _.first(formData.zipFile), formData.comments)}
              onDeleteFile={() => dispatch(change('UploadPhotoForm', 'zipFile', null))}
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
        </>
      )}
      {(isBoom || (isPhotographer && isPhReason)) && (
        <ReasonSection
          title={t('shootings.refusedByReviewers')}
          reason={reasonCode ? t(`cancellationReasons.${reasonCode}`) : PLACE_HOLDER}
          reasonText={reasonText}
        />
      )}
    </>
  );
};

export { ShootingRefusedView };
