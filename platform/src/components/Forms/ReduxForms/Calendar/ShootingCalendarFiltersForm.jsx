import { Grid, IconButton, withStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm } from 'redux-form';
import {
  COMPANIES_SHOOTING_CALENDAR_STATUSES,
  SHOOTINGS_STATUSES,
  PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES,
  USER_ROLES,
} from '../../../../config/consts';
import * as CompaniesActions from '../../../../redux/actions/companies.actions';
import * as OrganizationsActions from '../../../../redux/actions/organizations.actions';
import * as PhotographersActions from '../../../../redux/actions/photographers.actions';
import * as ShootingsActions from '../../../../redux/actions/shootings.actions';
import * as UtilsActions from '../../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../../redux/actions/modals.actions';
import translations from '../../../../translations/i18next';
import { OrderStatusLegend } from 'components/OrderStatusLegend';
import MDSelectMultipleField from '../../FormComponents/MDSelectMultipleField/MDSelectMultipleField';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';

const styles = (theme) => ({
  container: {
    marginTop: 40,
  },
  text: {
    margin: 0,
    color: '#80888d',
  },
  errorIcon: {
    color: '#cc3300',
    marginRight: 10,
  },
  warningIcon: {
    color: '#80888d',
    marginRight: 10,
  },
});

class ShootingCalendarFiltersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(OrganizationsActions.setSelectedOrganization({}));
  }

  async onOrganizationSelect(organizationData) {
    const { dispatch } = this.props;
    dispatch(UtilsActions.setSpinnerVisibile(true));
    if (organizationData && organizationData.value) {
      dispatch(OrganizationsActions.setSelectedOrganization(organizationData.value));
      dispatch(ShootingsActions.setShootingFilter('filterOrganizationId', organizationData.value.id));
    } else {
      dispatch(OrganizationsActions.setSelectedOrganization({}));
      dispatch(OrganizationsActions.resetOrganizationFilters());
      dispatch(ShootingsActions.setShootingFilter('filterOrganizationId', null));
      dispatch(change('ShootingCalendarFiltersForm', 'filterOrganizationId', null));
      this.onCompanySelected(null);
    }
    try {
      await dispatch(ShootingsActions.fetchCalendarPhOrders());
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onCompanySelected(companyData) {
    const { dispatch } = this.props;
    if (companyData && companyData.value) {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.setSelectedCompany(companyData.value));
      dispatch(ShootingsActions.setShootingFilter('companyId', companyData.value.id));
    } else {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.setSelectedCompany({}));
      dispatch(CompaniesActions.resetCompaniesFilters());
      dispatch(ShootingsActions.setShootingFilter('companyId', null));
      dispatch(change('ShootingCalendarFiltersForm', 'companySelected', null));
    }
    try {
      await dispatch(ShootingsActions.fetchCalendarPhOrders());
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onPhotographerSelected(photographer) {
    const { dispatch } = this.props;
    if (photographer && photographer.value) {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(ShootingsActions.setShootingFilter('search', photographer.value.user.email));
    } else {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      dispatch(CompaniesActions.resetCompaniesFilters());
      dispatch(ShootingsActions.setShootingFilter('search', null));
      dispatch(change('ShootingCalendarFiltersForm', 'photographerSelected', null));
    }
    try {
      await dispatch(ShootingsActions.fetchCalendarPhOrders());
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async onSubmitShootingStatusFilter(statuses) {
    const {
      dispatch,
      user: {
        data: { isBoom, isPhotographer },
      },
    } = this.props;
    let filteringStatuses = statuses;

    if (!isBoom && !isPhotographer) {
      // FIXME substitute ACCEPTED with all the companies underlined status
      const acceptedSelectedIndex = _.indexOf(statuses, SHOOTINGS_STATUSES.ACCEPTED);
      if (acceptedSelectedIndex !== -1) {
        filteringStatuses = [
          ...filteringStatuses,
          SHOOTINGS_STATUSES.UPLOADED,
          SHOOTINGS_STATUSES.NEW,
          SHOOTINGS_STATUSES.PENDING,
          SHOOTINGS_STATUSES.MATCHED,
          SHOOTINGS_STATUSES.ASSIGNED,
          SHOOTINGS_STATUSES.ACCEPTED,
        ];
      }

      const postProcessedSelectedIndex = _.indexOf(statuses, SHOOTINGS_STATUSES.POST_PROCESSING);
      if (postProcessedSelectedIndex !== -1) {
        filteringStatuses = [...filteringStatuses, SHOOTINGS_STATUSES.REFUSED];
      }
    }

    if (isPhotographer) {
      // FIXME substitute DONE with all the companies underlined status
      const doneSelectedIndex = _.indexOf(statuses, SHOOTINGS_STATUSES.DONE);
      if (doneSelectedIndex !== -1) {
        filteringStatuses = [...filteringStatuses, SHOOTINGS_STATUSES.DOWNLOADED, SHOOTINGS_STATUSES.ARCHIVED];
      }
    }

    dispatch(ShootingsActions.setShootingFilter('states', filteringStatuses));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(ShootingsActions.fetchCalendarPhOrders());
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
  }

  async fetchOrganizationsOptions(value) {
    const { dispatch } = this.props;
    dispatch(OrganizationsActions.setOrganizationFilter('name', value));
    const organizations = await dispatch(OrganizationsActions.fetchOrganizations());
    return _.map(organizations, (organization) => ({ value: organization, label: organization.name }));
  }

  async fetchCompaniesOptions(value) {
    const {
      dispatch,
      user: {
        data: { isBoom, organization: userOrganization },
      },
    } = this.props;
    if (!isBoom) {
      const organization = await dispatch(OrganizationsActions.fetchOrganizationDetails(userOrganization));
      dispatch(OrganizationsActions.setSelectedOrganization(organization));
    }
    dispatch(CompaniesActions.setCompaniesFilter('name', value));
    const companies = await dispatch(CompaniesActions.fetchCompanies());
    return _.map(companies, (company) => ({ value: company, label: company.name }));
  }

  showStatusInformationModal() {
    const {
      dispatch,
      user: {
        data: { isBoom, isPhotographer },
      },
    } = this.props;

    let shootingStatusesToShow;
    if (!isBoom && !isPhotographer) {
      shootingStatusesToShow = COMPANIES_SHOOTING_CALENDAR_STATUSES;
    }

    if (isPhotographer) {
      shootingStatusesToShow = _.omit(PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES, SHOOTINGS_STATUSES.DOWNLOADED);
    }

    dispatch(
      ModalsActions.showModal('SHOOTING_STATUSES_LEGEND', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('shootings.shootingStatusesLegend'),
          content: <OrderStatusLegend statuses={shootingStatusesToShow} />,
          cancelText: translations.t('forms.close'),
        },
      })
    );
  }

  async fetchPhotographersOptions(value) {
    const { dispatch } = this.props;
    dispatch(PhotographersActions.setPhotographersFilter('name', value));
    const photographers = await dispatch(PhotographersActions.fetchPhotographers());
    dispatch(PhotographersActions.resetPhotographersFilters());
    return _.map(photographers, (photographer) => ({
      value: photographer,
      label: `${photographer.user.firstName} ${photographer.user.lastName}`,
    }));
  }

  async fetchTimezonesOptions(name) {
    const timezones = moment.tz.names();
    const filteredTimezones = _.filter(timezones, (timezone) => _.includes(timezone, name));
    return _.map(filteredTimezones, (timezone) => ({ value: timezone, label: timezone }));
  }

  onTimezoneSelected(timezone) {
    const { dispatch } = this.props;
    if (timezone && timezone.value) {
      moment.tz.setDefault(timezone.value);
      dispatch(UtilsActions.setTimezoneSelected(timezone.value));
    } else {
      moment.tz.setDefault(moment.tz.guess());
      dispatch(UtilsActions.setTimezoneSelected(moment.tz.guess()));
    }
  }

  render() {
    const {
      classes,
      organizations: { selectedOrganization },
      shootingStatesOptions,
      user: {
        data: { isBoom, isPhotographer, roles },
      },
    } = this.props;

    const isSMB = roles?.some((role) => role.name === USER_ROLES.ROLE_SMB);

    return (
      <div className={classes.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ color: '#81888e', marginTop: 0, marginBottom: 5 }}>{translations.t('forms.filters')}</h4>
          <IconButton onClick={() => this.showStatusInformationModal()}>
            <InfoIcon />
          </IconButton>
        </div>
        <Grid container spacing={8}>
          <Grid item xs={12} md={12}>
            <Field
              name="states"
              title={translations.t('shootings.shotingStatus')}
              component={MDSelectMultipleField}
              options={shootingStatesOptions}
              InputProps={{
                containerstyle: {
                  width: '100%',
                },
              }}
              containerstyle={{ backgroundColor: 'white' }}
              onHandleChange={(values) => this.onSubmitShootingStatusFilter(values)}
            />
          </Grid>
          {isBoom && (
            <Grid item xs={12} md={12}>
              <Field
                name="photographerSelected"
                title={translations.t('shootings.photographer')}
                titleStyle={{ fontSize: 12 }}
                component={SelectableField}
                placeholder={translations.t('calendar.insert')}
                containerstyle={{ marginBottom: 15 }}
                onSelect={(photographerData) => this.onPhotographerSelected(photographerData)}
                onLoadOptions={(name) => this.fetchPhotographersOptions(name)}
              />
            </Grid>
          )}
          {isBoom && !isPhotographer && (
            <Grid item xs={12} md={12}>
              <Field
                name="organizationSelected"
                title={translations.t('organization.name')}
                titleStyle={{ fontSize: 12 }}
                component={SelectableField}
                placeholder={translations.t('calendar.insert')}
                containerstyle={{ marginBottom: 15 }}
                onSelect={(organizationData) => this.onOrganizationSelect(organizationData)}
                onLoadOptions={(name) => this.fetchOrganizationsOptions(name)}
              />
            </Grid>
          )}
          {!isPhotographer && !isSMB && (
            <Grid item xs={12} md={12}>
              <Field
                title={translations.t('company.name')}
                titleStyle={{ fontSize: 12 }}
                name="companySelected"
                component={SelectableField}
                noCache
                isDisabled={isBoom && _.isEmpty(selectedOrganization)}
                placeholder={translations.t('calendar.insert')}
                containerstyle={{ marginBottom: 15 }}
                onSelect={(companyData) => this.onCompanySelected(companyData)}
                onLoadOptions={(name) => this.fetchCompaniesOptions(name)}
              />
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

ShootingCalendarFiltersForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  form: state.form.ShootingCalendarFiltersForm,
  organizations: state.organizations,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  withStyles(styles),
  reduxForm({
    form: 'ShootingCalendarFiltersForm',
  }),
])(ShootingCalendarFiltersForm);
