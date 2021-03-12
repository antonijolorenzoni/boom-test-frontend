import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f5f6f7;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  padding: 5px 10px;
  height: 40px;
  justify-content: space-between;

  & :nth-child(1) {
    display: flex;
    align-items: center;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
`;

export { Wrapper, IconsWrapper };
