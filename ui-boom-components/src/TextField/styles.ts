import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputText = styled.input`
  border: 1px solid #acb2b7;
  box-sizing: border-box;
  border-radius: 3px;
  order: 2;

  font-size: 13px;
  line-height: 18px;
  padding: 5px 9px;

  &[required] + div > label:after {
    content: '*';
  }

  &[disabled] {
    background-color: #f2f2f2;
  }
`;

export { Wrapper, InputText };
