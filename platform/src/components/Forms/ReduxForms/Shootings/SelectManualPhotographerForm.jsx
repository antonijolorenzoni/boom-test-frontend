import { withStyles } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as PhotographersActions from 'redux/actions/photographers.actions';
import translations from 'translations/i18next';
import SelectableField from 'components/Forms/FormComponents/SelectableInput/SelectableField';
import MDTextInputField from 'components/Forms/FormComponents/MDTextInput/MDTextInputField';
import * as PhotographersAPI from 'api/photographersAPI';

const validate = (values) => {
  const errors = {};
  if (!values.photographer) {
    errors.photographer = translations.t('forms.required');
  }
  if (!values.travelExpenses) {
    errors.travelExpenses = translations.t('forms.required');
  }
  if (values.travelExpenses < 0) {
    errors.travelExpenses = translations.t('forms.travelExpensivePositiveValue');
  }
  return errors;
};

const styles = (theme) => ({
  headerTitle: {
    marginLeft: 20,
  },
  homeIcon: {
    marginRight: 10,
  },
  title: {
    color: '#000000',
    fontSize: '1.1em',
  },
  subTitle: {
    color: '#BBBBBB',
    fontSize: '0.7em',
    marginTop: -30,
    marginBottom: 40,
  },
  subTitleGray: {
    color: '#80888d',
    fontSize: '0.8em',
    fontWeight: 'bolder',
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

class SelectManualPhotographerForm extends React.Component {
  async fetchPhotographersOptions(username) {
    const { dispatch, photographersToExclude } = this.props;
    dispatch(PhotographersActions.setPhotographersFilter('activated', true));
    dispatch(PhotographersActions.setPhotographersFilter('username', username));

    const response = await PhotographersAPI.fetchPhotographers({ freeText: username, enabled: true });
    const photographers = _.get(response, 'data.content');

    const toOption = (photographer) => ({
      value: photographer.id,
      label: `${photographer.user.firstName} ${photographer.user.lastName} - ${photographer.user.username}`,
    });

    return !_.isUndefined(photographersToExclude)
      ? photographers.filter((photographer) => !photographersToExclude.includes(photographer.id)).map(toOption)
      : photographers.map(toOption);
  }

  render() {
    const { classes, currency } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <h3 className={classes.subTitle}>{translations.t('shootings.choosePhotographerToInvite')}</h3>
        <h3 className={classes.subTitleGray}>{translations.t('shootings.searchPhotographer')}</h3>
        <Field
          name="photographer"
          component={SelectableField}
          placeholder={translations.t('shootings.placeholderSearchPhotographer')}
          containerstyle={{ marginBottom: 15 }}
          onLoadOptions={(name) => this.fetchPhotographersOptions(name)}
          required
        />
        <h3 className={classes.subTitleGray}>{translations.t('shootings.travelExpenses')}</h3>
        <Field
          name="travelExpenses"
          component={MDTextInputField}
          label={`${translations.t('forms.invoiceItemValue')} ${currency}`}
          min={0}
          type="number"
          required
          showErrorLabel
        />
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.form.SelectManualPhotographerForm,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'SelectManualPhotographerForm',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(SelectManualPhotographerForm);
