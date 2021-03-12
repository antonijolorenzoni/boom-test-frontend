//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: V I E W   F O R   S H O O T I N G   T O   B E   R E S H O O T E D : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//
import React from 'react';
import translations from 'translations/i18next';
import moment from 'moment';
import {
  SHOOTING_ARCHIVIATION_PERIOD,
  SHOOTING_STATUSES_UI_ELEMENTS,
  SHOOTINGS_STATUSES,
  PLACE_HOLDER,
  CancellationActors,
} from 'config/consts';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import { DownloadLink } from 'components/Shooting/DownloadLink';
import { PhotographLabel, PhotosLabel, ContainerDownloadLink, NotesLabel, NotesText, WarningLabel, ContainerLabels } from './styles';
import { Icon } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReasonSection } from '../ReasonSection';

const ShootingToReshootView = ({ shooting, onDownloadShootingPhotosToReview }) => {
  const { reasonCode, photographer, code, processing, uploadComments, stateChangedAt, completedAt, reasonText } = shooting;

  const { t } = useTranslation();

  const now = moment().valueOf();
  const lastUtilDate = completedAt || stateChangedAt;
  const diff = moment(now).diff(lastUtilDate);
  const isProbablyArchived = moment.duration(diff).days() >= SHOOTING_ARCHIVIATION_PERIOD;
  const color = SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.RESHOOT].color;

  const { isBoom, isPhotographer } = useSelector((state) => ({
    isBoom: state.user.data.isBoom,
    isPhotographer: state.user.data.isPhotographer,
  }));

  const isClient = !isBoom && !isPhotographer;

  const isBoomReason = reasonCode?.includes(CancellationActors.BOOM);
  const isPhReason = reasonCode?.includes(CancellationActors.PHOTOGRAPHER);

  return (
    <>
      {!isBoom && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon name="error_outline" color="#cc3300" style={{ marginRight: 4 }} />
          <WarningLabel>{translations.t('shootings.shootingMarkedAsReshoot')}</WarningLabel>
        </div>
      )}
      {isBoom && photographer && (
        <>
          <PhotographLabel>{translations.t('shootings.assignedPhotographer')}</PhotographLabel>
          <AssignedPhotographerPanel />
          <PhotosLabel>{translations.t('shootings.downloadShooting')}</PhotosLabel>
          <ContainerDownloadLink>
            <DownloadLink onDownload={onDownloadShootingPhotosToReview} filename={code} color={color} />
          </ContainerDownloadLink>
          <ContainerLabels>
            {processing && <WarningLabel>{translations.t('forms.shootingAlreadyPostProcessed')}</WarningLabel>}
            {isProbablyArchived && <WarningLabel>{translations.t('shootings.photosCanBeArchivedWarning')}</WarningLabel>}
          </ContainerLabels>
          {uploadComments && (
            <>
              <NotesLabel>{translations.t('shootings.uploadComments')}</NotesLabel>
              <NotesText>{uploadComments}</NotesText>
            </>
          )}
        </>
      )}
      {(isBoom || (isPhotographer && isPhReason)) && (
        <ReasonSection
          reason={reasonCode ? t(`cancellationReasons.${reasonCode}`) : PLACE_HOLDER}
          title={t('shootings.reshoot')}
          reasonText={reasonText}
        />
      )}
      {isClient && (
        <ReasonSection
          reason={isBoomReason ? t('cancellationReasons.hiddenAskToBoom') : t(`cancellationReasons.${reasonCode}`)}
          reasonTextCondition={!isBoomReason}
          title={t('shootings.reshoot')}
          reasonText={reasonText}
        />
      )}
    </>
  );
};

export { ShootingToReshootView };
