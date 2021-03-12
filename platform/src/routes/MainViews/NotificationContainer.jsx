//
// ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: N O T I F I C A T I O N   H E A D E R   C O N T A I N E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import EmptyNotificationsIcon from '@material-ui/icons/AssignmentLate';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BellIcon from '../../assets/header/bell.svg';
import MDButton from '../../components/MDButton/MDButton';
import MDPopper from '../../components/Modals/MDPopper/MDPopper';
import NotificationList from '../../components/Notifications/NotificationList';
import Spinner from '../../components/Spinner/Spinner';
import * as NotificationsActions from '../../redux/actions/notification.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ShootingsActions from '../../redux/actions/shootings.actions';
import translations from '../../translations/i18next';

const styles = {
  bellIcon: {
    width: 20,
    marginRight: 3,
  },
  bellContainer: {
    marginRight: 10,
    position: 'relative',
  },
  newIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5AC0B1',
    marginRight: 10,
    position: 'absolute',
    left: 12,
    top: 12,
  },
  notificationContainer: {
    borderRadius: 5,
    width: 300,
  },
  noUserContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  noUserText: {
    margin: 0,
    color: '#7F888F',
  },
  noUserIcon: {
    fontSize: 30,
    color: '#7F888F',
    marginRight: 20,
  },
};

class NotificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopperVisible: false,
    };
  }

  componentWillMount() {
    this.onFetchNewNotifications();
  }

  async onFetchNewNotifications() {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      dispatch(NotificationsActions.resetNotificationsData());
      dispatch(NotificationsActions.resetNotificationsFilters());
      dispatch(NotificationsActions.saveNotificationsFilter('seen', false));
      await dispatch(NotificationsActions.fetchNotifications());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onTogglePopper() {
    const { isPopperVisible } = this.state;
    const { onClick } = this.props;
    this.setState({ isPopperVisible: !isPopperVisible });
    if (!isPopperVisible) {
      this.onFetchNewNotifications();
    }
    if (onClick) onClick();
  }

  async onOpenNotificationEvent(notification) {
    const {
      dispatch,
      history,
      onClick,
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    try {
      if (onClick) onClick();
      this.setState({ isPopperVisible: false });
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await NotificationsActions.markNotificationAsRead(notification.id);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      if (history.location && history.location.pathname === '/shootingDetails') {
        try {
          let shooting = await dispatch(ShootingsActions.fetchShootingDetails(notification.event.shooting));
          if (isPhotographer) {
            shooting = await dispatch(ShootingsActions.fetchShootingDetailsAndPenalties(shooting));
          } else {
            shooting = await dispatch(ShootingsActions.fetchShootingDetailsAndItems(shooting));
          }
          dispatch(ShootingsActions.setSelectedShooting(shooting));
          if (_.isEmpty(shooting)) history.push('/shootingEmptyView');
          this.setState({ isLoading: false });
        } catch (error) {
          this.setState({ isLoading: false });
          if (
            error &&
            error.response &&
            error.response &&
            error.response.data &&
            error.response.data.code &&
            error.response.data.code === 17001
          ) {
            history.push('/shootingEmptyView');
          } else {
            history.push('/notifications');
          }
        }
      } else {
        history.push(`/shootingDetails?shootingId=${notification.event.shooting}`);
      }
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  appendNotifications(page) {
    const { dispatch } = this.props;
    dispatch(NotificationsActions.fetchAndAppendNotifications(page));
  }

  openNotificationPage() {
    const { history, onClick } = this.props;
    if (onClick) onClick();
    this.setState({ isPopperVisible: false }, () => history.push('/notifications'));
  }

  render() {
    const {
      classes,
      notifications: {
        data: { content: notificationsData },
      },
    } = this.props;
    const { isPopperVisible, isLoading } = this.state;
    const hasNotifications = !_.isEmpty(notificationsData);
    return (
      <div>
        <IconButton className={classes.bellContainer} onClick={() => this.onTogglePopper()}>
          <img
            alt="boom"
            src={BellIcon}
            className={classes.bellIcon}
            ref={(c) => {
              this.imageComponent = c;
            }}
          />
          {hasNotifications && <div className={classes.newIndicator} />}
        </IconButton>
        <MDPopper
          anchorEl={this.imageComponent}
          isClosed={!isPopperVisible}
          onClose={() => this.setState({ isPopperVisible: false })}
          content={
            <div className={classes.notificationContainer}>
              <NotificationList
                notifications={_.slice(notificationsData, 0, 4)}
                onClick={(notification) => this.onOpenNotificationEvent(notification)}
              />
              {(!notificationsData || _.isEmpty(notificationsData)) && !isLoading && (
                <div className={classes.noUserContainer}>
                  <EmptyNotificationsIcon className={classes.noUserIcon} />
                  <h4 className={classes.noUserText}>{translations.t('notifications.noNotificationsToRead')}</h4>
                </div>
              )}
              {isLoading && _.isEmpty(notificationsData) && (
                <Spinner
                  title={translations.t('general.loading')}
                  hideLogo
                  spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
                  titleStyle={{ color: '#3f3f3f', marginTop: 5 }}
                />
              )}
              <MDButton
                title={translations.t('notifications.showAll')}
                backgroundColor="#5AC0B1"
                buttonStyle={{ borderRadius: 0 }}
                onClick={() => this.openNotificationPage()}
              />
            </div>
          }
          placement="bottom"
        />
      </div>
    );
  }
}

NotificationContainer.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(withRouter(NotificationContainer)));
