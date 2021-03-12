//
// ────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   A G E N D A   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────
//

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { SHOOTINGS_DEFAULT_PAGE_SIZE, SHOOTINGS_STATUSES, SHOOTING_STATUSES_UI_ELEMENTS } from '../../config/consts';
import { mapOrderStatus } from '../../config/utils';
import * as ShootingActions from '../../redux/actions/shootings.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ModalsActions from '../../redux/actions/modals.actions';
import MDPopper from '../Modals/MDPopper/MDPopper';
import ShootingActionsView from '../Shooting/ShootingActionsView';
import ShootingTooltip from './ShootingTooltip';

const styles = () => ({
  outerContainer: {
    height: '100%',
    display: 'flex',
    border: '1px solid #5AC0B1',
    borderTop: '4px solid #5AC0B1',
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
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async onRefreshShootings() {
    const { dispatch } = this.props;
    await dispatch(ShootingActions.fetchShootings(0, SHOOTINGS_DEFAULT_PAGE_SIZE));
  }

  togglePopper() {
    const {
      event,
      dispatch,
      shootings: { calendarTootilps },
    } = this.props;
    const isPopperVisible = _.findIndex(calendarTootilps, (value) => value === event.id) !== -1;
    if (!isPopperVisible) dispatch(ShootingActions.showShootingTooltip(event.id));
    if (isPopperVisible) dispatch(ShootingActions.hideShootingTooltip(event.id));
  }

  handleClickOutside(event) {
    if (this.componentRef && !this.componentRef.contains(event.target)) {
      this.togglePopper();
    }
  }

  onGoToUploadedShooting(shooting) {
    const { history } = this.props;
    history.push(`/shootingsActivities?shootingId=${shooting.id}`);
  }

  async openDetails() {
    const {
      dispatch,
      event,
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    dispatch(UtilsActions.setSpinnerVisibile(true));
    let shooting = event;

    try {
      dispatch(ShootingActions.hideShootingTooltip(event.id));
      dispatch(UtilsActions.setSpinnerVisibile(true));
      if (isPhotographer) {
        shooting = await dispatch(ShootingActions.fetchShootingDetailsAndPenalties(event));
      } else {
        shooting = await dispatch(ShootingActions.fetchShootingDetailsAndItems(event));
      }
      dispatch(ShootingActions.setSelectedShooting(shooting));
      dispatch(ShootingActions.updateCalendarShooting(shooting));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(ShootingActions.setSelectedShooting(event));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } finally {
      dispatch(
        ModalsActions.showModal('SHOOTING_OPERATIONAL_VIEW', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            fullScreen: true,
            hideCancel: true,
            closeIconColor: '#ffffff',
            content: (
              <ShootingActionsView
                onCompleteShootingAction={() => this.onRefreshShootings()}
                onGoToUploadedShooting={(shootingSelected) => this.onGoToUploadedShooting(shootingSelected)}
              />
            ),
          },
        })
      );
    }
  }

  render() {
    const {
      classes,
      disabled,
      horizontal,
      containerStyle,
      outerContainerStyle,
      event,
      listItem,
      shootings: { calendarTootilps },
      user: {
        data: { isBoom, isPhotographer },
      },
    } = this.props;

    const isPopperVisible = _.findIndex(calendarTootilps, (value) => value === event.id) !== -1;
    const isDisabled = disabled || event.state === SHOOTINGS_STATUSES.CANCELED || event.state === SHOOTINGS_STATUSES.RESHOOT;

    let statusColor = event && event.state ? SHOOTING_STATUSES_UI_ELEMENTS[event.state].color : '#66c0b0';
    if (!isBoom) {
      statusColor =
        event && event.state ? SHOOTING_STATUSES_UI_ELEMENTS[mapOrderStatus(isBoom, isPhotographer, event.state)].color : '#66c0b0';
    }

    return (
      <React.Fragment>
        <Paper
          style={{
            opacity: isDisabled ? 0.5 : 1,
            ...outerContainerStyle,
            maxHeight: horizontal ? '10%' : '100%',
            borderTop: event.unavailable ? '4px solid black' : `4px solid ${statusColor}`,
            background: event.unavailable ? '#b1b9c1' : '#f5f6f7',
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
                <h5 className={classes.dateText} style={{ color: event.unavailable ? 'white' : '#3f3f3f' }}>
                  {event.title}
                </h5>
              </div>
              {horizontal && (
                <div>
                  {event.company && event.company.name && (
                    <h3 className={classes.title} style={{ marginBottom: 5 }}>
                      {event.company.name}
                    </h3>
                  )}
                  <h3 className={classes.title}>{`Shooting ${event.title}`}</h3>
                  {!horizontal && event.address && <h4 className={classes.body}>{event.address}</h4>}
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
            <MDPopper
              anchorEl={this.componentContainerRef}
              isClosed={!isPopperVisible}
              content={
                <ShootingTooltip event={event} isBoom={isBoom} isPhotographer={isPhotographer} onOpenDetails={() => this.openDetails()} />
              }
              placement="right"
              // hideCloseButton
              onClose={() => this.togglePopper()}
            />
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(ShootingsEventRow)));
