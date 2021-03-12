import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const WrapperField = styled.div`
  border: 1px solid #acb2b7;
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const InputText = styled.input`
  font-size: 13px;
  line-height: 18px;
  width: 100%;
  border: none;
  padding: 5px 30px 5px 9px;
  border-radius: 3px;

  &[required] + label:after {
    content: '*';
  }

  &[disabled] {
    background-color: #f2f2f2;
  }
`;

const WrapperIcon = styled.div`
  position: absolute;
  margin-right: 7px;
  right: 0;
  cursor: ${(props) => (props.value ? 'pointer' : '')};
  align-items: center;
  justify-content: center;
  display: flex;
`;

export { Wrapper, InputText, WrapperField, WrapperIcon };
