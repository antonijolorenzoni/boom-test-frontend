import { withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, submit } from 'redux-form';
import translations from '../../translations/i18next';
import MDTextInputField from '../Forms/FormComponents/MDTextInput/MDTextInputField';
import MDButton from '../MDButton/MDButton';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'required';
  }
  return errors;
};

const ListSearchBar = ({ classes, dispatch, onResetFilters, searchFieldLabel }) => (
  <div className={classes.container}>
    <Field name="name" component={MDTextInputField} label={searchFieldLabel || translations.t('forms.name')} />
    <MDButton
      backgroundColor="#5AC0B1"
      title={translations.t('forms.search')}
      containerstyle={{ marginLeft: 40, width: 200, marginBottom: 20 }}
      onClick={() => dispatch(submit('ListSearchBar'))}
      icon={<SearchIcon style={{ color: 'white', marginLeft: 20 }} />}
    />
    <MDButton
      title={translations.t('forms.reset')}
      containerstyle={{ marginLeft: 40, marginBottom: 20 }}
      onClick={() => {
        dispatch(reset('ListSearchBar'));
        onResetFilters();
      }}
      icon={<CloseIcon style={{ color: 'white', marginLeft: 10 }} />}
    />
  </div>
);

export default connect()(
  withStyles(styles)(
    reduxForm({
      form: 'ListSearchBar',
      validate,
    })(ListSearchBar)
  )
);
