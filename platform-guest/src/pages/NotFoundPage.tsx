import React from 'react';
import styled from 'styled-components';
import { Typography } from 'ui-boom-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #5ac0b1;
  color: #ffffff;
`;

const NotFoundPage: React.FC = () => {
  return (
    <Wrapper>
      <Typography variantName="title1" style={{ color: '#ffffff', fontSize: 40 }}>
        :(
      </Typography>
    </Wrapper>
  );
};

export { NotFoundPage };
