import { Divider, withStyles } from '@material-ui/core';
import React from 'react';
import translations from '../../translations/i18next';

const styles = () => ({
  corpus: {
    color: 'black',
    fontWeight: '100',
    margin: 0,
    marginTop: -30,
    fontSize: 17,
  },
  description: {
    color: 'black',
    fontWeight: '100',
    margin: 0,
  },
  title: {
    fontWeight: 'bold',
    margin: 0,
    marginTop: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: '100',
    margin: 0,
    marginTop: 20,
    textAlign: 'right',
  },
});

const RatingExplanationView = ({ classes }) => (
  <div style={{ marginTop: 10 }}>
    <h4 className={classes.corpus}>{translations.t('photographers.ratingDescription')}</h4>
    <h4 className={classes.corpus} style={{ marginTop: 10 }}>
      {translations.t('photographers.ratingDescription2')}
    </h4>
    <h4 className={classes.title}>{translations.t('shootingBoomEvaluations.composition')}</h4>
    <h5 className={classes.description}>{translations.t('shootingBoomEvaluationsDescription.composition')}</h5>
    <Divider className={classes.divider} />
    <h4 className={classes.title}>{translations.t('shootingBoomEvaluations.technique')}</h4>
    <h5 className={classes.description}>{translations.t('shootingBoomEvaluationsDescription.technique')}</h5>
    <Divider className={classes.divider} />
    <h4 className={classes.title}>{translations.t('shootingBoomEvaluations.accuracy')}</h4>
    <h5 className={classes.description}>{translations.t('shootingBoomEvaluationsDescription.accuracy')}</h5>
    <Divider className={classes.divider} />
    <h4 className={classes.title}>{translations.t('shootingBoomEvaluations.equipment')}</h4>
    <h5 className={classes.description}>{translations.t('shootingBoomEvaluationsDescription.equipment')}</h5>
    <Divider className={classes.divider} />
    <h6 className={classes.subtitle}>{translations.t('photographers.ratingDisclaimer')}</h6>
  </div>
);

export default withStyles(styles)(RatingExplanationView);
