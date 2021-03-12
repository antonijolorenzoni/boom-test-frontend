import React from 'react';
import { withStyles, Button, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import _ from 'lodash';

import translations from '../../../translations/i18next';
import PhotographerAutoAssigmentItem from '../PhotographerAutoAssignmentItem';
import AssignmentTimer from '../AssignmentTimer';
import MDButton from '../../MDButton/MDButton';
import ShootingRewardSection from '../ShootingRewardSection';
import { SHOOTING_STATUSES_UI_ELEMENTS, SHOOTINGS_STATUSES, AUTO_ASSIGNMENT_STATUSES } from '../../../config/consts';

import * as ModalsActions from '../../../redux/actions/modals.actions';
import * as ShootingActions from '../../../redux/actions/shootings.actions';
import * as ShootingsAPI from '../../../api/shootingsAPI';
import * as PhotographersAPI from '../../../api/photographersAPI';

import RefreshIcon from '@material-ui/icons/Refresh';
import { PhotographerRefusePanel } from 'components/CancellationReasons/PhotographerRefusePanel';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const styles = {
  photographerList: {
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      marginBottom: 15,
    },
  },
  deadlineText: {
    color: 'white',
    padding: 20,
    fontSize: '1em',
    fontWeight: 'bold',
  },
  deadlineBox: {
    border: '2px solid white',
    borderRadius: 4,
    margin: '15px 20px 15px 0px',
    padding: '8px 15px',
    width: 65,
  },
  deadlineTime: {
    color: 'white',
    margin: 0,
  },
  revokeButton: {
    minHeight: 0,
    height: 22,
    padding: 0,
    '&:hover, &:focus': {
      backgroundColor: 'transparent',
    },
  },
  revokeSpan: {
    fontSize: '0.7em',
    marginLeft: 6,
    marginTop: 2,
    fontWeight: 'bolder',
    color: '#80888d',
  },
  confirmBtn: {
    boxShadow: 'none',
    color: '#FFFFFF',
    backgroundColor: '#5AC0B1',
    fontSize: 14,
    fontWeight: 500,
    width: 140,
    '&:disabled': {
      backgroundColor: '#5AC0B1',
      color: '#FFFFFF',
      opacity: 0.5,
    },
  },
  cancelBtn: {
    borderColor: '#5AC0B1',
    color: '#5AC0B1',
    fontSize: 14,
    fontWeight: 500,
    width: 140,
    marginRight: 24,
    border: '2px solid',
    '&:disabled': {
      borderColor: '#5AC0B1',
      color: '#5AC0B1',
      opacity: 0.5,
    },
  },
  receivedInvitation: {
    color: '#80888D',
    fontSize: 17,
    '@media(max-width: 768px)': {
      fontSize: 19,
    },
  },
};

const getStatus = (isRefused, isInvited, isManual, expirationDatetime, atLeastOneManual) => {
  if (!_.isNull(expirationDatetime) && !isRefused && !isManual) {
    if (Date.now() > expirationDatetime) {
      return AUTO_ASSIGNMENT_STATUSES.ELAPSED;
    }
  }

  if (isRefused) {
    return AUTO_ASSIGNMENT_STATUSES.REFUSED;
  }

  if (isManual) {
    return AUTO_ASSIGNMENT_STATUSES.INSERTED;
  }

  if (isInvited) {
    return AUTO_ASSIGNMENT_STATUSES.INVITED;
  }

  if (atLeastOneManual && !isInvited) {
    return AUTO_ASSIGNMENT_STATUSES.FREEZED;
  }

  return AUTO_ASSIGNMENT_STATUSES.DEFAULT;
};

const timerMaxValue = 7200000;

const getTimer = (expirationDatetime, endDate, isRefused) => {
  const timer = expirationDatetime - Date.now();
  if (_.isNull(expirationDatetime)) {
    return timerMaxValue;
  }

  return isRefused ? expirationDatetime - endDate : timer > 0 ? timer : 0;
};

class ShootingAutoAssignmentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photographersInvited: [],
      bestPhotographersCounter: 0,
      othersPhotographersCounter: 0,
      // photographer related state
      photographerTimer: null,
      estimatedTravelExpenses: 0,
      photographerLoading: null,
      inviteSentDate: null,
    };
  }

  async componentDidMount() {
    const { isBoom, isPhotographer, shooting } = this.props;
    if (isBoom) {
      this.getPhotographersCounter();
      this.onFetchAutoAssignmentPhotographers();
    }
    if (isPhotographer) {
      this.onFetchPhotographerShootingInfo(shooting.id);
    }
  }

  onFetchPhotographerShootingInfo = () => {
    this.setState({ photographerLoading: true }, async () => {
      const { shooting } = this.props;
      const response = await PhotographersAPI.fetchShootingInfo(shooting.id);
      const data = _.get(response, 'data');
      const { expirationDatetime, estimatedTravelExpenses, startDate } = data;

      const timerEndTime = shooting.state === SHOOTINGS_STATUSES.ASSIGNED ? shooting.startDate : expirationDatetime;
      const photographerTimer = timerEndTime - Date.now();

      this.setState({
        photographerTimer: photographerTimer >= 0 ? photographerTimer : 0,
        estimatedTravelExpenses,
        photographerLoading: false,
        inviteSentDate: startDate,
      });
    });
  };

  onFetchAutoAssignmentPhotographers = async () => {
    const { dispatch, organizationId, shooting } = this.props;
    const response = await ShootingsAPI.fetchAutoAssignmentPhotographers(organizationId, shooting.id);

    if (response.data) {
      const atLeastOneManual = _.get(response.data, 'invites').find((item) => item.manual);
      const toAutoAssignmentItem = (responseItem) => {
        const {
          order,
          photographerMatchedId,
          manual: isManual,
          refused: isRefused,
          invited: isInvited,
          startDate,
          endDate,
          expirationDatetime,
        } = responseItem;

        const { id: photographerId } = responseItem.photographer;
        const { firstName, lastName } = responseItem.photographer.user;

        return {
          order,
          photographerMatchedId,
          status: getStatus(isRefused, isInvited, isManual, expirationDatetime, atLeastOneManual),
          startDate,
          endDate,
          expirationDatetime,
          photographerId,
          firstName,
          lastName,
          timer: getTimer(expirationDatetime, endDate, isRefused),
        };
      };

      this.setState({
        photographersInvited: _.sortBy(_.get(response.data, 'invites').map(toAutoAssignmentItem), 'order'),
        isInviteManuallyDisabled: atLeastOneManual,
      });
      const updatedShooting = await dispatch(ShootingActions.fetchShootingDetails(shooting.id));
      dispatch(ShootingActions.setSelectedShooting({ ...shooting, state: updatedShooting.state }));
    }
  };

  getPhotographersCounter = async () => {
    const { shooting, organizationId } = this.props;
    const response = await ShootingsAPI.fetchShootingMatchedPhotographers(organizationId, shooting.id);

    if (response.data) {
      this.setState({
        bestPhotographersCounter: response.data.filter((responseItem) => responseItem.isBest === Boolean(true)).length,
        othersPhotographersCounter: response.data.filter((responseItem) => responseItem.isBest === Boolean(false)).length,
      });
    }
  };

  onStop = () => {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('STOP_AUTO_ASSIGNMENT', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('shootings.stopAutoAssignmentDialogTitle'),
          bodyText: translations.t('shootings.stopAutoAssignmentDialogBody'),
          onConfirm: () => this.onStopConfirm(),
          confirmText: translations.t('modals.confirm'),
        },
      })
    );
  };

  onStopConfirm = async () => {
    const { dispatch, organizationId, shooting } = this.props;
    try {
      await ShootingsAPI.stopAutoAssignment(organizationId, shooting.id);
      dispatch(ModalsActions.hideModal('STOP_AUTO_ASSIGNMENT'));
      dispatch(
        ModalsActions.showModal('PAUSE_AUTO_ASSIGNMENT', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.onPauseAutoAssignment'),
          },
        })
      );
      dispatch(ModalsActions.hideModal('SHOOTING_OPERATIONAL_VIEW'));
    } catch (error) {
      dispatch(ModalsActions.hideModal('STOP_AUTO_ASSIGNMENT'));
      dispatch(
        ModalsActions.showModal('STOP_AUTO_ASSIGNMENT_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.onStopAutoAssignmentError'),
          },
        })
      );
    }
  };

  render() {
    const {
      classes,
      onSelectManualPhotographer,
      onSendReminderToPhotographer,
      shooting,
      onAcceptShooting,
      onRefuseShooting,
      isPhotographer,
      isBoom,
      onUnassignPhotographer,
      dispatch,
    } = this.props;

    const {
      photographersInvited,
      photographerTimer,
      estimatedTravelExpenses,
      photographerLoading,
      bestPhotographersCounter,
      othersPhotographersCounter,
      inviteSentDate,
    } = this.state;

    const shootingState = shooting.state;
    const isPhotographerTimerElapsed = photographerTimer <= 0;

    const shouldRenderPhotographerSection = isPhotographer && photographerLoading === false;
    const manuallyInvited = photographersInvited.find((item) => item.status === AUTO_ASSIGNMENT_STATUSES.INSERTED);
    const isInviteManuallyDisabled = manuallyInvited && manuallyInvited.status !== AUTO_ASSIGNMENT_STATUSES.REFUSED;

    const isNotYetRefusedOrExpiredFn = (photographersInvited) => (phId) => {
      const invitation = photographersInvited.find((p) => p.photographerId === phId);
      const isExpired = invitation && invitation.expirationDatetime < new Date().getTime() * 1000;
      return !isExpired || !invitation.status === AUTO_ASSIGNMENT_STATUSES.REFUSED;
    };

    const photographersToExclude = photographersInvited
      .map((photographer) => photographer.photographerId)
      .filter(isNotYetRefusedOrExpiredFn(photographersInvited));

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
      <div style={{ boxSizing: 'border-box' }}>
        {shouldRenderPhotographerSection && (
          <div>
            <Grid container direction="column" alignItems="center" style={{ margin: '20px 0', boxSizing: 'border-box' }}>
              {shooting.pricingPackage && (
                <div style={{ margin: '20px 0', width: '100%' }}>
                  <ShootingRewardSection
                    shooting={shooting}
                    pricingPackage={shooting.pricingPackage}
                    refund={shooting.refund + estimatedTravelExpenses}
                    photographerItems={shooting.photographerItems}
                  />
                </div>
              )}
              <Grid
                item
                xs={12}
                md={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 33,
                  marginBottom: 55,
                  width: 320,
                  alignItems: 'center',
                }}
              >
                {shootingState === SHOOTINGS_STATUSES.ASSIGNED && photographerTimer > 0 && (
                  <div className={classes.receivedInvitation}>
                    <span>{translations.t('shootings.receivedInvitation')}</span>
                  </div>
                )}
                <div style={{ color: '#80888D', fontSize: 12, fontWeight: 500, marginBottom: 10 }}>
                  {photographerTimer > 0 ? (
                    <span>{translations.t('shootings.deadline')}</span>
                  ) : (
                    <span style={{ fontSize: 17, textTransform: 'uppercase' }}>{translations.t('shootings.inviteExpired')}</span>
                  )}
                </div>
                <AssignmentTimer
                  timerSize="big"
                  timer={photographerTimer}
                  maxValue={shootingState === SHOOTINGS_STATUSES.ASSIGNED ? shooting.startDate - inviteSentDate : timerMaxValue}
                  shootingState={shootingState}
                  onTimerEnd={() => this.setState({ photographerTimer: 0 })}
                  photographer
                />
              </Grid>
              <Grid item xs={12} md={12} style={{ display: 'flex', alignItems: 'center' }}>
                <Button className={classes.cancelBtn} variant="outlined" onClick={onDiscardInvite} disabled={isPhotographerTimerElapsed}>
                  {translations.t('shootings.discard').toUpperCase()}
                </Button>
                <Button
                  className={classes.confirmBtn}
                  variant="contained"
                  onClick={() => onAcceptShooting()}
                  disabled={isPhotographerTimerElapsed}
                >
                  {translations.t('shootings.accept').toUpperCase()}
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
        {isBoom && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 25 }}>
              <div style={{ fontWeight: 500, fontSize: 17 }}>{translations.t('shootings.invitesQueue')}</div>
              <div style={{ display: 'flex', fontWeight: 500, fontSize: 12, color: '#A3ABB1' }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span>{translations.t('shootings.invitesQueueSubtitleAutoAssignment')}</span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      cursor: 'pointer',
                    }}
                    onClick={this.onFetchAutoAssignmentPhotographers}
                  >
                    <RefreshIcon />
                    <span>REFRESH</span>
                  </div>
                  <ShowForPermissions permissions={[Permission.ShootingAssign]}>
                    <MDButton
                      disabled={isInviteManuallyDisabled}
                      onClick={() => onSelectManualPhotographer(photographersToExclude)}
                      title={translations.t('shootings.inviteManually')}
                      containerstyle={{ marginTop: 0, marginLeft: 'auto' }}
                      buttonStyle={{
                        backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingState].color,
                        minHeight: 0,
                        padding: '2px 5px 2px',
                        width: 'auto',
                        boxShadow: 'none',
                      }}
                      titleStyle={{
                        margin: '3px 13px',
                        fontSize: 12,
                        color: '#ffffff',
                        textDecoration: 'upper',
                      }}
                    />
                  </ShowForPermissions>
                </div>
              </div>
            </div>
            <div className={classes.photographerList}>
              {photographersInvited.map(({ id, photographerId, firstName, lastName, status, timer }, i) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: 43 }}>
                    <PhotographerAutoAssigmentItem
                      shootingStatus={shootingState}
                      id={photographerId}
                      name={firstName + ' ' + lastName}
                      status={status}
                      position={i + 1}
                    />
                  </div>
                  {status !== AUTO_ASSIGNMENT_STATUSES.INSERTED && (
                    <div style={{ width: 195 }}>
                      <AssignmentTimer timer={timer} maxValue={timerMaxValue} status={status} shootingState={shootingState} />
                    </div>
                  )}
                  <div style={{ display: 'flex' }}>
                    {status === AUTO_ASSIGNMENT_STATUSES.INVITED && (
                      <MDButton
                        onClick={this.onStop}
                        title={translations.t('shootings.stopAutoAssignment')}
                        containerstyle={{ marginTop: 0, marginLeft: '65px' }}
                        buttonStyle={{
                          backgroundColor: '#cc0033',
                          minHeight: 0,
                          padding: '2px 5px 2px',
                          width: 'auto',
                          boxShadow: 'none',
                        }}
                        titleStyle={{
                          margin: 0,
                          fontSize: 12,
                          color: '#ffffff',
                          textDecoration: 'upper',
                        }}
                      />
                    )}
                    <ShowForPermissions permissions={[Permission.ShootingUnassign]}>
                      {(status === AUTO_ASSIGNMENT_STATUSES.INVITED || status === AUTO_ASSIGNMENT_STATUSES.INSERTED) &&
                        shootingState === SHOOTINGS_STATUSES.ASSIGNED && (
                          <MDButton
                            onClick={onSendReminderToPhotographer}
                            title={translations.t('shootings.sendReminder')}
                            containerstyle={{ marginTop: 0 }}
                            buttonStyle={{
                              width: 140,
                              backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingState].color,
                              border: '2px solid',
                              borderColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingState].color,
                              minHeight: 0,
                              padding: '2px 5px 2px',
                              boxShadow: 'none',
                            }}
                            titleStyle={{
                              margin: 0,
                              fontSize: 12,
                              color: '#ffffff',
                              textDecoration: 'upper',
                            }}
                          />
                        )}
                      {(status === AUTO_ASSIGNMENT_STATUSES.INVITED || status === AUTO_ASSIGNMENT_STATUSES.INSERTED) &&
                        shootingState === SHOOTINGS_STATUSES.ASSIGNED && (
                          <MDButton
                            onClick={() => onUnassignPhotographer()}
                            title={translations.t('shootings.unassignPhotographer')}
                            containerstyle={{ marginTop: 0, marginLeft: '25px' }}
                            buttonStyle={{
                              width: 120,
                              backgroundColor: '#ffffff',
                              border: '2px solid',
                              borderColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingState].color,
                              minHeight: 0,
                              padding: '2px 5px 2px',
                              boxShadow: 'none',
                            }}
                            titleStyle={{
                              margin: 0,
                              fontSize: 12,
                              color: SHOOTING_STATUSES_UI_ELEMENTS[shootingState].color,
                              textDecoration: 'upper',
                            }}
                          />
                        )}
                    </ShowForPermissions>
                  </div>
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#A3ABB1' }}>
              {bestPhotographersCounter > 0
                ? translations.t('shootings.autoAssignmentQueueLengthBest', {
                    queueLength: bestPhotographersCounter,
                  })
                : translations.t('shootings.autoAssignmentQueueLengthOthers', {
                    queueLength: othersPhotographersCounter,
                  })}
            </span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    organizationId: state.shootings.selectedShooting.company.organization,
    shooting: state.shootings.selectedShooting,
  };
};

export default _.flow([withStyles(styles), connect(mapStateToProps)])(ShootingAutoAssignmentView);
