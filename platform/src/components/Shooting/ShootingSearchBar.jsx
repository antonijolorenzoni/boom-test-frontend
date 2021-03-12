//
// ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G S   S E A R C H B A R   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, submit } from 'redux-form';
import * as ModalsActions from '../../redux/actions/modals.actions';
import translations from '../../translations/i18next';
import MDDatePickerField from '../Forms/FormComponents/MDDatePicker/MDDatePickerField';
import MDSelectMultipleField from '../Forms/FormComponents/MDSelectMultipleField/MDSelectMultipleField';
import MDTextInputField from '../Forms/FormComponents/MDTextInput/MDTextInputField';
import MDButton from '../MDButton/MDButton';
import { OrderStatusLegend } from 'components/OrderStatusLegend';
import { DELIVERY_STATUS } from '../../config/consts';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'required';
  }
  return errors;
};

class ShootingSearchBar extends React.Component {
  showStatusInformationModal() {
    const { dispatch, shootingStatuses } = this.props;
    dispatch(
      ModalsActions.showModal('SHOOTING_STATUSES_LEGEND', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('shootings.shootingStatusesLegend'),
          content: <OrderStatusLegend statuses={shootingStatuses} />,
          cancelText: translations.t('forms.close'),
        },
      })
    );
  }

  render() {
    const { classes, dispatch, onResetFilters, shootingStatesOptions, isBoom } = this.props;

    return (
      <div className={classes.container}>
        <Field
          name="search"
          component={MDTextInputField}
          label={translations.t('forms.search')}
          containerstyle={{ width: '20%', marginLeft: 20 }}
        />
        <Field
          name="shootingDate"
          component={MDDatePickerField}
          clearable
          containerstyle={{ marginLeft: 20 }}
          label={translations.t('calendar.shootingDate')}
        />
        <Field
          name="states"
          title={translations.t('shootings.shotingStatus')}
          component={MDSelectMultipleField}
          options={shootingStatesOptions}
          InputProps={{
            containerstyle: {
              width: '100%',
            },
          }}
          containerstyle={{ width: '20%', marginLeft: 20 }}
        />
        <IconButton style={{ marginBottom: 8 }} onClick={() => this.showStatusInformationModal()}>
          <InfoIcon />
        </IconButton>
        {isBoom && (
          <Field
            name="deliveryStatuses"
            title={translations.t('shootings.delivery')}
            component={MDSelectMultipleField}
            options={[
              { id: DELIVERY_STATUS.DELIVERED, value: translations.t('shootings.deliveryStatusSuccess') },
              { id: DELIVERY_STATUS.WAITING, value: translations.t('shootings.deliveryStatusWaiting') },
              { id: DELIVERY_STATUS.FAILED, value: translations.t('shootings.deliveryStatusFailed') },
            ]}
            InputProps={{
              containerstyle: {
                width: '100%',
              },
            }}
            containerstyle={{ width: '20%' }}
          />
        )}
        <MDButton
          backgroundColor="#5AC0B1"
          title={translations.t('forms.search')}
          containerstyle={{ marginLeft: 40, width: 200, marginBottom: 20 }}
          onClick={() => dispatch(submit('ShootingSearchBar'))}
          icon={<SearchIcon style={{ color: 'white', marginLeft: 20 }} />}
        />
        <MDButton
          title={translations.t('forms.reset')}
          containerstyle={{ marginLeft: 40, marginBottom: 20 }}
          onClick={() => {
            dispatch(reset('ShootingSearchBar'));
            onResetFilters();
          }}
          icon={<CloseIcon style={{ color: 'white', marginLeft: 10 }} />}
        />
      </div>
    );
  }
}

export default connect()(
  withStyles(styles)(
    reduxForm({
      form: 'ShootingSearchBar',
      validate,
    })(ShootingSearchBar)
  )
);
