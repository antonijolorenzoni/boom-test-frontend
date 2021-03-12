//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: B A L A N C E   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { change, initialize } from 'redux-form';
import { connect } from 'react-redux';
import translations from '../../../translations/i18next';
import CompanyPenaltiesConfigForm from '../../../components/Forms/ReduxForms/Companies/CompanyPenaltiesConfigForm';
import * as CompaniesActions from '../../../redux/actions/companies.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';

const styles = (theme) => ({
  container: {
    paddingLeft: 20,
    height: '100vh',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class PenaltiesConfigView extends React.Component {
  async componentDidMount() {
    const { dispatch, company } = this.props;
    const penaltiesConfig = await dispatch(CompaniesActions.fetchCompanyPenaltiesConfig(company.id));
    dispatch(initialize('CompanyPenaltiesConfigForm', { ...penaltiesConfig }));
  }

  async onSaveConfig(configData) {
    const { dispatch, company } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(CompaniesActions.updateCompanyPenaltiesConfig(company.id, configData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.saveCompaniesConfigSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.saveCompaniesConfigError'),
          },
        })
      );
    }
  }

  async onResetConfig() {
    const { dispatch, company } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(CompaniesActions.resetCompanyPenaltiesConfig(company.id));
      const penaltiesConfig = await dispatch(CompaniesActions.fetchCompanyPenaltiesConfig(company.id));
      dispatch(change('CompanyPenaltiesConfigForm', 'minPenaltyHoursThreshold', penaltiesConfig.minPenaltyHoursThreshold));
      dispatch(change('CompanyPenaltiesConfigForm', 'minPenaltyAmountPercentage', penaltiesConfig.minPenaltyAmountPercentage));
      dispatch(change('CompanyPenaltiesConfigForm', 'minTravelPenaltyAmountPercentage', penaltiesConfig.minTravelPenaltyAmountPercentage));
      dispatch(change('CompanyPenaltiesConfigForm', 'maxPenaltyHoursThreshold', penaltiesConfig.maxPenaltyHoursThreshold));
      dispatch(change('CompanyPenaltiesConfigForm', 'maxPenaltyAmountPercentage', penaltiesConfig.maxPenaltyAmountPercentage));
      dispatch(change('CompanyPenaltiesConfigForm', 'maxTravelPenaltyAmountPercentage', penaltiesConfig.maxTravelPenaltyAmountPercentage));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('company.resetCompaniesConfigSuccess'),
          },
        })
      );
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('ACCEPT_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('company.resetCompaniesConfigError'),
          },
        })
      );
    }
  }

  render() {
    return (
      <div>
        <CompanyPenaltiesConfigForm onSubmit={(configData) => this.onSaveConfig(configData)} onResetConfig={() => this.onResetConfig()} />
      </div>
    );
  }
}

export default connect()(withStyles(styles)(withRouter(PenaltiesConfigView)));
