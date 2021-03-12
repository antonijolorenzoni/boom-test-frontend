//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M A I N   V I E W   F O R   S H O O T I N G   M A N A G E M E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
/*
 * FOLLOWING THE SINGLE RESPONSIBILITY PRINCIPLE ALL SHOOTING MANAGEMENT FUNCTIONS ARE COLLECTED IN THIS FILE
 * EVERY FUNCTION PRESENTED HERE WILL EVENTUALLY DISPATCH A REDUX ACTION FROM THE shooting.actions COLLECTION
 */

import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { destroy, initialize, submit } from 'redux-form';
import {
  SHOOTINGS_STATUSES,
  INVOICE_ITEMS_TYPES,
  SHOOTING_STATUSES_UI_ELEMENTS,
  USER_ROLES,
  INTERNAL_EDITING_VALUE,
  EXTERNAL_EDITING_VALUE,
  PHOTOGRAPHER_SHOOTING_STATUSES_TRANSLATION_MAP,
  PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES,
} from 'config/consts';
import * as ShootingActions from 'redux/actions/shootings.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import translations from 'translations/i18next';
import BoomCancelShootingForm from '../Forms/ReduxForms/Shootings/BoomCancelShootingForm';
import { OrderAdditionalInfoForm } from '../Forms/OrderAdditionalInfoForm';
import ShootingAdditionalInfoView from '../Forms/ReduxForms/Shootings/ShootingAdditionalInfoView';
import SelectManualPhotographerForm from '../Forms/ReduxForms/Shootings/SelectManualPhotographerForm';
import ShootingRescheduleForm from '../Forms/ReduxForms/Shootings/ShootingRescheduleForm';
import ShootingTitleForm from '../Forms/ReduxForms/Shootings/ShootingTitleForm';
import { ShootingInfoDetails } from './ShootingInfoDetails';
import ShootingStatusView from './ShootingStatusesViews/ShootingStatusView';
import ShootingEventLogView from './ShootingEventLogViews/ShootingEventLogView';
import { mapOrderStatus } from 'config/utils';
import { buildOrderStartDate } from 'utils/date-utils';
import { SalesInfoDialogContent } from './ShootingInfoDetails/SalesInfoDialogContent';
import { resendDeliveries, cancelShooting, confirmShootingPhotosUpload } from 'api/shootingsAPI';
import * as OrdersAPI from 'api/ordersAPI';
import { datadogLogs } from '@datadog/browser-logs';
import { LogMessage } from 'utils/logger';
import { Trans } from 'react-i18next';
import { DeleteReasonPanel } from 'components/CancellationReasons/DeleteReasonPanel';
import { refuseInvitation, revokeAvailability } from 'api/photographerAPI';
import { AdminRefuseAndReshootPhotoPanel } from 'components/CancellationReasons/AdminRefuseAndReshootPhotoPanel';
import { refuseOrder, reshootOrder } from 'api/photos';
import { download } from 'utils/download';
import { InfoPanel } from 'components/Modals/Panels/InfoPanel';

class ShootingActionsView extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(ShootingActions.setSelectedShooting({}));
  }

  /*
   * Present the ASSIGN photographer modal
   */
  async onAssignPhotographer(photographerData) {
    const { dispatch } = this.props;
    const photographerId = _.get(photographerData, 'photographer.value');
    const manualAssignPhotographerDTO = {
      amount: _.get(photographerData, 'travelExpenses'),
    };
    dispatch(
      ModalsActions.showModal('CONFIRM_PHOTOGRAPHER_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: <Trans i18nKey="shootings.confirmPhotographer" />,
          onConfirm: _.debounce(() => this.onAssignPhotographerConfirm(photographerId, manualAssignPhotographerDTO), 500),
          confirmText: translations.t('modals.confirm'),
        },
      })
    );
  }

  /*
   * Assign a photographer to a shooting
   */
  async onAssignPhotographerConfirm(photographerId, manualAssignPhotographerDTO) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;

    dispatch(ModalsActions.hideModal('CONFIRM_PHOTOGRAPHER_DIALOG'));

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await dispatch(ShootingActions.assignShootingPhotographer(selectedShooting.id, photographerId, manualAssignPhotographerDTO));
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('MODIFY_INFO_MODAL'));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));

      if (onCompleteShootingAction) {
        // callback from external views
        onCompleteShootingAction(selectedShooting);
      }

      dispatch(ShootingActions.setSelectedShooting({}));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('calendar.assignPhotographerSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CONFIRM_PHOTOGRAPHER_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('calendar.errorAssignPhotographer'),
          },
        })
      );
    } finally {
      dispatch(destroy('SelectManualPhotographerForm'));
    }
  }

  /*
   * Present the UNASSIGN photographer modal
   */
  async onUnassignPhotographer() {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('CONFIRM_REMOVE_PHOTOGRAPHER_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.removePhotographer'),
          onConfirm: () => this.onUnassignPhotographerConfirm(),
          confirmText: translations.t('modals.confirm'),
        },
      })
    );
  }

  /*
   * Unassign the photographer for the shooting
   */
  async onUnassignPhotographerConfirm() {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;

    dispatch(ModalsActions.hideModal('CONFIRM_REMOVE_PHOTOGRAPHER_DIALOG'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await dispatch(ShootingActions.removeAssignShootingPhotographer(selectedShooting.id));
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));

      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }

      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('calendar.unassignPhotographerSuccess'),
          },
        })
      );
      dispatch(ShootingActions.setSelectedShooting({}));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CONFIRM_PHOTOGRAPHER_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('calendar.errorUnassignPhotographer'),
          },
        })
      );
    }
  }

  /*
   * Present the ACCEPT shooting modal
   */
  onAcceptShooting = async () => {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('ACCEPT_SHOOTING_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.onAcceptShootingConfirm'),
          onConfirm: () => this.onAcceptShootingConfirm(),
          confirmText: translations.t('modals.confirm'),
        },
      })
    );
  };

  /*
   * Photographer accepting the shooting (ASSIGNED -> ACCEPTED)
   */
  async onAcceptShootingConfirm() {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      onGoToAcceptedShooting,
    } = this.props;
    dispatch(ModalsActions.hideModal('ACCEPT_SHOOTING_DIALOG'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const newShooting = await dispatch(ShootingActions.acceptShooting(selectedShooting.id));
      datadogLogs.logger.info(LogMessage.acceptShooting, { step: 'onAcceptShootingConfirm', shootingId: selectedShooting.id });
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting(newShooting));
      dispatch(ShootingActions.fetchShootings());
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('shootings.acceptShootingSuccessTitle'),
            bodyText: translations.t('shootings.acceptShootingSuccess'),
            confirmText: onGoToAcceptedShooting ? translations.t('shootings.showActivity') : translations.t('modals.ok'),
            onConfirm: () => {
              if (onGoToAcceptedShooting) {
                onGoToAcceptedShooting(selectedShooting);
              }
              if (onCompleteShootingAction) {
                onCompleteShootingAction(selectedShooting);
              }
              dispatch(ModalsActions.hideModal('ACCEPT_SHOOTING_SUCCESS'));
            },
          },
        })
      );
    } catch (error) {
      datadogLogs.logger.error(LogMessage.acceptShooting, {
        step: 'onAcceptShootingConfirm',
        shootingId: selectedShooting.id,
        error: error.message,
      });
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.acceptShootingError'),
          },
        })
      );
    }
  }

  /*
   * The photographer refuse the shooting
   */
  async onRefuseShooting(reasonCode, reasonText) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      location,
      history,
    } = this.props;

    dispatch(ModalsActions.hideModal('REFUSE_SHOOTING_DIALOG'));
    dispatch(ModalsActions.hideModal('CANCELLATION_DISCARD_INVITE_MODAL'));

    const { code, state, id } = selectedShooting;

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));

      const photographerOrderStatus = PHOTOGRAPHER_SHOOTING_STATUSES_TRANSLATION_MAP[state];

      if (photographerOrderStatus === PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES.NEW_INVITE) {
        await refuseInvitation(code, { reasonCode, reasonText });
      } else {
        await revokeAvailability(code, { reasonCode, reasonText });
      }

      dispatch(UtilsActions.setSpinnerVisibile(false));

      if (location.search.indexOf('?shootingId=') >= 0) {
        history.push('/calendar');
        dispatch(ShootingActions.setSelectedShooting({}));
      } else {
        dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
        dispatch(ShootingActions.fetchShootings());
        if (onCompleteShootingAction) {
          onCompleteShootingAction(selectedShooting);
        }
      }

      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.refuseShootingSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      datadogLogs.logger.error(LogMessage.refuseShooting, {
        step: 'onRefuseShooting',
        shootingId: id,
        error: error.message,
      });
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.refuseShootingError'),
          },
        })
      );
    }
  }

  /*
   * Cancel shooting switch depending if the invoker is a BOOM user
   */
  async onCancelShooting() {
    const {
      user: {
        data: { isBoom },
      },
    } = this.props;

    if (isBoom) {
      this.onCancelShootingBoom();
    } else {
      this.onNormalCancelShooting();
    }
  }

  openCancellationReasonDialog(cancelData) {
    const {
      dispatch,
      shootings: {
        selectedShooting: { state },
      },
    } = this.props;

    dispatch(
      ModalsActions.showModal('ORDER_CANCELLATION_REASONS', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          paperStyle: { overflowY: 'unset' },
          content: (
            <DeleteReasonPanel
              orderStatus={state}
              onConfirmCancellation={(selectedReason, textReason) => {
                this.onCancelShootingBoomConfirm({ selectedReason, textReason, cancelData });
              }}
              isPhActorVisible={state === SHOOTINGS_STATUSES.UPLOADED}
            />
          ),
        },
      })
    );
  }

  async onCancelUnscheduled(selectedShooting) {
    const organizationId = selectedShooting.company.organization;
    const shootingId = selectedShooting.id;
    const { dispatch, updateOrders } = this.props;

    try {
      dispatch(ModalsActions.hideModal('CANCEL_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await cancelShooting(organizationId, shootingId);
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(ModalsActions.hideModal('CANCEL_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingError'),
          },
        })
      );
    }
  }

  /*
   * Initilize the Cancel Shooting Form for BOOM users.
   * The form present the possibility to assign a penalty to photographer/company
   */
  async onCancelShootingBoom() {
    const {
      dispatch,
      shootings: { selectedShooting },
      user: {
        data: { organization },
      },
    } = this.props;

    const filteredItems = _.filter(selectedShooting.items, (item) => item.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_TRAVEL_EXPENSES);

    const sumTravelExpenses =
      selectedShooting && selectedShooting.refund
        ? _.sum(_.map(filteredItems, 'amount')) + selectedShooting.refund
        : _.sum(_.map(filteredItems, 'amount'));

    dispatch(initialize('BoomCancelShootingForm', { ...selectedShooting }));

    if (selectedShooting.state === SHOOTINGS_STATUSES.UNSCHEDULED) {
      this.openCancellationReasonDialog();
    } else {
      dispatch(
        ModalsActions.showModal('CANCEL_SHOOTING_BOOM', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            content: (
              <BoomCancelShootingForm
                currency={selectedShooting && selectedShooting.pricingPackage && selectedShooting.pricingPackage.currency}
                companyPrice={selectedShooting && selectedShooting.pricingPackage && selectedShooting.pricingPackage.companyPrice}
                photographerEarning={
                  selectedShooting && selectedShooting.pricingPackage && selectedShooting.pricingPackage.photographerEarning
                }
                photographer={selectedShooting && selectedShooting.photographer}
                travelExpenses={sumTravelExpenses}
                organizationId={organization}
                onSubmit={(cancelData) => this.openCancellationReasonDialog(cancelData)}
              />
            ),
          },
        })
      );
    }
  }

  async deleteOrder(shootingId, selectedReason, textReason) {
    const { dispatch } = this.props;
    try {
      await OrdersAPI.deleteOrder(shootingId, selectedReason, textReason);
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CANCEL_ORDER_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingError'),
          },
        })
      );
    }
  }

  /*
   * BOOM Confirm to cancel shooting along with penalty for company/photographer
   */
  async onCancelShootingBoomConfirm({ selectedReason, textReason, cancelData }) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));

      if (selectedShooting.state === SHOOTINGS_STATUSES.UNSCHEDULED) {
        await this.deleteOrder(selectedShooting.id, selectedReason, textReason);
      } else {
        await dispatch(ShootingActions.cancelShootingWithInvoices(selectedShooting.id, cancelData, selectedReason, textReason));
      }

      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('ORDER_CANCELLATION_REASONS'));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ModalsActions.hideModal('CANCEL_SHOOTING_BOOM'));
      dispatch(ShootingActions.setSelectedShooting({}));

      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }

      dispatch(
        ModalsActions.showModal('CANCEL_ORDER_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CANCEL_ORDER_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingError'),
          },
        })
      );
    }
  }

  /*
   * Present the cancel shooting modal
   */
  async onNormalCancelShooting() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;

    const { state } = selectedShooting;

    const now = moment().valueOf();
    const diff = moment(selectedShooting.startDate).diff(now);
    const duration = moment.duration(diff);
    const isStartBefore = moment(selectedShooting.startDate).isBefore(now);

    let warningMessage = translations.t('shootings.onCancelShootingConfirm');

    if (isStartBefore || (duration.days() === 0 && duration.hours() <= 6)) {
      warningMessage = translations.t('shootings.onCancelShootingConfirmPenalityHard');
    }

    if (duration.days() === 0 && duration.hours() >= 6) {
      warningMessage = translations.t('shootings.onCancelShootingConfirmPenality');
    }

    dispatch(
      ModalsActions.showModal('ORDER_CANCELLATION_REASONS', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          paperStyle: { overflowY: 'unset' },
          content: (
            <DeleteReasonPanel
              orderStatus={state}
              warningMessage={warningMessage}
              onConfirmCancellation={(selectedReason, textReason) => {
                this.onCancelShootingConfirm({ selectedReason, textReason });
              }}
            />
          ),
        },
      })
    );
  }

  /*
   * Regular CANCEL shooting procedure
   */
  async onCancelShootingConfirm({ selectedReason, textReason }) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;

    dispatch(ModalsActions.hideModal('CANCEL_SHOOTING_DIALOG'));

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await OrdersAPI.deleteOrder(selectedShooting.id, selectedReason, textReason);
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('ORDER_CANCELLATION_REASONS'));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));

      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }

      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.cancelShootingError'),
          },
        })
      );
    }
  }

  /*
   * Present the UPLOAD modal warning
   */
  async onUploadShootingPhotos(file, comments) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('UPLOAD_SHOOTING_REQUEST', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.uploadShootingRequest'),
          onConfirm: () => this.onUploadPhotoConfirm(file, comments),
        },
      })
    );
  }

  async onCompleteUpload(comments, reasonCode, reasonText) {
    const {
      shootings: {
        selectedShooting: {
          id: shootingId,
          company: { organization: organizationId },
        },
      },
      dispatch,
      onClose,
      updateOrders,
    } = this.props;

    try {
      const response = await confirmShootingPhotosUpload(organizationId, shootingId, { comments, reasonCode, reasonText });
      const updatedShooting = response?.data;
      if (updatedShooting) {
        dispatch(ShootingActions.updateShootingInState(updatedShooting));
        dispatch(ShootingActions.setSelectedShooting(updatedShooting));
        dispatch(ShootingActions.updateCalendarShooting(updatedShooting));
      }
      updateOrders && updateOrders();
      onClose && onClose();

      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            hideCancel: true,
            hideConfirm: true,
            onCloseModal: () => dispatch(ModalsActions.hideModal('UPLOAD_SHOOTING_ERROR')),
            content: (
              <InfoPanel
                title={translations.t('views.accepted.thankYouTitle')}
                subtitle={translations.t('views.accepted.confirmationUploadText')}
                button={translations.t('views.accepted.alrighty')}
                onConfirm={() => dispatch(ModalsActions.hideModal('UPLOAD_SHOOTING_ERROR'))}
              />
            ),
          },
        })
      );
    } catch {
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.somethingWentWrong'),
          },
        })
      );
    }
  }

  /*
   * UPLOAD shooting photos
   */

  async onUploadPhotoConfirm(file, comments) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      onGoToUploadedShooting,
    } = this.props;
    try {
      dispatch(ModalsActions.hideModal('UPLOAD_SHOOTING_REQUEST'));
      dispatch(UtilsActions.setLoadingProgressVisible(true, translations.t('shootings.uploadingPhotos')));
      await dispatch(ShootingActions.uploadRAWPhotos(selectedShooting.id, file, comments));
      dispatch(UtilsActions.setLoadingProgressVisible(false));
      dispatch(UtilsActions.setLoadingProgress(0));

      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      if (selectedShooting.state !== SHOOTINGS_STATUSES.UPLOADED) {
        dispatch(
          ModalsActions.showModal('UPLOAD_SHOOTING_SUCCESS', {
            modalType: 'MODAL_DIALOG',
            modalProps: {
              title: translations.t('shootings.uploadShootingSuccessTitle'),
              bodyText: translations.t('shootings.uploadShootingSuccess'),
              confirmText: onGoToUploadedShooting ? translations.t('shootings.showActivity') : translations.t('modals.ok'),
              onConfirm: () => {
                if (onGoToUploadedShooting) {
                  onGoToUploadedShooting(selectedShooting);
                }
                if (onCompleteShootingAction) {
                  onCompleteShootingAction(selectedShooting);
                }
                dispatch(ModalsActions.hideModal('UPLOAD_SHOOTING_SUCCESS'));
              },
            },
          })
        );
      } else {
        dispatch(
          ModalsActions.showModal('UPLOAD_SHOOTING_SUCCESS', {
            modalType: 'SUCCESS_ALERT',
            modalProps: {
              message: translations.t('shootings.updateUploadedShootingSuccess'),
            },
          })
        );
      }
    } catch (error) {
      dispatch(UtilsActions.setLoadingProgressVisible(false));
      dispatch(UtilsActions.setLoadingProgress(0));
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.uploadShootingError'),
          },
        })
      );
    }
  }

  /*
   * Present ACCEPT shooting photos
   */
  onAcceptShootingPhotos() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    dispatch(
      ModalsActions.showModal('CONFIRM_PHOTOS_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.acceptShootingsPhotosConfirm'),
          onConfirm: () => this.onAcceptShootingPhotosConfirm(selectedShooting),
          confirmText: translations.t('shootings.acceptShooting'),
        },
      })
    );
  }

  /*
   * Accept shooting photos procedure
   */
  async onAcceptShootingPhotosConfirm(shooting) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;

    try {
      dispatch(ModalsActions.hideModal('CONFIRM_PHOTOS_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await dispatch(ShootingActions.acceptShootingPhototos(shooting.id));
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));

      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }

      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.acceptShootingsPhotosConfirmSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.acceptShootingsPhotosConfirmError'),
          },
        })
      );
    }
  }

  /*
   * Present the REFUSE shooting photos modal
   */

  onRefuseShootingPhotos() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;

    const { state } = selectedShooting;

    dispatch(
      ModalsActions.showModal('REFUSE_SHOOTING_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          paperStyle: { overflowY: 'unset' },
          content: (
            <AdminRefuseAndReshootPhotoPanel
              orderStatus={state}
              onConfirmCancellation={(reasonCode, reasonText) => {
                this.onRefuseShootingPhotosConfirm(selectedShooting, reasonCode, reasonText);
              }}
              isRefusing
            />
          ),
        },
      })
    );
  }

  /*
   * Refuse photos confirmed procedure
   */
  async onRefuseShootingPhotosConfirm(shooting, reasonCode, reasonText) {
    const { dispatch, onCompleteShootingAction, updateOrders } = this.props;

    try {
      dispatch(ModalsActions.hideModal('REFUSE_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await refuseOrder(shooting.code, reasonCode, reasonText);
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));

      if (onCompleteShootingAction) {
        onCompleteShootingAction(shooting);
      }

      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.refuseShootingsPhotosConfirmSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.refuseShootingsPhotosConfirmError'),
          },
        })
      );
    }
  }

  /*
   * Download shooting POST photos
   */
  async onDownloadShooting() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    try {
      await dispatch(ShootingActions.downloadShootingsPhotos(selectedShooting));
    } catch (error) {
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.downloadShootingError'),
          },
        })
      );
    }
  }

  /*
   * Download shooting RAW photos
   */
  async onDownloadShootingPhotosToReview() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    try {
      await dispatch(ShootingActions.downloadShootingsPhotosToReview(selectedShooting));
    } catch (error) {
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.downloadShootingError'),
          },
        })
      );
    }
  }

  /*
   * Present the UPLOAD POST modal dialog
   */
  async onUploadPostProducedPhotos(file) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('UPLOAD_POSTPRODUCED_SHOOTING_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.uploadPostProductionConfirm'),
          confirmText: translations.t('shootings.markShootingComplete'),
          onConfirm: () => this.onUploadPostProducedPhotosConfirm(file),
        },
      })
    );
  }

  /*
   * Upload POST shooting photos
   */
  async onUploadPostProducedPhotosConfirm(postProducedPhotos) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
    } = this.props;
    try {
      dispatch(ModalsActions.hideModal('UPLOAD_POSTPRODUCED_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setLoadingProgressVisible(true, translations.t('shootings.uploadingPhotos')));
      await dispatch(ShootingActions.uploadPOSTPhotos(selectedShooting.id, postProducedPhotos));
      dispatch(UtilsActions.setLoadingProgressVisible(false));
      dispatch(UtilsActions.setLoadingProgress(0));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));
      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }
      dispatch(
        ModalsActions.showModal('UPLOAD_POSTPRODUCED_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.uploadPostProductionSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setLoadingProgressVisible(false));
      dispatch(UtilsActions.setLoadingProgress(0));
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.uploadPostProductionError'),
          },
        })
      );
    }
  }

  /*
   * Present shooting DONE modal
   */
  async onMarkShootingCompleted(completeData) {
    const { dispatch } = this.props;

    dispatch(
      ModalsActions.showModal('UPLOAD_POSTPRODUCED_SHOOTING_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.uploadPostProductionConfirm'),
          confirmText: translations.t('shootings.markShootingComplete'),
          onConfirm: () => this.onMarkShootingCompletedConfirm(completeData),
        },
      })
    );
  }

  /*
   * Mark shooting as DONE
   */
  async onMarkShootingCompletedConfirm(evaluationData) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
    } = this.props;
    try {
      dispatch(ModalsActions.hideModal('UPLOAD_POSTPRODUCED_SHOOTING_DIALOG'));
      const postProducedPhotos = evaluationData && evaluationData.zipFile && _.first(evaluationData.zipFile);
      const evaluations = _.omit(evaluationData, ['zipFile', 'uploadNotes']);
      dispatch(UtilsActions.setLoadingProgressVisible(true, translations.t('shootings.uploadingPhotos')));
      try {
        await dispatch(ShootingActions.createBoomShootingScore(selectedShooting, evaluations));
      } catch (error) {}
      if (evaluationData.uploadNotes) {
        try {
          await dispatch(ShootingActions.createShootingUploadNotes(selectedShooting, evaluationData.uploadNotes));
        } catch (error) {}
      }
      await dispatch(ShootingActions.uploadPOSTPhotos(selectedShooting.id, postProducedPhotos));
      dispatch(UtilsActions.setLoadingProgressVisible(false));
      dispatch(UtilsActions.setLoadingProgress(0));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));
      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }
      dispatch(
        ModalsActions.showModal('UPLOAD_POSTPRODUCED_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.uploadPostProductionSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setLoadingProgressVisible(false));
      dispatch(UtilsActions.setLoadingProgress(0));
      dispatch(
        ModalsActions.showModal('UPLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.uploadPostProductionError'),
          },
        })
      );
    }
  }

  /*
   * Present RESHOOT shooting modal
   */
  onReshootShooting() {
    const {
      dispatch,
      shootings: {
        selectedShooting: { state },
      },
    } = this.props;
    dispatch(
      ModalsActions.showModal('RESHOOT_SHOOTING_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          paperStyle: { overflowY: 'unset' },
          content: (
            <AdminRefuseAndReshootPhotoPanel
              orderStatus={state}
              subTitle={translations.t('shootings.reshootShootingConfirm')}
              onConfirmCancellation={(reasonCode, reasonText) => this.onReshootShootingConfirm(reasonCode, reasonText)}
            />
          ),
        },
      })
    );
  }

  /*
   * Mark shooting as RESHOOT
   */
  async onReshootShootingConfirm(reasonCode, reasonText) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;
    try {
      dispatch(ModalsActions.hideModal('RESHOOT_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      await reshootOrder(selectedShooting.code, reasonCode, reasonText);
      updateOrders && updateOrders();

      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(ShootingActions.setSelectedShooting({}));

      if (onCompleteShootingAction) {
        onCompleteShootingAction(selectedShooting);
      }

      dispatch(
        ModalsActions.showModal('RESHOOT_SHOOTING_DIALOG_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.reshootShootingConfirmSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('RESHOOT_SHOOTING_DIALOG_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.reshootShootingConfirmError'),
          },
        })
      );
    }
  }

  submitAdditionalInfoForm = async (shootingData, isDeliveryFormDataChanged) => {
    const {
      dispatch,
      shootings: { selectedShooting },
      user: {
        data: { isBoom },
      },
      updateOrders,
    } = this.props;

    const { id: shootingId, organization: organizationId, mainContact } = selectedShooting;
    const shootingStatus = mapOrderStatus(true, false, selectedShooting.state);

    const toNewOrderDTO = (values) => ({
      deliveryEmails: values.deliveryMethodsEmails,
      driveDelivery: values.deliveryMethodsIsDriveSelected,
      description: values.description,
      logisticInformation: values.logisticInformation,
      editingOption: values.editingOption,
      driveFolderId: values.driveFolderId,
      driveFolderName: values.driveFolderName,
      mainContact: {
        fullName: values.contactName,
        email: values.contactEmail,
        phoneNumber: values.contactPhoneNumber,
        addictionalPhoneNumber: values.addictionalContactPhoneNumber || null,
      },
    });

    const finalInfoData = mainContact ? toNewOrderDTO(shootingData) : shootingData;

    const showEditShootingError = () => {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('EDIT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingModifyError'),
          },
        })
      );
    };

    const showEditShootingOk = () => {
      dispatch(
        ModalsActions.showModal('EDIT_SHOOTING_OK', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingModifySuccess'),
          },
        })
      );
    };

    if (isDeliveryFormDataChanged && [SHOOTINGS_STATUSES.DONE, SHOOTINGS_STATUSES.DOWNLOADED].includes(shootingStatus) && isBoom) {
      dispatch(
        ModalsActions.showModal('ASK_RESEND', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('shootings.deliveryMethodsChanged'),
            bodyText: translations.t('shootings.askResendToAllDeliveryMethods'),
            cancelText: 'No',
            onConfirm: async () => {
              try {
                dispatch(UtilsActions.setSpinnerVisibile(true));
                const updatedShooting = await dispatch(ShootingActions.updateShootingAdditionalInfo(selectedShooting.id, finalInfoData));

                updateOrders && updateOrders();

                await resendDeliveries(organizationId, shootingId);
                dispatch(UtilsActions.setSpinnerVisibile(false));
                dispatch(ShootingActions.setSelectedShooting({ ...selectedShooting, ...updatedShooting }));
                dispatch(ModalsActions.hideModal('ASK_RESEND'));
                dispatch(ModalsActions.hideModal('MODIFY_INFO_MODAL'));
                dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
                showEditShootingOk();
              } catch (err) {
                showEditShootingError();
              }
            },
            onCancel: async () => {
              try {
                dispatch(UtilsActions.setSpinnerVisibile(true));
                const updatedShooting = await dispatch(ShootingActions.updateShootingAdditionalInfo(selectedShooting.id, finalInfoData));

                updateOrders && updateOrders();

                dispatch(UtilsActions.setSpinnerVisibile(false));
                dispatch(ShootingActions.setSelectedShooting({ ...selectedShooting, ...updatedShooting }));
                dispatch(ModalsActions.hideModal('MODIFY_INFO_MODAL'));
                dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
                showEditShootingOk();
              } catch (err) {
                showEditShootingError();
              }
            },
          },
        })
      );
    } else {
      try {
        const updatedShooting = await dispatch(ShootingActions.updateShootingAdditionalInfo(selectedShooting.id, finalInfoData));

        updateOrders && updateOrders();

        dispatch(UtilsActions.setSpinnerVisibile(false));
        dispatch(ShootingActions.setSelectedShooting({ ...selectedShooting, ...updatedShooting }));
        dispatch(ModalsActions.hideModal('MODIFY_INFO_MODAL'));
        dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
        showEditShootingOk();
      } catch (error) {
        showEditShootingError();
      }
    }
  };

  checkEditingOptionAndSubmit(formData, initialEditingOption, status, deliveryDataChanged) {
    const { dispatch } = this.props;

    const newEditingOption = _.get(formData, 'editingOption', null);

    const needWarningMessage =
      newEditingOption &&
      initialEditingOption &&
      newEditingOption === INTERNAL_EDITING_VALUE &&
      initialEditingOption === EXTERNAL_EDITING_VALUE;

    const isPostProcessingOrder = status === SHOOTINGS_STATUSES.POST_PROCESSING;

    if (needWarningMessage) {
      dispatch(
        ModalsActions.showModal('CONFIRM_CHANGE_EDITING_OPTION', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t(
              `shootings.${isPostProcessingOrder ? 'postProcTitleModalChangeEditingOption' : 'titleModalChangeEditingOption'}`
            ),
            bodyText: translations.t(
              `shootings.${isPostProcessingOrder ? 'postProcBodyTextModalChangeEditingOption' : 'bodyTextModalChangeEditingOption'}`
            ),
            onConfirm: () => {
              this.submitAdditionalInfoForm(formData, deliveryDataChanged);
              dispatch(ModalsActions.hideModal('CONFIRM_CHANGE_EDITING_OPTION'));
            },
          },
        })
      );
    } else {
      this.submitAdditionalInfoForm(formData, deliveryDataChanged);
    }
  }

  onShowShootingInfoForm() {
    const {
      dispatch,
      shootings: { selectedShooting },
      user: {
        data: { isPhotographer },
      },
    } = this.props;

    if (!isPhotographer) {
      dispatch(
        ModalsActions.showModal('MODIFY_INFO_MODAL', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            hideCancel: true,
            title: translations.t('shootings.modifyAdditionalInfo'),
            content: (
              <OrderAdditionalInfoForm
                onCancel={() => dispatch(ModalsActions.hideModal('MODIFY_INFO_MODAL'))}
                onSubmit={(formData, deliveryDataChanged) =>
                  this.checkEditingOptionAndSubmit(formData, selectedShooting.editingOption, selectedShooting.state, deliveryDataChanged)
                }
                order={selectedShooting}
              />
            ),
            confirmText: translations.t('forms.save'),
          },
        })
      );
    } else {
      dispatch(
        ModalsActions.showModal('MODIFY_INFO_MODAL', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('shootings.modifyAdditionalInfo'),
            content: <ShootingAdditionalInfoView shooting={selectedShooting} />,
          },
        })
      );
    }
  }

  onShowSalesInfo() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    const { company, pricingPackage, checklist } = selectedShooting;
    const checklistUrl = _.get(checklist, 'checklistUrl');

    dispatch(
      ModalsActions.showModal('SALES_INFO', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('shootings.salesInfo'),
          content: <SalesInfoDialogContent clientName={company.name} checklistUrl={checklistUrl} pricingPackage={pricingPackage} />,
        },
      })
    );
  }

  onSelectManualPhotographer(photographersToExclude) {
    const {
      dispatch,
      user: {
        data: { isBoom },
      },
      shootings: { selectedShooting },
    } = this.props;
    if (isBoom) {
      const currency = _.get(selectedShooting, 'pricingPackage.currency.symbol');
      dispatch(
        ModalsActions.showModal('MODIFY_INFO_MODAL', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('shootings.inviteManually'),
            confirmText: translations.t('shootings.sendInvitation'),
            hideCancel: true,
            width: 500,
            content: (
              <SelectManualPhotographerForm
                currency={currency || ''}
                onSubmit={(photographerData) => this.onAssignPhotographer(photographerData)}
                photographersToExclude={photographersToExclude}
              />
            ),
            onCancel: () => dispatch(destroy('SelectManualPhotographerForm')),
            onConfirm: () => dispatch(submit('SelectManualPhotographerForm')),
          },
        })
      );
    }
  }

  /*
   * Present and initialize shooting reschedule form
   */
  onShowShootingRescheduleForm() {
    const {
      dispatch,
      shootings: { selectedShooting },
      user: {
        data: { isBoom, organization },
      },
    } = this.props;
    const selectedAddress = [
      {
        value: selectedShooting.place,
        label: selectedShooting.place.formattedAddress,
      },
    ];
    const start = moment.tz(moment.utc(selectedShooting.startDate), selectedShooting.timezone).valueOf();
    const now = moment().valueOf();
    const diff = moment(start).diff(now);
    const canEditAddress = moment.duration(diff).asHours() >= 24;
    const filteredItems = _.filter(selectedShooting.items, (item) => item.type === INVOICE_ITEMS_TYPES.PHOTOGRAPHER_TRAVEL_EXPENSES);
    const sumTravelExpenses =
      selectedShooting && selectedShooting.refund
        ? _.sum(_.map(filteredItems, 'amount')) + selectedShooting.refund
        : _.sum(_.map(filteredItems, 'amount'));
    dispatch(
      initialize('ShootingRescheduleForm', {
        ...selectedShooting,
        placeSelected: selectedAddress,
        startTime: start,
        date: selectedShooting.startDate,
        shootingDuration: selectedShooting.pricingPackage.shootingDuration,
        timezoneSelected: selectedShooting.timezone,
      })
    );
    dispatch(
      ModalsActions.showModal('SHOOTING_RESCHEDULE_VIEW', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <ShootingRescheduleForm
              isBoom={isBoom}
              canEditAddress={canEditAddress}
              onSubmit={(shootingData) => this.onShootingRescheduleRequest(shootingData)}
              currency={selectedShooting && selectedShooting.pricingPackage && selectedShooting.pricingPackage.currency}
              companyPrice={selectedShooting && selectedShooting.pricingPackage && selectedShooting.pricingPackage.companyPrice}
              photographerEarning={
                selectedShooting && selectedShooting.pricingPackage && selectedShooting.pricingPackage.photographerEarning
              }
              photographer={selectedShooting && selectedShooting.photographer}
              travelExpenses={sumTravelExpenses}
              organizationId={organization}
            />
          ),
        },
      })
    );
  }

  /*
   * Present RESCHEDULE shooting modal
   */
  onShootingRescheduleRequest(rescheduleData) {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    const now = moment.tz(moment.utc(), rescheduleData.timezoneSelected);
    const startDate = moment.tz(moment.utc(selectedShooting.startDate), rescheduleData.timezoneSelected);
    const diff = startDate.diff(now);
    const duration = moment.duration(diff);

    let rescheduleWarning = translations.t('shootings.onRescheduleShootingConfirm');
    if (duration.days() === 0 && duration.hours() <= 6) {
      rescheduleWarning = translations.t('shootings.onRescheduleShootingConfirmPenalityHard');
    }
    if (duration.days() === 0 && duration.hours() >= 6) {
      rescheduleWarning = translations.t('shootings.onRescheduleConfirmPenality');
    }

    dispatch(
      ModalsActions.showModal('RESCHEDULE_SHOOTING_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: rescheduleWarning,
          onConfirm: () => {
            this.onShootingRescheduleConfirm(rescheduleData);
          },
        },
      })
    );
  }

  /*
   * Confirm shooting RESCHEDULE
   */
  async onShootingRescheduleConfirm(rescheduleData) {
    const { dispatch, onCompleteShootingAction } = this.props;
    const shooting = this.props.shootings.selectedShooting;

    const newStartDate = buildOrderStartDate(rescheduleData.date);

    let companyPenaltyItemDTO;
    let companyTravelPenaltyItemDTO;
    let photographerRefundItemDTO;
    let photographerTravelRefundItemDTO;
    const invoiceItems = [];
    if (rescheduleData.companyPenalties && rescheduleData.companyPenalties !== 0) {
      companyPenaltyItemDTO = {
        amount: rescheduleData.companyPenalties.companyPenalty,
        companyId: rescheduleData.company && rescheduleData.company.id,
        currencyId:
          rescheduleData && rescheduleData.pricingPackage && rescheduleData.pricingPackage.currency
            ? rescheduleData.pricingPackage.currency.id
            : 1,
        itemDate: moment().valueOf(),
        income: false,
        shootingId: rescheduleData.id,
        type: INVOICE_ITEMS_TYPES.COMPANY_PENALTY,
        description: `${translations.t('invoice.invoicePenaltyTitle')} ${rescheduleData.code}`,
        percentage: rescheduleData.companyPenalties.companyPenaltyPercentage,
        cancellationNotes: rescheduleData.cancellationNotes,
        authorizedBy: rescheduleData.authorization && rescheduleData.authorization.label,
      };

      invoiceItems.push(companyPenaltyItemDTO);

      companyTravelPenaltyItemDTO = {
        amount: rescheduleData.companyPenalties.companyTravelPenalty,
        companyId: rescheduleData.company && rescheduleData.company.id,
        currencyId:
          rescheduleData && rescheduleData.pricingPackage && rescheduleData.pricingPackage.currency
            ? rescheduleData.pricingPackage.currency.id
            : 1,
        itemDate: moment().valueOf(),
        income: false,
        shootingId: rescheduleData.id,
        type: INVOICE_ITEMS_TYPES.SHOOTING_TRAVEL_EXPENSES,
        description: `${translations.t('invoice.invoiceTravelPenaltyTitle')} ${rescheduleData.code}`,
        percentage: rescheduleData.companyPenalties.companyTravelPenaltyPercentage,
        cancellationNotes: rescheduleData.cancellationNotes,
        authorizedBy: rescheduleData.authorization && rescheduleData.authorization.label,
      };

      invoiceItems.push(companyTravelPenaltyItemDTO);
    }

    if (rescheduleData.photographerRefunds && rescheduleData.photographerRefunds !== 0) {
      photographerRefundItemDTO = {
        amount: rescheduleData.photographerRefunds.photographerRefund,
        photographerId: rescheduleData.photographer && rescheduleData.photographer.id,
        currencyId:
          rescheduleData && rescheduleData.pricingPackage && rescheduleData.pricingPackage.currency
            ? rescheduleData.pricingPackage.currency.id
            : 1,
        itemDate: moment().valueOf(),
        income: true,
        shootingId: rescheduleData.id,
        type: INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUND,
        description: `${translations.t('invoice.invoiceRefundTitle')} ${rescheduleData.code}`,
        percentage: rescheduleData.photographerRefunds.photographerRefundPercentage,
        cancellationNotes: rescheduleData.cancellationNotes,
        authorizedBy: rescheduleData.authorization && rescheduleData.authorization.label,
      };

      invoiceItems.push(photographerRefundItemDTO);

      photographerTravelRefundItemDTO = {
        amount: rescheduleData.photographerRefunds.photographerTravelRefund,
        photographerId: rescheduleData.photographer && rescheduleData.photographer.id,
        currencyId:
          rescheduleData && rescheduleData.pricingPackage && rescheduleData.pricingPackage.currency
            ? rescheduleData.pricingPackage.currency.id
            : 1,
        itemDate: moment().valueOf(),
        income: true,
        shootingId: rescheduleData.id,
        type: INVOICE_ITEMS_TYPES.PHOTOGRAPHER_TRAVEL_EXPENSES,
        description: `${translations.t('invoice.invoiceTravelRefundTitle')} ${rescheduleData.code}`,
        percentage: rescheduleData.photographerRefunds.photographerTravelRefundPercentage,
        cancellationNotes: rescheduleData.cancellationNotes,
        authorizedBy: rescheduleData.authorization && rescheduleData.authorization.label,
      };

      invoiceItems.push(photographerTravelRefundItemDTO);
    }

    const formattedrescheduleData = {
      startDate: moment.tz(moment.utc(newStartDate), rescheduleData.timezoneSelected).valueOf(),
      place: rescheduleData.placeSelected.value,
      invoiceItems,
    };

    try {
      dispatch(ModalsActions.hideModal('RESCHEDULE_SHOOTING_DIALOG'));
      dispatch(UtilsActions.setSpinnerVisibile(true));

      const newShooting = await dispatch(ShootingActions.rescheduleShooting(shooting.id, formattedrescheduleData));
      dispatch(ShootingActions.setSelectedShooting(newShooting));

      dispatch(ModalsActions.hideModal('SHOOTING_RESCHEDULE_VIEW'));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));

      if (onCompleteShootingAction) {
        await onCompleteShootingAction(newShooting);
      }

      dispatch(UtilsActions.setSpinnerVisibile(false));

      dispatch(
        ModalsActions.showModal('RESCHEDULE_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingRescheduleSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      const nowTime = moment.tz(moment.utc(), rescheduleData.timezoneSelected).add(24, 'hours').format('LLL');
      if (error && error.response && error.response.data && error.response.data.code === 17003) {
        // 24h rescheduling error
        dispatch(
          ModalsActions.showModal('RESHOOT_ERROR_MODAL', {
            modalType: 'MODAL_DIALOG',
            modalProps: {
              title: translations.t('forms.warning'),
              bodyText: (
                <div>
                  <p>{translations.t('forms.reserve24HoursErrorWithTime', { time: nowTime })}</p>
                  <p />
                  <p>{translations.t('forms.reserve24HoursErrorWithTimeContacts')}</p>
                </div>
              ),
              cancelText: 'Ok',
            },
          })
        );
      } else {
        dispatch(
          ModalsActions.showModal('RESHOOT_ERROR_MODAL', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: translations.t('shootings.shootingRescheduleError'),
            },
          })
        );
      }
    }
  }

  /*
   * Send the photographer reminder
   */
  async onSendReminderToPhotographer() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(ShootingActions.sendShootingReminder(selectedShooting.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      //dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(
        ModalsActions.showModal('REMIND_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingReminderSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('REMIND_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingReminderError'),
          },
        })
      );
    }
  }

  /*
   * Edit the initial shooting refund
   */
  async onEditRefund(amount) {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const newShooting = await dispatch(ShootingActions.setShootingInitialRefund(selectedShooting.id, amount));
      dispatch(ShootingActions.setSelectedShooting(newShooting));
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  /*
   * Delete the initial shooting refund by setting it to 0
   */
  async onDeleteRefund() {
    await this.onEditRefund(0);
  }

  /*
   * Present the modify shooting title form
   */
  async onModifyTitleRequest() {
    const {
      dispatch,
      shootings: { selectedShooting },
    } = this.props;
    dispatch(initialize('ShootingTitleForm', { title: selectedShooting.title }));
    dispatch(
      ModalsActions.showModal('SHOOTING_NAME_VIEW', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <div style={{ padding: 20 }}>
              <ShootingTitleForm
                onSubmit={(data) => {
                  this.onModifyTitle(data);
                }}
              />
            </div>
          ),
        },
      })
    );
  }

  /*
   * Modify shooting title
   */
  async onModifyTitle(titleData) {
    const {
      dispatch,
      shootings: { selectedShooting },
      onCompleteShootingAction,
      updateOrders,
    } = this.props;
    try {
      //
      dispatch(UtilsActions.setSpinnerVisibile(true));
      const updatedShooting = await dispatch(ShootingActions.updateShootingAdditionalInfo(selectedShooting.id, titleData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(ShootingActions.setSelectedShooting(updatedShooting));
      if (onCompleteShootingAction) {
        onCompleteShootingAction(updatedShooting);
      }
      updateOrders();
      dispatch(ModalsActions.hideModal('SHOOTING_NAME_VIEW'));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingModifySuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CONFIRM_PHOTOGRAPHER_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.shootingModifyError'),
          },
        })
      );
    }
  }

  onDownloadReleaseForm(name) {
    const {
      shootings: {
        selectedShooting: { releaseFormDownloadLink, code },
      },
    } = this.props;

    download(releaseFormDownloadLink, `${code}_release_form.zip`);
  }

  render() {
    const {
      shootings: { selectedShooting },
      user: {
        data: { isBoom, isPhotographer, roles },
      },
      scrollToTop,
      onClose,
      updateOrders,
      onChangeAssignee,
    } = this.props;

    const shootingStatus = mapOrderStatus(isBoom, isPhotographer, selectedShooting.state);
    const uiElements = SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus];
    const statusColor = _.get(uiElements, 'color', '#66c0b0');
    const backgroundImage = _.get(uiElements, 'backgroundImage', '');
    const backgroundSize = _.get(uiElements, 'backgroundSize', '');
    const backgroundStyle = backgroundImage ? { backgroundImage, backgroundSize } : { backgroundColor: statusColor };

    const isCcUser = roles.some((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER);
    const isSMB = roles.some((role) => role.name === USER_ROLES.ROLE_SMB);

    const isUnscheduledView = shootingStatus === SHOOTINGS_STATUSES.UNSCHEDULED;

    return (
      <div style={{ marginLeft: 20, marginRight: 20 }}>
        <div style={{ marginBottom: isUnscheduledView ? 7 : 20 }}>
          <ShootingInfoDetails
            shooting={selectedShooting}
            backgroundStyle={backgroundStyle}
            isPhotographer={isPhotographer}
            isBoom={isBoom}
            isCcUser={isCcUser}
            isSMB={isSMB}
            statusColor={statusColor}
            onModifyTitleRequest={() => this.onModifyTitleRequest()}
            onShowShootingInfoForm={() => this.onShowShootingInfoForm()}
            onShowSalesInfo={() => this.onShowSalesInfo()}
            onCancelShooting={() => this.onCancelShooting()}
            onShowShootingRescheduleForm={() => this.onShowShootingRescheduleForm()}
            onChangeAssignee={onChangeAssignee}
            updateOrders={updateOrders}
          />
        </div>
        <ShootingStatusView
          shooting={selectedShooting}
          isPhotographer={isPhotographer}
          isBoom={isBoom}
          statusColor={statusColor}
          onAcceptShooting={this.onAcceptShooting}
          onRefuseShooting={(selectedReason, textReason) => this.onRefuseShooting(selectedReason, textReason)}
          onUploadShootingPhotos={(file, comments) => this.onUploadShootingPhotos(file, comments)}
          onCompleteUpload={(comments, reasonCode, reasonText) => this.onCompleteUpload(comments, reasonCode, reasonText)}
          onMarkShootingCompleted={(completedData) => this.onMarkShootingCompleted(completedData)}
          onAcceptShootingPhotos={() => this.onAcceptShootingPhotos()}
          onDownloadShooting={() => this.onDownloadShooting()}
          onDownloadShootingPhotosToReview={() => this.onDownloadShootingPhotosToReview()}
          onRefuseShootingPhotos={() => this.onRefuseShootingPhotos()}
          onReshootShooting={() => this.onReshootShooting()}
          onUploadPostProducedPhotos={(file) => this.onUploadPostProducedPhotos(file)}
          onAssignPhotographer={(photographerData) => this.onAssignPhotographer(photographerData)}
          onSendReminderToPhotographer={() => this.onSendReminderToPhotographer()}
          onUnassignPhotographer={() => this.onUnassignPhotographer()}
          onCancelShooting={() => this.onCancelShooting()}
          onEditRefund={(amount) => this.onEditRefund(amount)}
          onDeleteRefund={() => this.onDeleteRefund()}
          onSelectManualPhotographer={(photographersToExclude) => this.onSelectManualPhotographer(photographersToExclude)}
          onScrollToTop={scrollToTop}
          onClose={onClose}
          onUpdateOrders={updateOrders}
          onDownloadReleaseForm={() => this.onDownloadReleaseForm()}
        />
        {!isPhotographer && <ShootingEventLogView shooting={selectedShooting} isBoom={isBoom} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  utils: state.utils,
  user: state.user,
  shootings: state.shootings,
  forms: state.form,
});

export default _.flow([withRouter, connect(mapStateToProps)])(ShootingActionsView);
