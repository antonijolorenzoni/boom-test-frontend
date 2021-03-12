import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const TextInput = styled.input.attrs({ type: 'text' })`
  border: none;
  outline: none;
  width: 100%;
  padding-left: 37px;
  padding-bottom: 5px;
  padding-right: 22px;
  font-size: 13px;
  box-shadow: 0 1px 0px 0px #a3abb1;

  &:hover,
  &:focus {
    box-shadow: 0 1.2px 0px 0px #a3abb1;
  }
`;

export { Wrapper, TextInput };
