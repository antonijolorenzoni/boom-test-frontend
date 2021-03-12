import { Button, withStyles } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';

import translations from '../../../../translations/i18next';
import MDTextInputField from '../MDTextInput/MDTextInputField';

const styles = (theme) => ({
  container: {
    marginTop: 20,
  },
  textWithLeftIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 8,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    color: '#80888d',
  },
  text: {
    margin: 0,
    color: '#80888d',
  },
});

const FieldList = (props) => {
  const { classes, fields, name, type, label, placeholder, containerstyle } = props;

  return (
    <React.Fragment>
      <ul style={{ margin: 0, padding: 0 }}>
        {fields.map((field, index) => (
          <li style={{ display: 'contents' }}>
            <Field
              name={`${name}-${index}`}
              type={type}
              component={MDTextInputField}
              label={`${label} ${index + 1}`}
              placeholder={placeholder}
              containerStyle={{
                marginBottom: 10,
                ...containerstyle,
              }}
            />
          </li>
        ))}
      </ul>
      <Button className={classes.textWithLeftIcon} onClick={() => fields.push()}>
        <AddCircleOutlineIcon className={classes.leftIcon} />
        <h5 className={classes.text}>{translations.t('general.add')}</h5>
      </Button>
    </React.Fragment>
  );
};

FieldList.getDefaultProps = {
  type: 'text',
  placeholder: '',
  containerStyle: {},
};

FieldList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  containerStyle: PropTypes.shape({}),
};

export default withStyles(styles)(FieldList);
