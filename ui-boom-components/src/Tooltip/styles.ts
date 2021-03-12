import styled, { css } from 'styled-components';

export const PopperContainer = styled.div<{ isArrowVisible?: boolean }>`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #f5f6f7;
  padding: 5px 8px;
  text-align: center;

  .arrow {
    position: absolute;
    width: 10px;
    height: 10px;

    ${(props) =>
      !props.isArrowVisible &&
      css`
        display: none;
      `}

    &:after {
      content: ' ';
      position: absolute;
      left: 0;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
      background-color: #f5f6f7;
    }
  }
  &[data-popper-placement^='top'] > .arrow {
    bottom: -5px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
  &[data-popper-placement^='bottom'] > .arrow {
    top: -5px;
    :after {
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
    }
  }
  &[data-popper-placement^='right'] > .arrow {
    left: -5px;
    :after {
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
  &[data-popper-placement^='left'] > .arrow {
    right: -5px;
    :after {
      box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`;
