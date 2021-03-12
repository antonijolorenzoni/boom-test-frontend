import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProgressBarOverlay from 'components/LoadingProgressBar/ProgressBarOverlay';
import SpinnerOverlay from 'components/Spinner/SpinnerOverlay';
import { isMobileBrowser } from 'config/utils';
import * as UtilsActions from 'redux/actions/utils.actions';

export const FreeLayout: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UtilsActions.setIsAppMobile(isMobileBrowser()));
  }, [dispatch]);

  return (
    <>
      {children}
      <SpinnerOverlay />
      <ProgressBarOverlay />
    </>
  );
};
