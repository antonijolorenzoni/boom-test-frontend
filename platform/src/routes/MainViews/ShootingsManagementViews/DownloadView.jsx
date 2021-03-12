import { withStyles } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { initialize, submit } from 'redux-form';
import CompanyEvaluateShootingForm from '../../../components/Forms/ReduxForms/Shootings/CompanyEvaluateShootingForm';
import ShootingActionsView from '../../../components/Shooting/ShootingActionsView';
import ShootingCompletedRow from '../../../components/Shooting/ShootingCompletedRow';
import ShootingList from '../../../components/Shooting/ShootingList';
import ShootingSearchBar from '../../../components/Shooting/ShootingSearchBar';
import {
  COMPANIES_SHOOTING_LIST_STATUSES,
  PHOTOGRAPHER_SHOOTING_LIST_STATUSES,
  SHOOTING_STATUSES_UI_ELEMENTS,
  SHOOTINGS_STATUSES,
} from '../../../config/consts';
import { isMobileBrowser } from '../../../config/utils';
import * as ShootingActions from '../../../redux/actions/shootings.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';

let appendingTimeout;

const ShootingStatusOption = ({ state }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <h4 style={{ fontWeight: 100, marginRight: 10 }}>{translations.t(`shootingStatuses.${state}`)}</h4>
    <div style={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[state].color }} />
  </div>
);

const styles = (theme) => ({
  container: {
    padding: 20,
  },
});

class DownloadView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      dispatch(ShootingActions.resetShootingsData());
      dispatch(ShootingActions.resetShootingFilter());
      dispatch(ShootingActions.setShootingFilterBlock({ sortDirection: 'DESC', sortField: 'startDate' }));
      dispatch(ShootingActions.setShootingFilter('states', this.onElaborateStatusFilters()));
      await dispatch(ShootingActions.fetchShootingsWithScores());
      this.setState({ isLoading: false });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onElaborateStatusFilters() {
    const {
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    if (isPhotographer) return _.values(PHOTOGRAPHER_SHOOTING_LIST_STATUSES);
    return _.values(COMPANIES_SHOOTING_LIST_STATUSES);
  }

  async onAppendShootings(page) {
    const { dispatch } = this.props;
    if (appendingTimeout) clearTimeout(appendingTimeout);
    appendingTimeout = setTimeout(() => dispatch(ShootingActions.fetchShootingsWithScores(page)), 500);
  }

  async onEvaluatePhotographer(shooting) {
    const { dispatch } = this.props;
    dispatch(initialize('CompanyEvaluateShootingForm', { evaluation: 1 }));
    dispatch(
      ModalsActions.showModal('EVALUATION_DIALOG', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('shootings.evaluatePhotographerTitle'),
          content: (
            <CompanyEvaluateShootingForm onSubmit={(evaluationData) => this.onEvaluatePhotographerConfirm(shooting, evaluationData)} />
          ),
          bodyText: translations.t('shootings.evaluatePhotographerBody'),
          onConfirm: () => dispatch(submit('CompanyEvaluateShootingForm')),
          confirmText: translations.t('forms.send'),
        },
      })
    );
  }

  async onEvaluatePhotographerConfirm(shooting, evaluationData) {
    const { dispatch } = this.props;
    dispatch(ModalsActions.hideModal('EVALUATION_DIALOG'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(ShootingActions.createCompanyShootingScore(shooting.id, evaluationData.evaluation));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('EVALUATION_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('shootings.evaluatePhotographerSuccess'),
          },
        })
      );
      const shootingNew = await dispatch(ShootingActions.fetchShootingDetails(shooting.id));
      const shootingsScores = await dispatch(ShootingActions.getShootingScore(shooting));
      dispatch(ShootingActions.updateShootingInState({ ...shootingNew, score: shootingsScores }));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('EVALUATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.evaluatePhotographerError'),
          },
        })
      );
    }
  }

  async onShowShootingDetails(shootingEvent) {
    const {
      dispatch,
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    let shooting = shootingEvent;

    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      if (isPhotographer) {
        shooting = await dispatch(ShootingActions.fetchShootingDetailsAndPenalties(shootingEvent));
      } else {
        shooting = await dispatch(ShootingActions.fetchShootingDetailsAndItems(shootingEvent));
      }
      dispatch(ShootingActions.setSelectedShooting(shooting));
    } catch (error) {
      dispatch(ShootingActions.setSelectedShooting(shooting));
    }
    dispatch(UtilsActions.setSpinnerVisibile(false));
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
  }

  async onDownloadShootingFile(shooting) {
    const { dispatch } = this.props;
    try {
      await dispatch(ShootingActions.downloadShootingsPhotos(shooting));
      dispatch(ShootingActions.updateShootingInState({ ...shooting, state: SHOOTINGS_STATUSES.DOWNLOADED }));
    } catch (error) {
      dispatch(
        ModalsActions.showModal('DOWNLOAD_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('shootings.downloadShootingsPhotosError'),
          },
        })
      );
    }
  }

  async onResetFilters() {
    const { dispatch } = this.props;
    this.setState({ isLoading: true });
    try {
      dispatch(ShootingActions.resetShootingsData());
      dispatch(ShootingActions.resetShootingFilter());
      dispatch(ShootingActions.setShootingFilterBlock({ sortDirection: 'DESC', sortField: 'startDate' }));
      dispatch(ShootingActions.setShootingFilter('states', this.onElaborateStatusFilters()));
      await dispatch(ShootingActions.fetchShootingsWithScores());
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onSearch(searchValues) {
    const {
      dispatch,
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    if (searchValues && !_.isEmpty(searchValues)) {
      let filters = searchValues;
      try {
        if (!searchValues.states) {
          filters = { ...filters, states: this.onElaborateStatusFilters() };
        } else {
          let filteringStatuses = searchValues.states;
          if (isPhotographer) {
            // FIXME substitute DONE with all the companies underlined status
            const doneSelectedIndex = _.indexOf(searchValues.states, SHOOTINGS_STATUSES.DONE);
            if (doneSelectedIndex !== -1) {
              filteringStatuses = [...filteringStatuses, 'DOWNLOADED', 'ARCHIVED'];
            }
          }
          filters = { ...filters, states: [filteringStatuses] };
        }
        if (searchValues.shootingDate) {
          const dateFrom = moment(searchValues.shootingDate).startOf('day').valueOf();
          const dateTo = moment(searchValues.shootingDate).endOf('day').valueOf();
          filters = { ..._.omit(filters, searchValues.shootingDate), dateFrom, dateTo };
        }
        this.setState({ isLoading: true });
        dispatch(ShootingActions.resetShootingsData());
        dispatch(ShootingActions.setShootingFilterBlock({ ...filters, sortDirection: 'DESC', sortField: 'startDate' }));
        await dispatch(ShootingActions.fetchShootingsWithScores());
        this.setState({ isLoading: false });
      } catch (error) {
        this.setState({ isLoading: false });
      }
    }
  }

  elaborateShootingStatusOptions() {
    const {
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    let statuses = COMPANIES_SHOOTING_LIST_STATUSES;
    if (isPhotographer) {
      statuses = _.omit(PHOTOGRAPHER_SHOOTING_LIST_STATUSES, SHOOTINGS_STATUSES.DOWNLOADED);
    }
    return _.map(statuses, (state, index) => ({
      id: index,
      element: <ShootingStatusOption state={state} />,
      value: translations.t(`shootingStatuses.${state}`),
    }));
  }

  render() {
    const {
      classes,
      shootings: {
        selectedShooting,
        data: { content: shootingsData, pagination: shootingsPagination },
      },
      user: {
        data: { isPhotographer, isBoom },
      },
    } = this.props;
    const { isLoading } = this.state;
    const shootingStatuses = isPhotographer ? PHOTOGRAPHER_SHOOTING_LIST_STATUSES : COMPANIES_SHOOTING_LIST_STATUSES;
    return (
      <div className={classes.container}>
        {!isMobileBrowser() && (
          <ShootingSearchBar
            onResetFilters={() => this.onResetFilters()}
            shootingStatuses={_.values(shootingStatuses)}
            shootingStatesOptions={this.elaborateShootingStatusOptions()}
            isBoom={isBoom}
            onSubmit={(searchValues) => this.onSearch(searchValues)}
          />
        )}
        <ShootingList
          shootings={shootingsData}
          selectedShootingId={selectedShooting.id}
          pagination={shootingsPagination}
          isLoading={isLoading}
          onLoadMore={(page) => this.onAppendShootings(page)}
        >
          {_.map(shootingsData, (shooting) => (
            <ShootingCompletedRow
              key={shooting.id}
              shooting={shooting}
              isBoom={isBoom}
              isPhotographer={isPhotographer}
              onEvaluatePhotographer={() => this.onEvaluatePhotographer(shooting)}
              onShowShootingDetails={() => this.onShowShootingDetails(shooting)}
              onDownloadShootingFile={() => this.onDownloadShootingFile(shooting)}
            />
          ))}
        </ShootingList>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  shootings: state.shootings,
  companies: state.companies,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(withRouter(DownloadView)));
