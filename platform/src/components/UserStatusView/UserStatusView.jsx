import { withStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import EnabledIcon from '@material-ui/icons/CheckCircle';
import EmailIcon from '@material-ui/icons/Email';
import DisabledIcon from '@material-ui/icons/HighlightOff';
import React from 'react';
import MDButton from '../MDButton/MDButton';
import translations from '../../translations/i18next';

const styles = (theme) => ({
  formContainer: {
    margin: 20,
    marginTop: 20,
  },
  title: {
    margin: 0,
    marginTop: 20,
  },
  headerTitle: {
    marginLeft: 20,
  },
  subtitle: {
    margin: 0,
    fontWeight: '100',
    marginBottom: 20,
  },
  enabledText: {
    color: '#66c0b0',
    margin: 0,
  },
  disabledText: {
    color: 'red',
    margin: 0,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusTag: {
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
  },
});

const UserStatusView = ({ isEnabled, title, onResendConfirmationEmail, classes }) => (
  <div className={classes.statusContainer}>
    <Divider />
    <h2 className={classes.title}>{title || translations.t('forms.userStatus')}</h2>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
      <Chip
        className={classes.statusTag}
        color={isEnabled ? 'primary' : 'secondary'}
        label={isEnabled ? translations.t('users.enabled') : translations.t('users.disabled')}
        icon={isEnabled ? <EnabledIcon /> : <DisabledIcon />}
      />
      {!isEnabled && onResendConfirmationEmail && (
        <MDButton
          title={translations.t('users.resendConfirmationEmail')}
          backgroundColor="#5AC0B1"
          containerstyle={{ marginTop: 0 }}
          icon={<EmailIcon style={{ color: 'white', marginLeft: 10 }} />}
          onClick={() => onResendConfirmationEmail()}
        />
      )}
    </div>
  </div>
);

export default withStyles(styles)(UserStatusView);
