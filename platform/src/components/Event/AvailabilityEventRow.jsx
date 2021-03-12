//
// ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A V A I L A B I L I T Y   A G E N D A   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ClockWhiteIcon from '../../assets/icons/clock-white.svg';
import * as ShootingActions from '../../redux/actions/shootings.actions';
import MDPopper from '../Modals/MDPopper/MDPopper';
import ShootingTooltip from './ShootingTooltip';
import ShootingActionsView from '../Shooting/ShootingActionsView';

import { SHOOTINGS_STATUSES } from '../../config/consts';
import translations from '../../translations/i18next';
import * as AvailabilityActions from '../../redux/actions/availability.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ModalsActions from '../../redux/actions/modals.actions';

const styles = () => ({
  outerContainer: {
    height: '100%',
    display: 'flex',
    border: '1px solid black',
  },
  eventContainer: {
    padding: 10,
  },
  typography: {
    useNextVariants: true,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 12,
    color: '#3f3f3f',
  },
  dateText: {
    margin: 0,
    marginLeft: 2,
    marginBottom: 5,
  },
  body: {
    margin: 0,
    marginTop: 10,
    color: '#979da1',
    textAlign: 'left',
    fontSize: 12,
  },
});

class ShootingsEventRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopperVisible: false,
      isLoading: false,
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async onOpenDetails() {
    const { dispatch, event } = this.props;
    dispatch(ShootingActions.setSelectedShooting(event));
    this.togglePopper();
    setTimeout(() => {
      dispatch(
        ModalsActions.showModal('SHOOTING_OPERATIONAL_VIEW', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            fullScreen: true,
            hideCancel: true,
            content: <ShootingActionsView />,
            closeIconColor: '#ffffff',
          },
        })
      );
    }, 500);
  }

  async onDeleteUnavailability() {
    const {
      dispatch,
      event: { id },
    } = this.props;
    this.setState({ isPopperVisible: false });
    dispatch(UtilsActions.setSpinnerVisibile(true));
    try {
      await dispatch(AvailabilityActions.deleteUserUnavailability(id));
    } catch (e) {
      throw new Error(e);
    } finally {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onChangePeriodicity(isPeriodic) {
    const {
      dispatch,
      event: { id, startDate, endDate },
    } = this.props;
    this.setState({ isLoading: true });
    const periodicity = {
      startDate,
      endDate,
      periodicity: isPeriodic ? 'WEEKLY' : 'NONE',
    };
    try {
      await dispatch(AvailabilityActions.changeUserUnavailabilityPeriodicity(periodicity, id));
    } catch (e) {
      throw new Error(e);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  togglePopper() {
    const { isPopperVisible } = this.state;
    this.setState({ isPopperVisible: !isPopperVisible });
  }

  handleClickOutside(event) {
    if (this.componentRef && !this.componentRef.contains(event.target)) {
      this.togglePopper();
    }
  }

  render() {
    const { classes, disabled, horizontal, containerStyle, outerContainerStyle, event, listItem } = this.props;
    const { isLoading } = this.state;

    const { isPopperVisible } = this.state;
    const isDisabled = disabled || event.state === SHOOTINGS_STATUSES.CANCELED || event.state === SHOOTINGS_STATUSES.RESHOOT;
    return (
      <React.Fragment>
        <Paper
          style={{
            opacity: isDisabled ? 0.5 : 1,
            ...outerContainerStyle,
            maxHeight: horizontal ? '10%' : '100%',
            borderTop: '4px solid black',
            background: '#b1b9c1',
          }}
          square
          elevation={1}
          className={classes.outerContainer}
          onClick={() => this.togglePopper()}
        >
          {event && (
            <div
              className={classes.eventContainer}
              style={{ ...containerStyle }}
              ref={(c) => {
                this.componentContainerRef = c;
              }}
            >
              <div className={classes.titleContainer}>
                <img src={ClockWhiteIcon} className={classes.icon} alt="clock" />
                <h5 className={classes.dateText} style={{ color: 'white' }}>
                  {`${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}`}
                </h5>
              </div>
              {!event.unavailable && (
                <div>
                  {event.company && event.company.name && (
                    <h3 className={classes.title} style={{ marginBottom: 5 }}>
                      {event.company.name}
                    </h3>
                  )}
                  <h3 className={classes.title}>{translations.t('calendar.youAreNotAvailable')}</h3>
                </div>
              )}
            </div>
          )}
        </Paper>
        {!listItem && (
          <div
            ref={(c) => {
              this.componentRef = c;
            }}
          >
            {!event.unavailable ? (
              <MDPopper
                anchorEl={this.componentContainerRef}
                isClosed={!isPopperVisible}
                content={
                  <ShootingTooltip
                    event={event}
                    isPhotographer
                    isBoom={false}
                    onOpenDetails={() => this.onOpenDetails()}
                    onDeleteUnavailability={() => this.onDeleteUnavailability()}
                    onChangePeriodicity={(isPeriodic) => this.onChangePeriodicity(isPeriodic)}
                    isLoading={isLoading}
                  />
                }
                placement="right"
                onClose={() => this.togglePopper()}
              />
            ) : (
              <MDPopper
                anchorEl={this.componentContainerRef}
                isClosed={!isPopperVisible}
                content={
                  <ShootingTooltip
                    event={event}
                    isPhotographer
                    isBoom={false}
                    onOpenDetails={() => this.onOpenDetails()}
                    onDeleteUnavailability={() => this.onDeleteUnavailability()}
                    isLoading={isLoading}
                  />
                }
                placement="right"
                // hideCloseButton
                onClose={() => this.togglePopper()}
              />
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

ShootingsEventRow.getDefaultProps = {
  disabled: false,
  horizontal: false,
  containerStyle: null,
  outerContainerStyle: null,
  event: null,
  listItem: false,
};

ShootingsEventRow.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  horizontal: PropTypes.bool,
  containerStyle: PropTypes.shape({}),
  outerContainerStyle: PropTypes.shape({}),
  event: PropTypes.shape({}),
  listItem: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  shootings: state.shootings,
  user: state.user,
});

export default _.flow([connect(mapStateToProps), withStyles(styles)])(ShootingsEventRow);
