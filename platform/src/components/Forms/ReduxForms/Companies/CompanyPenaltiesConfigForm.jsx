import { MuiThemeProvider, Paper, withStyles } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import { COMPANY_PENALTIES_HOURS, COMPANY_PENALTIES_PERCENTAGES } from '../../../../config/consts';

const styles = (theme) => ({
  innerContainer: {
    marginTop: 7,
    width: '100%',
  },
  selectorsForm: {
    padding: 20,
    width: '50%',
  },
  selectorsTitle: {
    paddingTop: '20px',
    paddingLeft: '20px',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#66c0b0' },
    secondary: { main: '#CC0033' },
  },
  typography: {
    useNextVariants: true,
  },
});

const CompanyPenaltiesConfigForm = ({ dispatch, onResetConfig, classes }) => {
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Paper square className={classes.innerContainer}>
          <h3 className={classes.selectorsTitle}>{translations.t('company.maxPenaltiesConfig').toUpperCase()}</h3>
          <div style={{ display: 'flex' }}>
            <Field
              title={translations.t('forms.penaltyHoursThreshold')}
              name="maxPenaltyHoursThreshold"
              component={MDSelectField}
              className={classes.selectorsForm}
              containerstyle={{ marginTop: 0, marginBottom: 0 }}
              options={_.map(COMPANY_PENALTIES_HOURS, (type) => ({
                id: type,
                value: type.toString(),
              }))}
            />
            <Field
              title={translations.t('forms.penaltyAmountPercentage')}
              name="maxPenaltyAmountPercentage"
              component={MDSelectField}
              className={classes.selectorsForm}
              containerstyle={{ marginTop: 0, marginBottom: 0 }}
              options={_.map(COMPANY_PENALTIES_PERCENTAGES, (type) => ({
                id: type,
                value: type.toString(),
              }))}
            />
            <Field
              title={translations.t('forms.travelPenaltyAmountPercentage')}
              name="maxTravelPenaltyAmountPercentage"
              component={MDSelectField}
              className={classes.selectorsForm}
              containerstyle={{ marginTop: 0, marginBottom: 0 }}
              options={_.map(COMPANY_PENALTIES_PERCENTAGES, (type) => ({
                id: type,
                value: type.toString(),
              }))}
            />
          </div>
          <h3 className={classes.selectorsTitle}>{translations.t('company.minPenaltiesConfig').toUpperCase()}</h3>
          <div style={{ display: 'flex' }}>
            <Field
              title={translations.t('forms.penaltyHoursThreshold')}
              name="minPenaltyHoursThreshold"
              component={MDSelectField}
              className={classes.selectorsForm}
              containerstyle={{ marginTop: 0, marginBottom: 0 }}
              options={_.map(COMPANY_PENALTIES_HOURS, (type) => ({
                id: type,
                value: type.toString(),
              }))}
            />
            <Field
              title={translations.t('forms.penaltyAmountPercentage')}
              name="minPenaltyAmountPercentage"
              component={MDSelectField}
              className={classes.selectorsForm}
              containerstyle={{ marginTop: 0, marginBottom: 0 }}
              options={_.map(COMPANY_PENALTIES_PERCENTAGES, (type) => ({
                id: type,
                value: type.toString(),
              }))}
            />
            <Field
              title={translations.t('forms.travelPenaltyAmountPercentage')}
              name="minTravelPenaltyAmountPercentage"
              component={MDSelectField}
              className={classes.selectorsForm}
              containerstyle={{ marginTop: 0, marginBottom: 0 }}
              options={_.map(COMPANY_PENALTIES_PERCENTAGES, (type) => ({
                id: type,
                value: type.toString(),
              }))}
            />
          </div>
        </Paper>
        <div style={{ display: 'flex' }}>
          <MDButton
            title={translations.t('forms.save')}
            className="gradient-button"
            containerstyle={{ padding: 10, width: '50%' }}
            backgroundColor="#5AC0B1"
            onClick={() => dispatch(submit('CompanyPenaltiesConfigForm'))}
          />
          <MDButton
            title="Reset"
            containerstyle={{ padding: 10, width: '50%' }}
            className="gradient-button"
            onClick={() => onResetConfig()}
          />
        </div>
      </MuiThemeProvider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  CompanyPenaltiesConfigForm: state.form.CompanyPenaltiesConfigForm,
});

export default connect(mapStateToProps)(
  withStyles(styles)(
    reduxForm({
      form: 'CompanyPenaltiesConfigForm',
    })(CompanyPenaltiesConfigForm)
  )
);
