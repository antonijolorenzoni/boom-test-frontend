import { withStyles } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import translations from '../../translations/i18next';

const styles = (theme) => ({
  container: {
    flexDirection: 'row',
    display: 'flex',
    height: 20,
    marginTop: 25,
    marginBottom: 50,
  },
  linkTitle: {
    fontWeight: 100,
    margin: 0,
    marginLeft: 10,
    color: '#3f3f3f',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
});

const CompaniesNavigator = ({ onRootSelected, onLevelSelected, onHomeLevelSelected, classes, titles, rootLevel }) => (
  <div className={classes.container}>
    {onHomeLevelSelected && (
      <h2 className={classes.linkTitle} onClick={() => onHomeLevelSelected()}>
        {`${translations.t('header.companies')} /`}
      </h2>
    )}
    {rootLevel && !_.isEmpty(rootLevel) && (
      <h2
        className={classes.linkTitle}
        style={{ margin: 0, marginLeft: 10, marginRight: 10, color: '#3f3f3f' }}
        onClick={() => onRootSelected(rootLevel)}
      >
        {rootLevel.name}
      </h2>
    )}
    {_.map(titles, (company, key) => {
      return (
        <div key={key} style={{ display: 'flex' }}>
          <h2 style={{ fontWeight: 100, color: '#3f3f3f', margin: 0, marginLeft: onHomeLevelSelected && key === 0 ? 0 : 10 }}>/</h2>
          <h2
            onClick={() => onLevelSelected(company, key)}
            className={classes.linkTitle}
            key={key}
            style={{ margin: 0, marginLeft: 10, color: '#3f3f3' }}
          >
            {company.name}
          </h2>
        </div>
      );
    })}
  </div>
);

export default withStyles(styles)(CompaniesNavigator);
