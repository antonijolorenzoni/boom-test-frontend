import { SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import styled from 'styled-components';
import { OrderStatus } from 'types/OrderStatus';

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    align-items: normal;
  }
`;

const FilterItem = styled.div`
  flex-basis: 9.5%;
  width: 9.5%;
  margin-right: 12px;
  position: relative;

  @media screen and (max-width: 1080px) {
    margin-right: 0;
    width: 100%;
  }
`;

const StatusOptionWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;

  &:hover {
    background-color: #b7e4de;
  }

  &:active {
    background-color: #b7e4de;
  }
`;

const StatusCircle = styled.div<{ status: OrderStatus }>`
  min-width: 10px;
  min-height: 10px;
  border-radius: 50%;
  margin: 0 6px;
  background-color: ${(props) => SHOOTING_STATUSES_UI_ELEMENTS[props.status]?.color};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: 1080px) {
    justify-content: center;
    margin-bottom: 20px;
  }
`;

const VerticalDivider = styled.div`
  height: 37.5px;
  width: 0;
  margin-right: 12px;
  border-left: 1px solid #a3abb1;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`;

export { FilterWrapper, FilterItem, StatusOptionWrapper, StatusCircle, ButtonsWrapper, VerticalDivider };
