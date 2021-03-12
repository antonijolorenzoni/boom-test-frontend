//
// ────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: N O T I F I C A T I O N S   L I S T   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, Tab, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import ReadNotificationsIcon from '@material-ui/icons/AssignmentReturned';
import NewNotificationsIcon from '@material-ui/icons/AssignmentTurnedIn';
import EmptyNotificationsIcon from '@material-ui/icons/AssignmentLate';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import ListComponent from '../../components/ListComponent/ListComponent';
import Spinner from '../../components/Spinner/Spinner';
import * as NotificationsActions from '../../redux/actions/notification.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import translations from '../../translations/i18next';
import NotificationRow from '../../components/Notifications/NotificationRow';

const styles = (theme) => ({
  container: {
    padding: 20,
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
    fontSize: 40,
    color: '#7F888F',
    marginRight: 20,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  listContainer: {
    marginTop: 7,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

class NotificationsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTabIndex: 0,
    };
  }

  async componentWillMount() {
    const { dispatch } = this.props;
    const { activeTabIndex } = this.state;
    this.setState({ isLoading: true });
    dispatch(NotificationsActions.saveNotificationsFilter('seen', activeTabIndex === 1));
    await dispatch(NotificationsActions.fetchNotifications());
    this.setState({ isLoading: false });
  }

  async onAppendNotifications(page) {
    const { dispatch } = this.props;
    await dispatch(NotificationsActions.fetchAndAppendNotifications(page));
  }

  async onTabChange(index) {
    const { dispatch } = this.props;
    this.setState({ isLoading: true, activeTabIndex: index });
    try {
      dispatch(NotificationsActions.resetNotificationsData());
      dispatch(NotificationsActions.resetNotificationsFilters());
      const statusFilter = index === 1;
      dispatch(NotificationsActions.saveNotificationsFilter('seen', statusFilter));
      await dispatch(NotificationsActions.fetchNotifications());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onOpenNotificationEvent(notification) {
    const { dispatch, history } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await NotificationsActions.markNotificationAsRead(notification.id);
      dispatch(UtilsActions.setSpinnerVisibile(false));
      history.push(`/shootingDetails?shootingId=${notification.event.shooting}`);
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  render() {
    const {
      classes,
      notifications: {
        data: { content: notificationsData, pagination },
      },
    } = this.props;
    const { isLoading, activeTabIndex } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.container}>
          <h4>{translations.t('notifications.notifications')}</h4>
          <ListComponent pagination={pagination} containerstyle={{ width: '90%' }} onLoadMore={(page) => this.onAppendNotifications(page)}>
            <AppBar position="static" style={{ backgroundColor: 'white' }}>
              <Tabs
                value={activeTabIndex}
                onChange={(event, index) => this.onTabChange(index)}
                scrollable
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label={translations.t('notifications.notRead')} icon={<ReadNotificationsIcon />} />
                <Tab label={translations.t('notifications.read')} icon={<NewNotificationsIcon />} />
              </Tabs>
            </AppBar>
            <Paper className={classes.listContainer} square>
              {_.map(notificationsData, (notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  containerstyle={{ padding: 10 }}
                  onClick={() => this.onOpenNotificationEvent(notification)}
                />
              ))}
              {(!notificationsData || _.isEmpty(notificationsData)) && !isLoading && (
                <div className={classes.noUserContainer}>
                  <EmptyNotificationsIcon className={classes.noUserIcon} />
                  <h4 className={classes.noUserText}>
                    {activeTabIndex === 0
                      ? translations.t('notifications.noNotificationsToRead')
                      : translations.t('notifications.noNotificationsFound')}
                  </h4>
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
            </Paper>
          </ListComponent>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(NotificationsView));
