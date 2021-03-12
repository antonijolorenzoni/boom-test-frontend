import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { BoomLoadingOverlay } from 'ui-boom-components';

const SpinnerOverlay = () => {
  const isVisible = useSelector((state) => state.utils.spinner.isVisible);

  useLayoutEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    }

    return () => (document.body.style.overflow = '');
  }, [isVisible]);

  return isVisible && <BoomLoadingOverlay overlayColor="rgba(255, 255, 255, 0.6)" />;
};

export default SpinnerOverlay;
