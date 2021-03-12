import { useDispatch } from 'react-redux';
import { showModal } from 'redux/actions/modals.actions';
import { v4 } from 'uuid';

export const useAlertModal = () => {
  const dispatch = useDispatch();
  const showAlert = (message: string, type: 'error' | 'success') => {
    const modalId = `${type === 'error' ? 'ERROR' : 'SUCCESS'}-ALERT-${v4()}`;
    dispatch(
      showModal(modalId, {
        modalType: type === 'error' ? 'ERROR_ALERT' : 'SUCCESS_ALERT',
        modalProps: {
          message,
        },
      })
    );
  };
  return showAlert;
};
