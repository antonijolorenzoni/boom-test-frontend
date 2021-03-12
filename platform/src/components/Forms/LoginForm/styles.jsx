import styled from 'styled-components';

const LoginFormLabel = styled.label`
  font-weight: 700;
  letter-spacing: 1;
  color: #80888f;
  font-size: 14px;
  text-transform: uppercase;
`;

const LoginFormInput = styled.input`
  margin: 8px 0 3px 0;
  padding: 10px 14px;
  width: 100%;
  box-sizing: border-box;
  border: unset;
`;

const ErrorLabel = styled.div`
  color: #ff0000;
  font-size: 10px;
  height: 16px;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

export { LoginFormLabel, LoginFormInput, ErrorLabel };
