import { debounce } from 'lodash';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import useSWR from 'swr';
import { Button, Icon, Typography } from 'ui-boom-components';

import * as ShootingsAPI from 'api/shootingsAPI';
import * as ModalsActions from 'redux/actions/modals.actions';
import translations from 'translations/i18next';
import PhotographerCard from 'components/ListComponent/PhotographerCard';
import PermissionOld from 'components/Permission/Permission';
import { AutoAssignmentJobStatus, PERMISSIONS, PERMISSION_ENTITIES } from 'config/consts';
import AbilityProvider from 'utils/AbilityProvider';
import { getErrorMessageOnPhotographerDeleted } from 'config/utils';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { useTranslation } from 'react-i18next';
import { ActionButtonsWrapper, CardsWrapper, SubTitle, Title } from './styles';
import { getAutoAssignmentJob, listMatchedPhotographers } from 'api/paths/auto-assignment';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const toPhotographer = (shootingId) => (responseItem) => {
  const {
    isNew,
    isBest,
    estimatedTravelExpenses,
    distance,
    revokedPercentage,
    numShootingDone,
    score: rating,
    queueOrder,
    matchingId,
    firstName,
    lastName,
    photographerId,
    formattedAddress: address,
    unit,
  } = responseItem;

  return {
    photographerId,
    matchingId,
    shootingId,
    address,
    firstName,
    lastName,
    isNew,
    isBest,
    estimatedTravelExpenses,
    distance,
    revokedPercentage,
    numShootingDone,
    rating,
    queueOrder,
    unit,
  };
};

const MAX_SELECTED_PHOTOGRAPHER = 5;

const ShootingMatchedView = ({ isBoom, onSelectManualPhotographer, statusColor, onScrollToTop, shooting }) => {
  const [photographersCardArray, setPhotographersCardArray] = useState([]);
  const [selectedPhotographerIds, setSelectedPhotographerIds] = useState([]);

  const isTabletOrMobile = useMediaQuery({ query: 'screen and (max-width: 1080px)' });

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { data: matchedResponse } = useSWR(listMatchedPhotographers(shooting.company.organization, shooting.id), axiosBoomInstance.get);
  const { data: autoassignmentResponse } = useSWR(getAutoAssignmentJob(shooting.company.organization, shooting.id), axiosBoomInstance.get);

  useEffect(() => {
    if (matchedResponse) {
      const photographers = _.sortBy(matchedResponse.data.map(toPhotographer(shooting.id)), 'queueOrder');
      setPhotographersCardArray(photographers);
      setSelectedPhotographerIds(photographers.slice(0, MAX_SELECTED_PHOTOGRAPHER).map((p) => p.photographerId));
    }
  }, [matchedResponse, shooting.id]);

  const onChangeTravelExpenses = (photographerId) => (newTravelExpenses) => {
    setPhotographersCardArray((photographersCardArray) =>
      photographersCardArray.map((p) => {
        if (p.photographerId === photographerId) {
          return {
            ...p,
            estimatedTravelExpenses: newTravelExpenses,
          };
        }
        return p;
      })
    );
  };

  const onRemovePhotographerCard = (photographerId) => {
    dispatch(
      ModalsActions.showModal('CONFIRM_REMOVE_PHOTOGRAPHER_CARD', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: t('forms.warning'),
          bodyText: t('shootings.confirmRemovePhotographerCard'),
          onConfirm: () => onRemovePhotographerCardConfirm(photographerId),
          confirmText: t('modals.confirm'),
        },
      })
    );
  };

  const onRemovePhotographerCardConfirm = (photographerId) => {
    dispatch(ModalsActions.hideModal('CONFIRM_REMOVE_PHOTOGRAPHER_CARD'));
    setPhotographersCardArray((phChardArray) => phChardArray.filter((p) => p.photographerId !== photographerId));
    setSelectedPhotographerIds((selectedPhIds) => selectedPhIds.filter((pId) => pId !== photographerId));
  };

  const onSendInvites = (invitesCounter) => {
    dispatch(
      ModalsActions.showModal('CONFIRM_SEND_INVITES', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: t('shootings.confirmSendInvitesTitle', { invitesCounter: invitesCounter }),
          content: t('shootings.confirmSendInvitesBody'),
          onConfirm: debounce(onSendInvitesConfirm, 500),
          confirmText: t('modals.confirm'),
        },
      })
    );
  };

  const onSendInvitesConfirm = async () => {
    const byId = (photographerId) => photographersCardArray.find((photographer) => photographer.photographerId === photographerId);

    const sendInvitesDTO = {
      matchings: selectedPhotographerIds
        .map(byId)
        .filter((photographer) => Boolean(photographer))
        .map((p, index) => {
          return {
            estimatedTravelExpenses: p.estimatedTravelExpenses,
            matchingId: p.matchingId,
            queueOrder: index,
          };
        }),
    };

    try {
      await ShootingsAPI.createAutoAssignment(shooting.company.organization, shooting.id, sendInvitesDTO);

      dispatch(ModalsActions.hideModal('CONFIRM_SEND_INVITES'));
      dispatch(
        ModalsActions.showModal('ACCEPT_SEND_INVITES', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.onSendInvitesSuccess'),
          },
        })
      );
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
    } catch (error) {
      dispatch(ModalsActions.hideModal('CONFIRM_SEND_INVITES'));

      const errorCode = _.get(error, 'response.data.code');
      const photographerName = _.get(error, 'response.data.message');

      const errorMessage =
        errorCode && photographerName
          ? getErrorMessageOnPhotographerDeleted(photographerName, errorCode, translations.t('shootings.onSendInvitesError'))
          : translations.t('shootings.onSendInvitesError');

      dispatch(
        ModalsActions.showModal('CONFIRM_SEND_INVITES_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: errorMessage,
          },
        })
      );
    }
  };

  const onTogglePhotographerCard = (photographerId) => {
    setSelectedPhotographerIds((selectedPhIds) => {
      const isSelected = Boolean(selectedPhIds.find((id) => photographerId === id));

      return isSelected
        ? selectedPhIds.filter((id) => id !== photographerId).slice(0, MAX_SELECTED_PHOTOGRAPHER)
        : [...selectedPhIds, photographerId].slice(0, MAX_SELECTED_PHOTOGRAPHER);
    });
  };

  const invitesCounter = selectedPhotographerIds.length;

  const windowScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const getPhotographerCards = (isBest) =>
    photographersCardArray
      .filter((p) => p.isBest === isBest)
      .map((photographer, i) => {
        const position = selectedPhotographerIds.findIndex((pId) => pId === photographer.photographerId);
        const borderStyle = `1px solid ${statusColor}`;
        return (
          <PhotographerCard
            key={photographer.photographerId}
            position={position}
            circleBackgroundColor={position >= 0 ? statusColor : '#B8860B80'}
            shooting={shooting}
            containerstyle={{
              boxSizing: 'border-box',
              border: borderStyle,
            }}
            statusColor={statusColor}
            photographer={photographer}
            onClickCloseIcon={onRemovePhotographerCard}
            onToggle={onTogglePhotographerCard}
            onChangeTravelExpenses={onChangeTravelExpenses(photographer.photographerId)}
          />
        );
      });

  const bestPhotographerCards = getPhotographerCards(true);
  const otherPhotographerCards = getPhotographerCards(false);
  const alreadyRunningJob = _.get(autoassignmentResponse, 'data.status') === AutoAssignmentJobStatus.Running;

  return (
    isBoom && (
      <div>
        <Title>{t('shootings.suggestedPhotographers')}</Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <SubTitle>{t('shootings.maximumSuggestedPhotographers')}</SubTitle>
          <ShowForPermissions permissions={[Permission.ShootingAssign]}>
            <ActionButtonsWrapper>
              {alreadyRunningJob && autoassignmentResponse && (
                <Typography variantName="caption">{t('general.autoAssignmentAlreadyStarted')}</Typography>
              )}
              <Button
                size="small"
                style={{ padding: '13px 24px', marginLeft: 13, marginRight: isTabletOrMobile ? 0 : 8 }}
                onClick={() => onSendInvites(invitesCounter)}
                disabled={alreadyRunningJob || !autoassignmentResponse}
              >
                {t('shootings.sendInvites')}
              </Button>
              <PermissionOld
                do={[PERMISSIONS.ASSIGN]}
                on={PERMISSION_ENTITIES.SHOOTING}
                abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
              >
                <Button
                  size="small"
                  style={{ padding: '13px 24px', backgroundColor: statusColor }}
                  onClick={() => onSelectManualPhotographer([])}
                >
                  {t('shootings.inviteManually')}
                </Button>
              </PermissionOld>
            </ActionButtonsWrapper>
          </ShowForPermissions>
        </div>
        {bestPhotographerCards.length > 0 && (
          <>
            <SubTitle style={{ marginLeft: 10 }}>{translations.t('shootings.bestPhotographers').toUpperCase()}</SubTitle>
            <CardsWrapper>{bestPhotographerCards}</CardsWrapper>
          </>
        )}
        {otherPhotographerCards.length > 0 && (
          <>
            <SubTitle style={{ marginLeft: 10, marginTop: 10 }}>{translations.t('shootings.othersPhotographers').toUpperCase()}</SubTitle>
            <CardsWrapper>{otherPhotographerCards}</CardsWrapper>
          </>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={onScrollToTop || windowScrollTop}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="arrow_upward" color={statusColor} />
            <span style={{ color: statusColor, fontSize: '0.8em', marginRight: 40 }}>{t('shootings.backToTop').toUpperCase()} </span>
          </div>
        </div>
      </div>
    )
  );
};

export default ShootingMatchedView;
