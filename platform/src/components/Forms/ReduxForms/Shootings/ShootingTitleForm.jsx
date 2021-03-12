import { Grid, withStyles } from '@material-ui/core';
import ShootingNameIcon from '@material-ui/icons/BookmarkBorder';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';

const styles = (theme) => ({
  container: {
    marginTop: 0,
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
});

const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = 'required';
  }
  return errors;
};

const ShootingTitleForm = ({ classes, dispatch }) => (
  <div className={classes.container}>
    <Grid container>
      <div className={classes.sectionContainer}>
        <ShootingNameIcon className={classes.sectionIcon} />
        <h3 style={{ margin: 0 }}>{translations.t('forms.shootingName').toUpperCase()}</h3>
      </div>
      <Grid item xs={12} md={12}>
        <Field
          name="title"
          component={MDTextInputField}
          placeholder={translations.t('forms.shootingNameDescription')}
          label={translations.t('forms.name')}
        />
      </Grid>
      <Grid item xs={6} md={12}>
        <MDButton
          title={translations.t('forms.save')}
          backgroundColor="#5AC0B1"
          containerstyle={{ marginLeft: 20 }}
          onClick={() => dispatch(submit('ShootingTitleForm'))}
        />
      </Grid>
    </Grid>
  </div>
);

export default _.flow([
  connect(),
  withStyles(styles),
  reduxForm({
    form: 'ShootingTitleForm',
    validate,
  }),
])(ShootingTitleForm);
