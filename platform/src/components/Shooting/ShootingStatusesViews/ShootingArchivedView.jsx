//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: V I E W   F O R   A R C H I V E D   S H O O T I N G S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import translations from '../../../translations/i18next';

const styles = (theme) => ({
  errorIcon: {
    color: '#cc3300',
    marginRight: 10,
  },
});

const ShootingArchivedView = ({ shooting, dispatch, classes }) => (
  <React.Fragment>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ErrorIcon className={classes.errorIcon} />
      <h4 style={{ color: '#cc3300' }}>{translations.t('shootings.shootingMarkedAsArchived')}</h4>
    </div>
  </React.Fragment>
);

export default _.flow([withStyles(styles), connect()])(ShootingArchivedView);
