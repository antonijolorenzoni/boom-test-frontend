import styled from 'styled-components';

const LoginSelectionWrapper = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;

  @media screen and (max-width: 1080px) {
    margin-top: 40px;
    margin-bottom: 20px;
  }
`;

const VerticalDivider = styled.div`
  margin: 1px 8px;
  border-left: 1px solid #ffffff;
`;

export { LoginSelectionWrapper, VerticalDivider };
