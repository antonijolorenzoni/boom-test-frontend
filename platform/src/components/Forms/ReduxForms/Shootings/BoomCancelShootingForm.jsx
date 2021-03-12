import { Paper, Grid, withStyles, Button } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCameraOutlined';
import BusinessIcon from '@material-ui/icons/BusinessOutlined';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change, submit } from 'redux-form';
import * as ShootingsActions from '../../../../redux/actions/shootings.actions';
import * as UsersActions from '../../../../redux/actions/users.actions';
import { CUSTOM_PERCENTAGE_CANCELLATION } from '../../../../config/consts';
import { calculatePercentage } from '../../../../config/utils';
import translations from '../../../../translations/i18next';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';
import MDSelectView from '../../FormComponents/MDSelectField/MDSelectView';

const styles = {
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
  container: {
    marginTop: 35,
    marginLeft: 37,
    marginRight: 37,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 13,
    color: '#80888D',
    fontWeight: 500,
    marginLeft: 20,
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
    border: '2px solid',
  },
};

const validate = (values) => {
  const errors = {};
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

class BoomCancelShootingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPolicy: Object.keys(refundAndPenaltyPolicy)[0],
    };
  }

  async componentDidMount() {
    const { dispatch, shooting, photographer } = this.props;
    const penalties = await dispatch(ShootingsActions.fetchShootingCompanyPenalties(shooting));
    const refunds = await dispatch(ShootingsActions.fetchShootingPhotographerRefunds(shooting, photographer));
    dispatch(change('BoomCancelShootingForm', 'companyPenalties', penalties));
    dispatch(change('BoomCancelShootingForm', 'photographerRefunds', refunds));
  }

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
            dispatch(change('BoomCancelShootingForm', 'companyPenalties', penalties));
            dispatch(change('BoomCancelShootingForm', 'photographerRefunds', refunds));
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
            dispatch(change('BoomCancelShootingForm', 'companyPenalties', penalties));
            dispatch(change('BoomCancelShootingForm', 'photographerRefunds', refunds));
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
            dispatch(change('BoomCancelShootingForm', 'companyPenalties', penalties));
            dispatch(change('BoomCancelShootingForm', 'photographerRefunds', refunds));
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
    dispatch(change('BoomCancelShootingForm', 'companyPenalties.companyPenalty', companyPhotoshootPenalty));
    dispatch(change('BoomCancelShootingForm', 'companyPenalties.companyPenaltyPercentage', percentage));
  }

  onSelectPhotographerPhotoshootRefund(percentage) {
    const { dispatch, photographerEarning } = this.props;
    const photographerPhotoshootRefund = calculatePercentage(photographerEarning, parseInt(percentage, 10));
    dispatch(change('BoomCancelShootingForm', 'photographerRefunds.photographerRefund', photographerPhotoshootRefund));
    dispatch(change('BoomCancelShootingForm', 'photographerRefunds.photographerRefundPercentage', percentage));
  }

  onSelectCompanyTravelPenalty(percentage) {
    const { dispatch, travelExpenses } = this.props;
    const companyTravelPenalty = calculatePercentage(travelExpenses, parseInt(percentage, 10));
    dispatch(change('BoomCancelShootingForm', 'companyPenalties.companyTravelPenalty', companyTravelPenalty));
    dispatch(change('BoomCancelShootingForm', 'companyPenalties.companyTravelPenaltyPercentage', percentage));
  }

  onSelectPhotographerTravelRefund(percentage) {
    const { dispatch, travelExpenses } = this.props;
    const photographerTravelRefund = calculatePercentage(travelExpenses, parseInt(percentage, 10));
    dispatch(change('BoomCancelShootingForm', 'photographerRefunds.photographerTravelRefund', photographerTravelRefund));
    dispatch(change('BoomCancelShootingForm', 'photographerRefunds.photographerTravelRefundPercentage', percentage));
  }

  async fetchUsersAuthorizedBy(username) {
    const { dispatch, organizationId } = this.props;
    dispatch(UsersActions.setUsersFilter('enabled', true));
    dispatch(UsersActions.setUsersFilter('username', username));
    dispatch(UsersActions.resetUsersData());
    const users = await dispatch(UsersActions.fetchUsersByOrganizationId(organizationId));
    return _.map(users, (user) => ({ value: user.id, label: `${user.firstName} ${user.lastName} - ${user.username}` }));
  }

  render() {
    const { classes, dispatch, boomCancelShootingForm, onClose, currency } = this.props;

    const { selectedPolicy } = this.state;
    const companyPenalties = _.get(boomCancelShootingForm, 'values.companyPenalties');
    const photographerRefunds = _.get(boomCancelShootingForm, 'values.photographerRefunds');
    const currencySymbol = _.get(currency, 'symbol', '€');

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
          {translations.t('shootings.cancelShooting')}
        </div>
        <div className={classes.container}>
          <div
            style={{
              width: '30%',
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
                      <div className={classes.percentageCancellation}>{`${photographerRefunds.photographerRefund} ${currencySymbol}`}</div>
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
                      <div className={classes.percentageCancellation}>{`${photographerRefunds.photographerRefund} ${currencySymbol}`}</div>
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
                      <div className={classes.percentageCancellation}>{`${companyPenalties.companyTravelPenalty} ${currencySymbol}`}</div>
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
                      <div className={classes.percentageCancellation}>{`${companyPenalties.companyTravelPenalty} ${currencySymbol}`}</div>
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
                      <div className={classes.percentageCancellation}>{`${photographerRefunds.photographerTravelRefundPercentage} %`}</div>
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#000000',
              }}
            >
              {translations.t('shootings.onCancelShooting')}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                marginBottom: 50,
              }}
            >
              <Button className={classes.cancelBtn} variant="outlined" onClick={onClose}>
                {translations.t('modals.cancel').toUpperCase()}
              </Button>
              <Button className={classes.confirmBtn} variant="contained" onClick={() => dispatch(submit('BoomCancelShootingForm'))}>
                {translations.t('modals.ok').toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  boomCancelShootingForm: state.form.BoomCancelShootingForm,
  shooting: state.form.BoomCancelShootingForm.values,
});

export default connect(mapStateToProps)(
  withStyles(styles)(reduxForm({ form: 'BoomCancelShootingForm', validate })(BoomCancelShootingForm))
);
