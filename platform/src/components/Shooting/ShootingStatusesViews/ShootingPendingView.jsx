//
// ──────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: V I E W   F O R   P E N D I N G   S H O O T I N G S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, withStyles, Divider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, submit } from 'redux-form';
import translations from '../../../translations/i18next';
import SelectManualPhotographerForm from '../../Forms/ReduxForms/Shootings/SelectManualPhotographerForm';
import MDButton from '../../MDButton/MDButton';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import AbilityProvider from '../../../utils/AbilityProvider';
import Permission from '../../Permission/Permission';
import RefundItemRow from '../../Invoicing/RefundItemRow';

const styles = (theme) => ({
  deadlineText: {
    color: 'white',
    padding: 20,
    fontSize: '1em',
    fontWeight: 'bold',
  },
  deadlineBox: {
    border: '2px solid white',
    borderRadius: 4,
    margin: '15px 20px 15px 0px',
    padding: '8px 15px',
    width: 65,
  },
  deadlineTime: {
    color: 'white',
    margin: 0,
  },
  revokeButton: {
    minHeight: 0,
    height: 22,
    padding: 0,
    '&:hover, &:focus': {
      backgroundColor: 'transparent',
    },
  },
  revokeSpan: {
    fontSize: '0.7em',
    marginLeft: 6,
    marginTop: 2,
    fontWeight: 'bolder',
    color: '#80888d',
  },
  photographerContainer: {
    padding: 20,
  },
});

const ShootingPendingView = ({
  shooting: { pricingPackage, refund },
  onDeleteRefund,
  onEditRefund,
  classes,
  dispatch,
  onAssignPhotographer,
  isBoom,
}) => (
  <React.Fragment>
    {isBoom && (
      <div>
        <h3 style={{ margin: 0 }}>{translations.t('forms.photographerTravelExpenses')}</h3>
        <RefundItemRow
          currency={pricingPackage && pricingPackage.currency ? pricingPackage.currency : '€'}
          amount={refund}
          onDelete={() => onDeleteRefund()}
          onEditRefund={(amount) => onEditRefund(amount)}
        />
        <Divider />
        <Permission
          do={[PERMISSIONS.ASSIGN]}
          on={PERMISSION_ENTITIES.SHOOTING}
          abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
        >
          <div style={{ marginTop: 20 }}>
            <Grid item xs={12} md={12} style={{ margin: 'auto' }}>
              <Paper className={classes.photographerContainer}>
                <h4 style={{ marginTop: 0 }}>{translations.t('shootings.selectPhotographer')}</h4>
                <SelectManualPhotographerForm
                  currency={_.get(pricingPackage, 'currency.symbol', '€')}
                  onSubmit={(photographerData) => onAssignPhotographer(photographerData)}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={12} style={{ margin: 'auto' }}>
              <div>
                <MDButton
                  title={translations.t('forms.save')}
                  backgroundColor="#5AC0B1"
                  containerstyle={{ marginTop: 20 }}
                  onClick={() => dispatch(submit('SelectManualPhotographerForm'))}
                />
              </div>
            </Grid>
          </div>
        </Permission>
      </div>
    )}
  </React.Fragment>
);

export default _.flow([
  withStyles(styles),
  connect(),
  reduxForm({
    form: 'SelectPhotographer',
  }),
])(ShootingPendingView);
