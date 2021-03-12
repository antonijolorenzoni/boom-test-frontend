import styled, { css } from 'styled-components';
import { Icon, IconProps } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RotateIcon = styled(Icon).attrs({ name: 'arrow_drop_down' })<IconProps & { menuIsOpen: boolean }>`
  transform: rotate(0deg);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  position: relative;
  top: 0px;

  ${(props) =>
    props.menuIsOpen &&
    css`
      transform: rotate(180deg);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      position: relative;
    `}
`;

export { Wrapper, RotateIcon };
