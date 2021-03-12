import styled, { css } from 'styled-components';
import { Icon } from 'ui-boom-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RotateIcon = styled(Icon).attrs((props) => ({
  name: 'expand_more',
}))`
  transform: rotate(0deg);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  position: relative;
  top: 0px;
  cursor: pointer;

  ${(props) =>
    props.menuIsOpen &&
    css`
      transform: rotate(180deg);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      position: relative;
    `}
`;

export { Wrapper, RotateIcon };
