import React from 'react';
import { Overlay } from './styles';
import { BoomSpinner } from '../Spinner/BoomSpinner';

interface Props {
  overlayColor?: string;
  spinnerColor?: string;
  logoColor?: string;
  spinnerBackgroundColor?: string;
}

export const BoomLoadingOverlay: React.FC<Props> = ({
  overlayColor = 'rgba(255, 255, 255, 0.9)',
  spinnerColor = '#1D1D1D',
  logoColor = '#1D1D1D',
  spinnerBackgroundColor = '#f2f2f2',
}) => (
  <Overlay style={{ backgroundColor: overlayColor }}>
    <BoomSpinner logoColor={logoColor} spinnerColor={spinnerColor} backgroundColor={spinnerBackgroundColor} />
  </Overlay>
);
