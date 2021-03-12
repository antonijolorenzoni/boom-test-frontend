import React from 'react';
import AppHeader from './AppHeader';
import { FreeLayout } from './FreeLayout';
import { useScreen } from 'hook/useScreen';

export const HeaderLayout: React.FC = ({ children }) => {
  const { isMobile } = useScreen();
  return (
    <>
      <AppHeader />
      <div style={{ paddingTop: `${isMobile ? 56 : 64}px`, boxSizing: 'border-box', height: '100%' }}>
        <FreeLayout>{children}</FreeLayout>
      </div>
    </>
  );
};
