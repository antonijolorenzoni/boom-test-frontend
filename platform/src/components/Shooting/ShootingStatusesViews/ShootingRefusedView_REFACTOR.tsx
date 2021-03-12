import React from 'react';
import { CancellationActors, PLACE_HOLDER } from 'config/consts';
import ShootingRewardSection from 'components/Shooting/ShootingRewardSection';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import { useWhoAmI } from 'hook/useWhoAmI';
import { useTranslation } from 'react-i18next';
import { LabelTitle } from './ShootingRefusedView/styles';
import { ReasonSection } from './ReasonSection';
import { UploadSection } from './UploadSection';

interface Props {
  shooting: any;
  onCompleteUpload: (comment: string, reasonCode?: string, reasonText?: string) => void;
}

export const ShootingRefusedView_REFACTOR: React.FC<Props> = ({ shooting, onCompleteUpload }) => {
  const { isPhotographer, isBoom } = useWhoAmI();
  const { t } = useTranslation();
  const { pricingPackage, refund, photographerItems, photographer, reasonCode, reasonText, code } = shooting;

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
          <LabelTitle>{t('shootings.assignedPhotographer')}</LabelTitle>
          <AssignedPhotographerPanel />
        </>
      )}
      {(isBoom || (isPhotographer && isPhReason)) && (
        <ReasonSection
          title={t('shootings.refusedByReviewers')}
          reason={reasonCode ? t(`cancellationReasons.${reasonCode}`) : PLACE_HOLDER}
          reasonText={reasonText}
        />
      )}
      {isPhotographer && (
        <UploadSection
          orderCode={code}
          onCompleteUpload={onCompleteUpload}
          uploadPhotosSubTitle={t('views.refused.checkRefuseReason')}
          uploadReleaseFormSubTitle={`${t('views.refused.checkRefuseReason')} ${t('views.refused.pdfOnly')}`}
        />
      )}
    </>
  );
};
