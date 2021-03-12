import React from 'react';
import { connect } from 'react-redux';

import translations from '../../../translations/i18next';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';

import ShootingBulkUploadView from '.';

const ShootingBulkUploadViewContainer = ({ toggleSpinner, onUploadFinish, onError, onCompleteInsert }) => (
  <ShootingBulkUploadView
    toggleSpinner={toggleSpinner}
    onUploadFinish={onUploadFinish}
    onError={onError}
    onCompleteInsert={onCompleteInsert}
  />
);

const mapDispatchToProps = (dispatch) => ({
  onUploadFinish: () =>
    dispatch(
      ModalsActions.showModal('BULK_UPLOAD_SUCCESS', {
        modalType: 'SUCCESS_ALERT',
        modalProps: {
          message: translations.t('shootings.bulkInsertSuccess'),
        },
      })
    ),
  onError: (message) =>
    dispatch(
      ModalsActions.showModal('BULK_UPLOAD_ERROR', {
        modalType: 'ERROR_ALERT',
        modalProps: {
          message,
        },
      })
    ),
  toggleSpinner: (toggle) => dispatch(UtilsActions.setSpinnerVisibile(toggle)),
});

export default connect(null, mapDispatchToProps)(ShootingBulkUploadViewContainer);
