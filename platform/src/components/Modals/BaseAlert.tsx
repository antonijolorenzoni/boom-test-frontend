//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: B A S E   A L E R T   C O M P O N E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import * as ModalActions from '../../redux/actions/modals.actions';
import { SHOOTING_STATES_WIDER_VIEW } from '../../config/consts';
import OperationalView from '../OperationalView/OperationalView';
import MDErrorAlert from './MDAlerts/MDErrorAlert';
import MDInfoAlert from './MDAlerts/MDInfoAlert';
import MDSuccessAlert from './MDAlerts/MDSuccessAlert';
import MDWarningAlert from './MDAlerts/MDWarningAlert';
import MDDialog from './MDDialogs/MDDialog';

const alertComponents: any = {
  SUCCESS_ALERT: MDSuccessAlert,
  ERROR_ALERT: MDErrorAlert,
  INFO_ALERT: MDInfoAlert,
  WARNING_ALERT: MDWarningAlert,
  MODAL_DIALOG: MDDialog,
  OPERATIONAL_VIEW: OperationalView,
};

/*
 * This component will render the correct modal and forward it all the props
 * depending on the modalType variable
 */

const BaseAlert = ({ modals, shooting, dispatch, isBoom }: any) => {
  if (!_.size(modals)) {
    return null;
  }
  const components = _.map(modals, (modal) => {
    if (!modal.id || !modal.data) {
      return null;
    }

    const { modalType, modalProps } = modal.data;
    const Component = alertComponents[modalType];
    const widthByShootingState = _.includes(SHOOTING_STATES_WIDER_VIEW, _.get(shooting, 'state')) ? '75vw' : '50vw';
    return (
      <Component
        key={modal.id}
        {...modalProps}
        widthByShootingState={isBoom ? widthByShootingState : '50vw'}
        dispatch={dispatch}
        hideModal={() => dispatch(ModalActions.hideModal(modal.id))}
      />
    );
  });
  return _.size(components) ? components : null;
};

export default connect((state: any) => ({
  modals: state.modals.data,
  shooting: _.get(state, 'shootings.selectedShooting'),
  isBoom: state.user.data.isBoom,
}))(BaseAlert as any);
