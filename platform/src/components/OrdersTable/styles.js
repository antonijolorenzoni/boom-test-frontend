import { Typography } from 'ui-boom-components';
import styled from 'styled-components';

const TableWrapper = styled.div`
  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;

    th {
      text-align: unset;
      font-weight: unset;
    }

    tr {
    }

    td {
      position: relative;
    }

    & > tbody tr * {
      cursor: pointer;
    }

    & > tbody tr[data-selected='true'] {
      background-color: #edf8f6;
    }

    & > tbody tr[data-selected='false'],
    & > tbody tr:not([data-selected]) {
      background-color: #ffffff;
    }

    & > tbody tr[data-selected='true']:nth-child(odd) {
      background-color: #e2efef;
    }

    & > tbody tr[data-selected='false']:nth-child(odd),
    & > tbody tr:not([data-selected]):nth-child(odd) {
      background-color: #f4f5f6;
    }

    & > tbody tr[data-selected]:hover,
    & > tbody tr:not([data-selected]):hover {
      background-color: #b7e4de;
    }
  }
`;

const PhoneIconWrapper = styled.div`
  cursor: pointer;
  background: #5ac0b1;
  border-radius: 5px;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EllipsisTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AssigneeHeaderSpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
`;

export { TableWrapper, PhoneIconWrapper, EllipsisTypography, AssigneeHeaderSpinnerWrapper };
