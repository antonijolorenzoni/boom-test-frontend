import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  position: relative;
  width: 243px;
  height: 258px;
  background-color: #ffffff;
  padding: 0px 20px;

  box-sizing: border-box;
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.25);

  @media screen and (max-width: 414px) {
    width: 100%;
    padding: 10px;
  }
`;

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
`;

export const DayName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
`;

const getBackgroundColorBox = (isBetweenSelection: boolean, fullRangeOver: boolean) => {
  if (isBetweenSelection) return '#cdece7';
  if (fullRangeOver) return '#f5f6f7';
  return 'unset';
};

export const AvailableDayBox = styled.div<{ isSelected: boolean; isBetweenSelection: boolean; fullRangeOver: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => getBackgroundColorBox(props.isBetweenSelection, props.fullRangeOver)};

  ${(props) =>
    props.isSelected &&
    css`
      color: #ffffff;
    `};
`;

const getBackgroundColorDay = (fullRangeSelected: boolean, fullRangeOver: boolean) => {
  if (fullRangeSelected) return '#cdece7';
  else if (fullRangeOver) return '#f5f6f7';
  else return '#ffffff';
};

export const AvailableDay = styled.div<{
  isSelected: boolean;
  fullRangeSelected: boolean;
  fullRangeOver: boolean;
  isMouseOver: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => getBackgroundColorDay(props.fullRangeSelected, props.fullRangeOver)};
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 50%;
  color: #000000;
  z-index: 1;

  ${(props) =>
    props.isSelected &&
    css`
      background-color: #5ac0b1;
      color: #ffffff;
    `}

  ${(props) =>
    props.isMouseOver &&
    css`
      background-color: #cdece7;
      color: #000000;
    `}

  @media screen and (max-width: 414px) {
    width: 36px;
    height: 36px;
  }
`;

export const Corner = styled.div<{ position: 'left' | 'right'; fullRangeSelected: boolean }>`
  position: absolute;
  height: 100%;
  width: 14.5px;
  background-color: ${(props) => (props.fullRangeSelected ? '#cdece7' : '#f5f6f7')};

  ${(props) =>
    props.position === 'left'
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`;

export const CloseIcon = styled.svg`
  cursor: pointer;
  position: absolute;
  right: 5px;
  fill: rgb(204, 204, 204);
  transition: fill 100ms ease 0s;

  &:hover {
    fill: rgb(172, 178, 183);
  }
`;

export const TooltipTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Text = styled.div<{ disabled?: boolean }>`
  position: relative;
  border: 1px solid #acb2b7;
  box-sizing: border-box;
  border-radius: 3px;
  cursor: pointer;
  height: 30px;
  box-sizing: border-box;
  padding: 4px 20px 4px 9px;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;

  order: 2;
  &[required] + label:after {
    content: '*';
  }

  ${(props) =>
    props.disabled &&
    css`
      background-color: #f2f2f2;
      cursor: not-allowed;
    `};
`;
export const EllipsisTypography = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
