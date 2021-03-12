import { withStyles, Paper, Grid } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCameraOutlined';
import BusinessIcon from '@material-ui/icons/BusinessOutlined';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import WarningIcon from '@material-ui/icons/Warning';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm, submit } from 'redux-form';
import { fetchGoogleAddressDetails, onFetchGooglePlacesOptions } from '../../../../api/instances/googlePlacesInstance';
import * as ShootingsActions from '../../../../redux/actions/shootings.actions';
import * as UsersActions from '../../../../redux/actions/users.actions';
import { CUSTOM_PERCENTAGE_CANCELLATION } from '../../../../config/consts';
import { calculatePercentage } from '../../../../config/utils';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import MDDatePickerField from '../../FormComponents/MDDatePicker/MDDatePickerField';
import MDTimePickerField from '../../FormComponents/MDTimePicker/MDTimePickerField';
import MDSelectView from '../../FormComponents/MDSelectField/MDSelectView';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';
import { getDurationInfoString } from '../../../../utils/timeHelpers';

const styles = {
  container: {
    marginLeft: 37,
    marginRight: 37,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  warningIcon: {
    color: '#80888d',
    marginRight: 10,
  },
  hline: {
    backgroundColor: '#dedede',
    height: 1,
    width: '100%',
  },
  sectionContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIcon: {
    color: 'black',
    marginRight: 10,
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 0,
    marginBottom: 0,
    color: '#80888d',
  },
  confirmBtn: {
    boxShadow: 'none',
    color: '#FFFFFF',
    backgroundColor: '#5AC0B1',
    fontSize: 13,
    fontWeight: 500,
    width: 70,
  },
  cancelBtn: {
    borderColor: '#5AC0B1',
    color: '#5AC0B1',
    fontSize: 13,
    fontWeight: 500,
    width: 70,
    marginRight: 24,
  },
  // cancel section
  containerGridCancellation: {
    textAlign: 'center',
    '& > div:not(:last-child)': {
      borderRight: '0.5px solid #a3abb1f0',
    },
    marginTop: 20,
    marginBottom: 20,
  },
  fieldSelectCancellation: {
    marginTop: 10,
  },
  percentageCancellation: {
    color: '#000000',
    fontWeight: 500,
    fontSize: 15,
    margin: '20px 0',
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#80888D',
    margin: 0,
    marginBottom: 20,
    textTransform: 'uppercase',
    height: 40,
  },
  gridIcon: {
    color: '#80888d',
  },
  innerContainer: {
    border: '1px solid #A3ABB1',
    boxShadow: 'none',
  },
  subtitle: {
    fontSize: 13,
    color: '#80888D',
    fontWeight: 500,
    marginLeft: 20,
  },
};

const validateStartTime = (startTime, timezone, isBoom) => {
  if (!startTime) {
    return translations.t('forms.required');
  }

  const hours = moment.tz(moment.utc(startTime), timezone).hours();
  const minutes = moment.tz(moment.utc(startTime), timezone).minutes();

  if (!isBoom) {
    if (hours < 8) {
      return translations.t('forms.minimumTimeError');
    }

    if (hours > 19 || (hours === 19 && minutes > 0)) {
      return translations.t('forms.minimumTimeError');
    }
  }

  return null;
};

const validate = (values, props) => {
  const timezoneSelected = _.get(props, 'values.timezoneSelected');
  const timezone = timezoneSelected || moment.tz.guess();
  const errors = {};
  const isBoom = props.isBoom;

  if (!values.date && !values.startTime) {
    errors.date = translations.t('forms.required');
    errors.startTime = translations.t('forms.required');
  }

  if (values.date) {
    errors.startTime = validateStartTime(values.startTime, timezone, isBoom);
  }

  if (values.startTime) {
    if (!values.date) {
      errors.date = translations.t('forms.required');
    }

    errors.startTime = validateStartTime(values.startTime, timezone, isBoom);
  }

  if (!values.pricingPackage) {
    errors.pricingPackage = translations.t('forms.required');
  }
  if (!values.placeSelected) {
    errors.placeSelected = translations.t('forms.required');
  }
  if (!values.companySelected) {
    errors.companySelected = translations.t('forms.required');
  }
  if (!values.companyPenaltyPercentage) {
    errors.companyPenaltyPercentage = translations.t('forms.required');
  }
  if (!values.photographerRefundPercentage) {
    errors.photographerRefundPercentage = translations.t('forms.required');
  }
  if (!values.companyTravelPenaltyPercentage) {
    errors.companyTravelPenaltyPercentage = translations.t('forms.required');
  }
  if (!values.photographerTravelRefundPercentage) {
    errors.photographerTravelRefundPercentage = translations.t('forms.required');
  }
  if (!values.authorization) {
    errors.authorization = translations.t('forms.required');
  }
  if (!values.cancellationNotes) {
    errors.cancellationNotes = translations.t('forms.required');
  }
  return errors;
};

const uuidv4 = require('uuid/v4');

let googleSessionToken = uuidv4();

const refundAndPenaltyPolicy = {
  DEFAULT: 'DEFAULT',
  ZERO: 'ZERO',
  CUSTOM: 'CUSTOM',
};

const refundAndPenaltyPolicyLabel = {
  [refundAndPenaltyPolicy.DEFAULT]: translations.t('shootings.defaultCancelling'),
  [refundAndPenaltyPolicy.ZERO]: translations.t('shootings.zeroPercentageCancelling'),
  [refundAndPenaltyPolicy.CUSTOM]: translations.t('shootings.customPercentageCancelling'),
};

class ShootingRescheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPolicy: Object.keys(refundAndPenaltyPolicy)[0],
    };
  }

  async componentDidMount() {
    const { dispatch, shooting, photographer, isBoom } = this.props;
    if (isBoom) {
      const penalties = await dispatch(ShootingsActions.fetchShootingCompanyPenalties(shooting));
      const refunds = await dispatch(ShootingsActions.fetchShootingPhotographerRefunds(shooting, photographer));
      dispatch(change('ShootingRescheduleForm', 'companyPenalties', penalties));
      dispatch(change('ShootingRescheduleForm', 'photographerRefunds', refunds));
    }
  }

  onFetchGoogleAddress = async (address) => {
    try {
      const addressa = await onFetchGooglePlacesOptions(address, googleSessionToken);
      return addressa;
    } catch (error) {
      return [];
    }
  };

  onChangePolicy = async (policy) => {
    const { dispatch, shooting, photographer } = this.props;

    this.setState(
      {
        selectedPolicy: policy,
      },
      async () => {
        switch (this.state.selectedPolicy) {
          case refundAndPenaltyPolicy.DEFAULT: {
            const penalties = await dispatch(ShootingsActions.fetchShootingCompanyPenalties(shooting));
            const refunds = await dispatch(ShootingsActions.fetchShootingPhotographerRefunds(shooting, photographer));
            dispatch(change('ShootingRescheduleForm', 'companyPenalties', penalties));
            dispatch(change('ShootingRescheduleForm', 'photographerRefunds', refunds));
            break;
          }
          case refundAndPenaltyPolicy.ZERO: {
            const penalties = {
              companyPenalty: 0,
              companyTravelPenalty: 0,
              companyPenaltyPercentage: 0,
              companyTravelPenaltyPercentage: 0,
            };
            const refunds = {
              photographerRefund: 0,
              photographerTravelRefund: 0,
              photographerRefundPercentage: 0,
              photographerTravelRefundPercentage: 0,
            };
            dispatch(change('ShootingRescheduleForm', 'companyPenalties', penalties));
            dispatch(change('ShootingRescheduleForm', 'photographerRefunds', refunds));
            break;
          }
          case refundAndPenaltyPolicy.CUSTOM: {
            const penalties = {
              companyPenalty: 0,
              companyTravelPenalty: 0,
              companyPenaltyPercentage: 0,
              companyTravelPenaltyPercentage: 0,
            };
            const refunds = {
              photographerRefund: 0,
              photographerTravelRefund: 0,
              photographerRefundPercentage: 0,
              photographerTravelRefundPercentage: 0,
            };
            dispatch(change('ShootingRescheduleForm', 'companyPenalties', penalties));
            dispatch(change('ShootingRescheduleForm', 'photographerRefunds', refunds));
            break;
          }
          default:
        }
      }
    );
  };

  onSelectCompanyPhotoshootPenalty(percentage) {
    const { dispatch, companyPrice } = this.props;
    const companyPhotoshootPenalty = calculatePercentage(companyPrice, parseInt(percentage, 10));
    dispatch(change('ShootingRescheduleForm', 'companyPenalties.companyPenalty', companyPhotoshootPenalty));
    dispatch(change('ShootingRescheduleForm', 'companyPenalties.companyPenaltyPercentage', percentage));
  }

  onSelectPhotographerPhotoshootRefund(percentage) {
    const { dispatch, photographerEarning } = this.props;
    const photographerPhotoshootRefund = calculatePercentage(photographerEarning, parseInt(percentage, 10));
    dispatch(change('ShootingRescheduleForm', 'photographerRefunds.photographerRefund', photographerPhotoshootRefund));
    dispatch(change('ShootingRescheduleForm', 'photographerRefunds.photographerRefundPercentage', percentage));
  }

  onSelectCompanyTravelPenalty(percentage) {
    const { dispatch, travelExpenses } = this.props;
    const companyTravelPenalty = calculatePercentage(travelExpenses, parseInt(percentage, 10));
    dispatch(change('ShootingRescheduleForm', 'companyPenalties.companyTravelPenalty', companyTravelPenalty));
    dispatch(change('ShootingRescheduleForm', 'companyPenalties.companyTravelPenaltyPercentage', percentage));
  }

  onSelectPhotographerTravelRefund(percentage) {
    const { dispatch, travelExpenses } = this.props;
    const photographerTravelRefund = calculatePercentage(travelExpenses, parseInt(percentage, 10));
    dispatch(change('ShootingRescheduleForm', 'photographerRefunds.photographerTravelRefund', photographerTravelRefund));
    dispatch(change('ShootingRescheduleForm', 'photographerRefunds.photographerTravelRefundPercentage', percentage));
  }

  async fetchUsersAuthorizedBy(username) {
    const { dispatch, organizationId } = this.props;
    dispatch(UsersActions.setUsersFilter('enabled', true));
    dispatch(UsersActions.setUsersFilter('username', username));
    dispatch(UsersActions.resetUsersData());
    const users = await dispatch(UsersActions.fetchUsersByOrganizationId(organizationId));
    return _.map(users, (user) => ({ value: user.id, label: `${user.firstName} ${user.lastName} - ${user.username}` }));
  }

  async fetchGoogleAddressDetails(address) {
    const { dispatch, ShootingRescheduleReduxForm } = this.props;
    try {
      const addressDetails = await fetchGoogleAddressDetails(address, googleSessionToken);
      const selectedAddress = {
        value: addressDetails,
        label: addressDetails.formattedAddress,
      };
      googleSessionToken = uuidv4();
      dispatch(change('ShootingRescheduleForm', 'placeSelected', selectedAddress));

      const timeZoneSelected = _.get(selectedAddress, 'value.timezone');
      if (timeZoneSelected) {
        const startTime = _.get(ShootingRescheduleReduxForm, 'values.startTime', moment.now());
        dispatch(change('ShootingRescheduleForm', 'timezoneSelected', timeZoneSelected));
        dispatch(change('ShootingRescheduleForm', 'startTime', moment.tz(moment.utc(startTime), timeZoneSelected).valueOf()));
      }
    } catch (error) {
      dispatch(change('ShootingRescheduleForm', 'placeSelected', null));
      dispatch(change('ShootingRescheduleForm', 'timezoneSelected', moment.tz.guess()));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    const oldStartTime = _.get(this.props, 'ShootingRescheduleReduxForm.values.startTime');
    const newStartTime = _.get(nextProps, 'ShootingRescheduleReduxForm.values.startTime');
    const oldDate = _.get(this.props, 'ShootingRescheduleReduxForm.values.date');
    const newDate = _.get(nextProps, 'ShootingRescheduleReduxForm.values.date');

    if (oldStartTime !== newStartTime) {
      dispatch(change('ShootingRescheduleForm', 'startTime', newStartTime));
      dispatch(change('ShootingRescheduleForm', 'date', newStartTime));
    } else if (oldDate !== newDate) {
      dispatch(change('ShootingRescheduleForm', 'startTime', newDate));
      dispatch(change('ShootingRescheduleForm', 'date', newDate));
    }
  }

  render() {
    const { classes, ShootingRescheduleReduxForm, dispatch, canEditAddress, currency, isBoom } = this.props;
    const { selectedPolicy } = this.state;

    const duration = _.get(ShootingRescheduleReduxForm, 'values.shootingDuration');
    const companyPenalties = _.get(ShootingRescheduleReduxForm, 'values.companyPenalties');
    const photographerRefunds = _.get(ShootingRescheduleReduxForm, 'values.photographerRefunds');
    const currencySymbol = currency && currency.symbol ? currency.symbol : '€';
    const durationInfo = getDurationInfoString(duration);
    const timeZoneSelected = _.get(ShootingRescheduleReduxForm, 'values.timezoneSelected');

    const percentageSelectStyle = {
      marginLeft: 20,
      marginRight: 20,
    };
    const paddingField = {
      padding: 20,
    };

    return (
      <>
        <div
          style={{
            fontSize: 17,
            fontWeight: 500,
            marginLeft: 37,
            marginTop: 44,
            marginBottom: 12,
          }}
        >
          {translations.t('shootings.rescheduleShooting')}
        </div>
        <div className={classes.container}>
          <div
            style={{
              display: 'flex',
              marginBottom: 15,
            }}
          >
            <Field
              name="date"
              component={MDDatePickerField}
              timezone={timeZoneSelected || moment.tz.guess()}
              minDate={moment().valueOf()}
              label={translations.t('calendar.shootingDate')}
              style={{ marginRight: 30 }}
              showErrorLabel
            />
            <div>
              <Field
                name="startTime"
                component={MDTimePickerField}
                containerstyle={{
                  marginTop: 15,
                  marginBottom: 5,
                }}
                label={translations.t('calendar.shootingStartTime')}
                timezone={timeZoneSelected || moment.tz.guess()}
                showErrorLabel
              />
              {duration && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ClockIcon className={classes.warningIcon} />
                  <span className={classes.descriptionText}>{`${translations.t('forms.shootingWillLast')}: ${durationInfo}`}</span>
                </div>
              )}
            </div>
          </div>
          <Field
            name="placeSelected"
            title={translations.t('calendar.address')}
            titleStyle={{ fontSize: 13 }}
            component={SelectableField}
            isDisabled={!canEditAddress}
            placeholder={translations.t('calendar.insert')}
            containerstyle={{ marginBottom: 15 }}
            onLoadOptions={(address) => this.onFetchGoogleAddress(address)}
            onSelect={(address) => this.fetchGoogleAddressDetails(address)}
          />
          <div className={classes.sectionContainer}>
            <WarningIcon
              className={classes.sectionIcon}
              style={{
                color: !canEditAddress ? 'red' : '#80888d',
              }}
            />
            <h5
              style={{
                margin: 0,
                color: !canEditAddress ? 'red' : '#80888d',
              }}
            >
              {translations.t('forms.addressNotModifiable')}
            </h5>
          </div>
          {isBoom && (
            <>
              <div
                style={{
                  width: '30%',
                  marginTop: 50,
                  marginBottom: 20,
                }}
              >
                <MDSelectView
                  title={translations.t('shootings.penaltiesAndRefunds')}
                  value={selectedPolicy}
                  options={Object.values(refundAndPenaltyPolicy).map((id) => ({ id, value: refundAndPenaltyPolicyLabel[id] }))}
                  onSelect={this.onChangePolicy}
                />
              </div>
              <Paper square className={classes.innerContainer}>
                <Grid container className={classes.containerGridCancellation} xs={12} md={12}>
                  <Grid item xs={3} direction="column">
                    <BusinessIcon className={classes.gridIcon} />
                    <div className={classes.gridLabel}>{translations.t('shootings.cancellingCompany')}</div>
                    {selectedPolicy !== refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        {companyPenalties && (
                          <div className={classes.percentageCancellation}>{`${companyPenalties.companyPenaltyPercentage} %`}</div>
                        )}
                        {companyPenalties && (
                          <div className={classes.percentageCancellation}>{`${companyPenalties.companyPenalty} ${currencySymbol}`}</div>
                        )}
                      </Grid>
                    )}
                    {selectedPolicy === refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        <Field
                          title="%"
                          required
                          name="companyPenaltyPercentage"
                          component={MDSelectField}
                          containerstyle={percentageSelectStyle}
                          onHandleChange={(values) => this.onSelectCompanyPhotoshootPenalty(values)}
                          options={_.map(CUSTOM_PERCENTAGE_CANCELLATION, (type) => ({ id: type, value: type }))}
                        />
                        {companyPenalties && (
                          <div className={classes.percentageCancellation}>{`${companyPenalties.companyPenalty} ${currencySymbol}`}</div>
                        )}
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <PhotoCameraIcon className={classes.gridIcon} />
                    <div className={classes.gridLabel}>{translations.t('shootings.photographerRefund')}</div>
                    {selectedPolicy !== refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        {photographerRefunds && (
                          <div className={classes.percentageCancellation}>{`${photographerRefunds.photographerRefundPercentage} %`}</div>
                        )}
                        {photographerRefunds && (
                          <div className={classes.percentageCancellation}>
                            {`${photographerRefunds.photographerRefund} ${currencySymbol}`}
                          </div>
                        )}
                      </Grid>
                    )}
                    {selectedPolicy === refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        <Field
                          title="%"
                          required
                          name="photographerRefundPercentage"
                          component={MDSelectField}
                          containerstyle={percentageSelectStyle}
                          onHandleChange={(values) => this.onSelectPhotographerPhotoshootRefund(values)}
                          options={_.map(CUSTOM_PERCENTAGE_CANCELLATION, (type) => ({ id: type, value: type }))}
                        />
                        {photographerRefunds && (
                          <div className={classes.percentageCancellation}>
                            {`${photographerRefunds.photographerRefund} ${currencySymbol}`}
                          </div>
                        )}
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <BusinessIcon className={classes.gridIcon} />
                    <div className={classes.gridLabel}>{translations.t('shootings.companyTravelPenalty')}</div>
                    {selectedPolicy !== refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        {companyPenalties && (
                          <div className={classes.percentageCancellation}>{`${companyPenalties.companyTravelPenaltyPercentage} %`}</div>
                        )}
                        {companyPenalties && (
                          <div className={classes.percentageCancellation}>
                            {`${companyPenalties.companyTravelPenalty} ${currencySymbol}`}
                          </div>
                        )}
                      </Grid>
                    )}
                    {selectedPolicy === refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        <Field
                          title="%"
                          required
                          name="companyTravelPenaltyPercentage"
                          component={MDSelectField}
                          containerstyle={percentageSelectStyle}
                          onHandleChange={(values) => this.onSelectCompanyTravelPenalty(values)}
                          options={_.map(CUSTOM_PERCENTAGE_CANCELLATION, (type) => ({ id: type, value: type }))}
                        />
                        {companyPenalties && (
                          <div className={classes.percentageCancellation}>
                            {`${companyPenalties.companyTravelPenalty} ${currencySymbol}`}
                          </div>
                        )}
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <PhotoCameraIcon className={classes.gridIcon} />
                    <div className={classes.gridLabel}>{translations.t('shootings.photographerTravelRefund')}</div>
                    {selectedPolicy !== refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item>
                        {photographerRefunds && (
                          <div className={classes.percentageCancellation}>
                            {`${photographerRefunds.photographerTravelRefundPercentage} %`}
                          </div>
                        )}
                        {photographerRefunds && (
                          <div className={classes.percentageCancellation}>
                            {`${photographerRefunds.photographerTravelRefund} ${currencySymbol}`}
                          </div>
                        )}
                      </Grid>
                    )}
                    {selectedPolicy === refundAndPenaltyPolicy.CUSTOM && (
                      <Grid item direction="column">
                        <Field
                          title="%"
                          required
                          name="photographerTravelRefundPercentage"
                          component={MDSelectField}
                          containerstyle={percentageSelectStyle}
                          onHandleChange={(values) => this.onSelectPhotographerTravelRefund(values)}
                          options={_.map(CUSTOM_PERCENTAGE_CANCELLATION, (type) => ({ id: type, value: type }))}
                        />
                        {photographerRefunds && (
                          <div className={classes.percentageCancellation}>
                            {`${photographerRefunds.photographerTravelRefund} ${currencySymbol}`}
                          </div>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                {selectedPolicy !== refundAndPenaltyPolicy.DEFAULT && (
                  <Grid container>
                    <Grid item xs={12} md={12}>
                      <Field
                        name="cancellationNotes"
                        component={MDTextInputField}
                        containerstyle={paddingField}
                        label={translations.t('shootings.cancellingNotes')}
                        placeholder={translations.t('shootings.cancellingNotesPlaceholder')}
                        multiline
                        rows="3"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <div className={classes.subtitle}>{translations.t('shootings.cancellingAuthorization')}</div>
                      <Field
                        name="authorization"
                        component={SelectableField}
                        containerstyle={paddingField}
                        placeholder={translations.t('shootings.cancellingAuthorizationPlaceholder')}
                        onLoadOptions={(username) => this.fetchUsersAuthorizedBy(username)}
                      />
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </>
          )}
          <MDButton
            title={translations.t('modals.continue')}
            backgroundColor="#5AC0B1"
            containerstyle={{
              marginTop: 50,
              marginBottom: 50,
            }}
            onClick={() => dispatch(submit('ShootingRescheduleForm'))}
          />
        </div>
      </>
    );
  }
}
ShootingRescheduleForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  ShootingRescheduleReduxForm: state.form.ShootingRescheduleForm,
  organizations: state.organizations,
  companies: state.companies,
  shooting: state.form.ShootingRescheduleForm.values,
});

export default _.flow([connect(mapStateToProps), withStyles(styles), reduxForm({ form: 'ShootingRescheduleForm', validate })])(
  ShootingRescheduleForm
);
