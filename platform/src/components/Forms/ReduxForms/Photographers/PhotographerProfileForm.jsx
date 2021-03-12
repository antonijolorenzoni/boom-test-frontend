import { Divider, withStyles } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, reduxForm, submit } from 'redux-form';
import { fetchGoogleAddressDetails, onFetchGooglePlacesOptions } from '../../../../api/instances/googlePlacesInstance';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';

const validate = (values) => {
  const errors = {};
  if (!values.shortBio) {
    errors.shortBio = translations.t('forms.required');
  }
  if (!values.addressSelected) {
    errors.addressSelected = translations.t('forms.required');
  }
  return errors;
};

const styles = () => ({
  title: {
    margin: 0,
    marginTop: 20,
  },
  subtitle: {
    margin: 0,
    fontWeight: '100',
    marginBottom: 20,
    lineHeight: '30px',
  },
  headerTitle: {
    marginLeft: 20,
  },
  homeIcon: {
    marginRight: 10,
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

const uuidv4 = require('uuid/v4');

let googleSessionToken = uuidv4();
class PhotographerProfileForm extends React.Component {
  onFetchGoogleAddress = async (address) => {
    try {
      const addressa = await onFetchGooglePlacesOptions(address, googleSessionToken);
      return addressa;
    } catch (error) {
      return [];
    }
  };

  async onFetchGoogleAddressDetails(address, dtoField, formField) {
    const { dispatch } = this.props;
    try {
      const addressDetails = await fetchGoogleAddressDetails(address, googleSessionToken);
      const selectedAddress = {
        value: addressDetails,
        label: _.get(addressDetails, 'formattedAddress'),
      };
      dispatch(change('PhotographerProfileForm', formField, selectedAddress));
      dispatch(change('PhotographerProfileForm', dtoField, addressDetails));
      googleSessionToken = uuidv4(); // reset session token
    } catch (error) {
      dispatch(change('PhotographerProfileForm', dtoField, null));
      dispatch(change('PhotographerProfileForm', formField, null));
    }
  }

  render() {
    const { classes, dispatch } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <h4 style={{ margin: 0, marginBottom: 10 }}>{translations.t('forms.shortBio')}</h4>
          <h4 className={classes.subtitle}>{translations.t('forms.shortBioExplanation')}</h4>
          <Field
            name="shortBio"
            component={MDTextInputField}
            placeholder={translations.t('profile.insertBio')}
            label={translations.t('profile.bio')}
            multiline
            rows="3"
            containerstyle={{ width: '100%' }}
          />
          <Divider />
          <h4 style={{ margin: 0, marginTop: 10, marginBottom: 10 }}>{translations.t('forms.baseHouse')}</h4>
          <h4 className={classes.subtitle}>{translations.t('forms.baseHouseExplanation')}</h4>
          <Field
            name="addressSelected"
            component={SelectableField}
            placeholder={translations.t('forms.insertAddress')}
            onLoadOptions={(address) => this.onFetchGoogleAddress(address)}
            onSelect={(address) => this.onFetchGoogleAddressDetails(address, 'address', 'addressSelected')}
            required
          />
          <Divider style={{ marginTop: 20, marginBottom: 20 }} />
          <MDButton
            title={translations.t('forms.save')}
            backgroundColor="#5AC0B1"
            containerstyle={{ marginBottom: 20 }}
            onClick={() => dispatch(submit('PhotographerProfileForm'))}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

PhotographerProfileForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => ({
  form: state.form.PhotographerProfileForm,
  companies: state.companies,
});

export default _.flow([
  connect(mapStateToProps),
  reduxForm({
    form: 'PhotographerProfileForm',
    validate,
    destroyOnUnmount: false,
  }),
  withStyles(styles),
])(PhotographerProfileForm);
