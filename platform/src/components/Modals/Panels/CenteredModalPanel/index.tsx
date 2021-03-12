import React from 'react';
import styled from 'styled-components';

const CenteredPanel = styled.div`
  display: flex;
  justify-content: column;
  align-items: center;
`;

export const CenteredModalPanel: React.FC = ({ children }) => <CenteredPanel>{children}</CenteredPanel>;
