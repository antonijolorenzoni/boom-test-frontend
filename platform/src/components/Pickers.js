import styled from 'styled-components';
import { InlineDatePicker, InlineTimePicker } from 'material-ui-pickers';

const DatePicker = styled(InlineDatePicker)`
  & input {
    padding: 5px 9px;
    font-size: 13px;
    border: 1px solid #acb2b7;
    border-radius: 3px;
    line-height: 18px;
  }

  & input:disabled {
    background-color: #f2f2f2;
  }

  & fieldset {
    border: none;
  }

  & > div > div:nth-child(2) {
    padding-top: 1px;
    padding-bottom: 1px;
  }
`;

const TimePicker = styled(InlineTimePicker)`
  & input {
    padding: 5px 9px;
    font-size: 13px;
    border: 1px solid #acb2b7;
    border-radius: 3px;
    line-height: 18px;
  }

  & input:disabled {
    background-color: #f2f2f2;
  }

  & fieldset {
    border: none;
  }

  & > div > div > div > div {
    padding-top: 1px;
    padding-bottom: 1px;
  }
`;

export { DatePicker, TimePicker };
