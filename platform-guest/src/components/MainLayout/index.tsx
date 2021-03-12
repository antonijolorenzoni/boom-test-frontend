import React from 'react';
import { Header } from 'components/Header';

import { Content, Wrapper } from './styles';

export const MainLayout: React.FC<{ style?: React.CSSProperties }> = ({ children, style }) => {
  return (
    <Wrapper style={style}>
      <Header />
      <Content>{children}</Content>
    </Wrapper>
  );
};
