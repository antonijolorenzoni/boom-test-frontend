import { withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, submit } from 'redux-form';
import translations from '../../translations/i18next';
import MDTextInputField from '../Forms/FormComponents/MDTextInput/MDTextInputField';
import MDButton from '../MDButton/MDButton';
import MDStarRateField from '../Forms/FormComponents/MDStarRateField/MDStarRateField';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = 'required';
  }
  return errors;
};

const PhotographersSearchBar = ({ classes, dispatch, onResetFilters }) => (
  <div className={classes.container}>
    <Field
      name="username"
      component={MDTextInputField}
      label={translations.t('forms.photographerEmail')}
      containerstyle={{ width: '20%', marginLeft: 20 }}
    />
    <Field
      name="firstName"
      component={MDTextInputField}
      label={translations.t('forms.firstName')}
      containerstyle={{ width: '20%', marginLeft: 20 }}
    />
    <Field
      name="lastName"
      component={MDTextInputField}
      label={translations.t('forms.lastName')}
      containerstyle={{ width: '20%', marginLeft: 20 }}
    />
    <Field
      name="address"
      component={MDTextInputField}
      label={translations.t('profile.city')}
      containerstyle={{ width: '20%', marginLeft: 20 }}
    />
    {/*
    /////////// TYPES BASED SEARCH COMMENTED WAITING FOR ENDPOINT IMPLEMENTATION
    <Field
      name="types"
      title={translations.t('profile.photographyTypes')}
      component={MDSelectMultipleField}
      options={_.map(photographyTypesOptions, (option, index) => ({ id: index, value: translations.t(`photoTypes.${option.type }`)}))}
      InputProps={{
        containerstyle: {
          width: '100%',
        },
      }}
      containerstyle={{ width: '20%', marginLeft: 20 }}
    />
    */}
    <Field
      name="minScore"
      component={MDStarRateField}
      title={translations.t('profile.rating')}
      titleStyle={{ fontSize: 12, color: 'gray', paddingTop: 10, marginBottom: 0, fontWeight: 'normal' }}
      starContainerStyle={{ minWidth: 240, marginLeft: 20 }}
      starStyle={{ height: 'auto', marginTop: -8 }}
    />
    <MDButton
      backgroundColor="#5AC0B1"
      title={translations.t('forms.search')}
      containerstyle={{ marginLeft: 40, width: 200, marginBottom: 20 }}
      onClick={() => dispatch(submit('PhotographersSearchBar'))}
      icon={<SearchIcon style={{ color: 'white', marginLeft: 20 }} />}
    />
    <MDButton
      title={translations.t('forms.reset')}
      containerstyle={{ marginLeft: 40, marginBottom: 20 }}
      onClick={() => {
        dispatch(reset('PhotographersSearchBar'));
        onResetFilters();
      }}
      icon={<CloseIcon style={{ color: 'white', marginLeft: 10 }} />}
    />
  </div>
);

export default connect()(
  withStyles(styles)(
    reduxForm({
      form: 'PhotographersSearchBar',
      validate,
    })(PhotographersSearchBar)
  )
);
