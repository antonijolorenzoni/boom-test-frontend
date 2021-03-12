//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: V I E W   F O R   C A N C E L E D   S H O O T I N G S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import translations from 'translations/i18next';
import { AssignedPhotographerPanel } from 'components/AssignedPhotographerPanel';
import { WrapperPenalities, RowPenality, TypePenalityLabel, RefundLabel, PenalitiesLabel, ContainerRowPenality } from './styles';
import { useSelector } from 'react-redux';
import { CancellationActors, PLACE_HOLDER } from 'config/consts';
import { ReasonSection } from '../ReasonSection';

const ShootingCanceledView = ({ shooting }) => {
  const { t } = useTranslation();

  const { reasonCode, photographer, items, reasonText } = shooting;

  const { isBoom, isPhotographer } = useSelector((state) => ({
    isBoom: state.user.data.isBoom,
    isPhotographer: state.user.data.isPhotographer,
  }));

  const isClient = !isBoom && !isPhotographer;

  const isBoomReason = reasonCode?.includes(CancellationActors.BOOM);

  return (
    <>
      {isBoom && photographer && <AssignedPhotographerPanel />}
      {isBoom && (
        <ReasonSection
          reason={reasonCode ? t(`cancellationReasons.${reasonCode}`) : PLACE_HOLDER}
          title={t('shootings.cancellation')}
          reasonText={reasonText}
        />
      )}
      {isClient && (
        <ReasonSection
          reason={isBoomReason ? t('cancellationReasons.hiddenAskToBoom') : t(`cancellationReasons.${reasonCode}`)}
          reasonTextCondition={!isBoomReason}
          title={t('shootings.cancellation')}
          reasonText={reasonText}
        />
      )}
      {!_.isEmpty(items) && isBoom && (
        <>
          <PenalitiesLabel>{translations.t('forms.penaltiesAndRefunds')}</PenalitiesLabel>
          <WrapperPenalities>
            <ContainerRowPenality>
              {_.map(items, (item) => (
                <RowPenality>
                  <TypePenalityLabel>{translations.t(`invoiceTypes.${item.type}`)}</TypePenalityLabel>
                  <RefundLabel>{`${item.amount} ${item.currency && item.currency.symbol ? item.currency.symbol : ''} `}</RefundLabel>
                </RowPenality>
              ))}
            </ContainerRowPenality>
          </WrapperPenalities>
        </>
      )}
    </>
  );
};

export { ShootingCanceledView };
