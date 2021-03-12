//
// ──────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P O N E N T   F O R   M O T H   V I E W   A G E N D A : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import * as ShootingActions from '../../redux/actions/shootings.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ModalActions from '../../redux/actions/modals.actions';
import ShootingActionsView from '../Shooting/ShootingActionsView';

import { SHOOTING_STATUSES_UI_ELEMENTS } from '../../config/consts';
import { isMobileBrowser, mapOrderStatus } from '../../config/utils';

const styles = (theme) => ({
  outerContainer: {
    height: '100%',
    display: isMobileBrowser() ? 'block' : 'flex',
  },
  eventContainer: {
    paddingTop: 3,
    paddingLeft: 8,
  },
  typography: {
    useNextVariants: true,
  },
  icon: {
    marginTop: 3,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: isMobileBrowser() ? 'column' : 'row',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: isMobileBrowser() ? 10 : 15,
    color: '#3f3f3f',
  },
  dateText: {
    margin: 0,
    marginLeft: 10,
    color: '#3f3f3f',
    fontSize: isMobileBrowser() ? 9 : 12,
  },
  body: {
    margin: 0,
    marginTop: 10,
    color: '#979da1',
    textAlign: 'left',
    fontSize: 12,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5AC0B1',
  },
});

class AgendaEvent extends React.Component {
  async openDetails(event) {
    const {
      dispatch,
      user: {
        data: { isPhotographer },
      },
    } = this.props;

    let shooting = event;

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));

      if (isPhotographer) {
        shooting = await dispatch(ShootingActions.fetchShootingDetailsAndPenalties(event));
      } else {
        shooting = await dispatch(ShootingActions.fetchShootingDetailsAndItems(event));
      }
      dispatch(ShootingActions.setSelectedShooting(shooting));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(ShootingActions.setSelectedShooting(event));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } finally {
      dispatch(
        ModalActions.showModal('SHOOTING_OPERATIONAL_VIEW', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            hideCancel: true,
            content: <ShootingActionsView />,
            closeIconColor: '#ffffff',
          },
        })
      );
    }
  }

  render() {
    const {
      user: {
        data: { isBoom, isPhotographer },
      },
      classes,
      horizontal,
      containerStyle,
      outerContainerStyle,
      event,
    } = this.props;

    const isUnavailability = event && event.periodicity;
    let statusColor = event && event.state ? SHOOTING_STATUSES_UI_ELEMENTS[event.state].color : '#66c0b0';
    if (!isBoom && !isUnavailability) {
      statusColor = SHOOTING_STATUSES_UI_ELEMENTS[mapOrderStatus(isBoom, isPhotographer, event.state)].color;
    }

    return (
      <div
        style={{ opacity: event && event.disabled ? 0.5 : 1, ...outerContainerStyle, maxHeight: horizontal ? '10%' : '100%' }}
        className={classes.outerContainer}
        onClick={isUnavailability ? null : () => this.openDetails(event)}
      >
        {event && (
          <div className={classes.eventContainer} style={{ ...containerStyle }}>
            <div className={classes.titleContainer}>
              <div className={classes.circle} style={{ backgroundColor: isUnavailability ? 'red' : statusColor }} />
              <h5 className={classes.dateText}>
                {`${moment(event.start).format('HH:mm')} - ${isMobileBrowser() ? '' : moment(event.end).format('HH:mm')}`}
              </h5>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  shootings: state.shootings,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(AgendaEvent));
