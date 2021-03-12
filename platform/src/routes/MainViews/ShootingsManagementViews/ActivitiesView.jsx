import { createMuiTheme, Grid, MuiThemeProvider, Paper, Tab } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import _ from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EmptyShootingDetails from '../../../components/Shooting/EmptyShootingDetails';
import ShootingActionsView from '../../../components/Shooting/ShootingActionsView';
import ShootingItem from '../../../components/Shooting/ShootingItem';
import ShootingList from '../../../components/Shooting/ShootingList';
import { SHOOTINGS_STATUSES } from '../../../config/consts';
import * as ShootingActions from '../../../redux/actions/shootings.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import translations from '../../../translations/i18next';

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#74beb2' },
    secondary: { main: '#000000' },
  },
  typography: {
    useNextVariants: true,
  },
});

class ActivitiesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      tabIndexSelected: 0,
    };
  }

  async componentWillMount() {
    const { dispatch, history } = this.props;
    const searchParameters = history && history.location && history.location.search;
    try {
      this.setState({ isLoading: true });
      dispatch(ShootingActions.resetShootingFilter());
      dispatch(ShootingActions.resetShootingsData());
      const stateFilter = this.elaborateShootingFilter(0);
      dispatch(ShootingActions.setShootingFilter('states', stateFilter));
      await dispatch(ShootingActions.fetchShootingsWithDetails());
      this.setState({ isLoading: false });
    } finally {
      try {
        const parsedParameters = queryString.parse(searchParameters);
        if (parsedParameters && parsedParameters.shootingId) this.onOpenShootingFromExternalView(parsedParameters.shootingId);
      } catch (error) {
        this.setState({ isLoading: false });
      }
    }
  }

  async onOpenShootingFromExternalView(shootingId) {
    this.setState({ isLoading: true });
    try {
      this.onGoToAcceptedShooting(shootingId);
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onSelectShooting(shooting) {
    const { dispatch } = this.props;
    let shootingData = shooting;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      shootingData = await dispatch(ShootingActions.fetchShootingDetailsAndPenalties(shooting));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } finally {
      dispatch(ShootingActions.setSelectedShooting(shootingData));
    }
  }

  async onTabChange(index) {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      dispatch(ShootingActions.resetShootingFilter());
      dispatch(ShootingActions.resetShootingsData());
      dispatch(ShootingActions.setSelectedShooting({}));
      const shootingStatusFilter = this.elaborateShootingFilter(index);
      dispatch(ShootingActions.setShootingFilter('states', [shootingStatusFilter]));
      this.setState({ tabIndexSelected: index });
      await dispatch(ShootingActions.fetchShootingsWithDetails());
      this.setState({ isLoading: false });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async onAppendShootings(page) {
    const { dispatch } = this.props;
    await dispatch(ShootingActions.fetchAndAppendShootings(page));
  }

  async onGoToAcceptedShooting(shooting) {
    const { dispatch } = this.props;
    this.onTabChange(1);
    const newShooting = await dispatch(ShootingActions.fetchShootingDetailsAndPenalties(shooting));
    dispatch(ShootingActions.setSelectedShooting(newShooting));
  }

  async onGoToUploadedShooting(shooting) {
    const { dispatch } = this.props;
    this.onTabChange(1);
    const newShooting = await dispatch(ShootingActions.fetchShootingDetailsAndPenalties(shooting));
    dispatch(ShootingActions.setSelectedShooting(newShooting));
  }

  elaborateShootingFilter(index) {
    const {
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    switch (index) {
      case 0: {
        const states = isPhotographer ? SHOOTINGS_STATUSES.ASSIGNED : [SHOOTINGS_STATUSES.NEW, SHOOTINGS_STATUSES.PENDING];
        return states;
      }
      case 1: {
        const states = isPhotographer
          ? [SHOOTINGS_STATUSES.ACCEPTED, SHOOTINGS_STATUSES.UPLOADED, SHOOTINGS_STATUSES.POST_PROCESSING]
          : [SHOOTINGS_STATUSES.ACCEPTED, SHOOTINGS_STATUSES.UPLOADED];
        return states;
      }
      case 2:
        return [SHOOTINGS_STATUSES.REFUSED];
      default:
        return SHOOTINGS_STATUSES.PENDING;
    }
  }

  render() {
    const {
      user: {
        data: { isPhotographer, isBoom },
      },
      utils: {
        app: { isMobile },
      },
      shootings: {
        selectedShooting,
        data: { content: shootingsData, pagination: shootingsPagination },
      },
    } = this.props;

    const { isLoading, tabIndexSelected } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div
          style={{
            paddingLeft: isMobile ? 30 : 100,
            paddingTop: isMobile ? 20 : 80,
            paddingRight: isMobile ? 30 : 100,
          }}
        >
          <Grid container spacing={20} style={{ marginBottom: 50 }}>
            <Grid item xs={12} md={7} style={{ paddingRight: 30 }}>
              {selectedShooting && !_.isEmpty(selectedShooting) ? (
                <ShootingActionsView
                  onGoToUploadedShooting={(shooting) => this.onGoToUploadedShooting(shooting)}
                  onGoToAcceptedShooting={(shooting) => this.onGoToAcceptedShooting(shooting)}
                />
              ) : (
                <EmptyShootingDetails />
              )}
            </Grid>
            <Grid item xs={12} md={5}>
              <AppBar
                position="static"
                style={{
                  backgroundColor: 'white',
                  boxShadow: [
                    'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px',
                    'rgba(0, 0, 0, 0.14) 0px 1px 1px 0px',
                    'rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
                  ],
                  borderRadius: 4,
                  alignItems: 'center',
                  marginTop: isMobile ? 30 : 0,
                }}
              >
                <Tabs
                  value={tabIndexSelected}
                  onChange={(event, index) => this.onTabChange(index)}
                  indicatorColor="primary"
                  textColor="secondary"
                  scrollable
                  scrollButtons="off"
                  style={{
                    boxShadow: '#e1e1e1 0px -10px 0px -8px inset',
                    fontWeight: 'bold',
                  }}
                >
                  <Tab label={translations.t('shootings.pendingRequests')} />
                  <Tab label={translations.t('shootings.acceptedRequests')} />
                  {isPhotographer && <Tab label={translations.t('shootings.refusedRequests')} />}
                </Tabs>
              </AppBar>
              <Paper square>
                <ShootingList
                  shootings={shootingsData}
                  selectedShootingId={selectedShooting.id}
                  pagination={shootingsPagination}
                  isLoading={isLoading}
                  onLoadMore={(page) => this.onAppendShootings(page)}
                >
                  {_.map(shootingsData, (shooting) => (
                    <ShootingItem
                      key={shooting.id}
                      isPhotographer={isPhotographer}
                      isBoom={isBoom}
                      shooting={shooting}
                      style={{
                        borderBottom: '1px solid #e1e1e1',
                        backgroundColor: shooting.id === selectedShooting.id ? '#f5f6f8' : 'white',
                      }}
                      onSelectItem={() => this.onSelectShooting(shooting)}
                    />
                  ))}
                </ShootingList>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  }
}

ActivitiesView.propTypes = {
  utils: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  utils: state.utils,
  user: state.user,
  shootings: state.shootings,
});

export default connect(mapStateToProps)(withRouter(ActivitiesView));
