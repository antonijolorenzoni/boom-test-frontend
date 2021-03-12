import styled, { css } from 'styled-components';

const Header = styled.div`
  display: flex;
  background-color: #f5f6f7;

  ${(props) =>
    props.isMobile
      ? css`
          margin-left: 0px;
          padding-left: 20px;
          flex-direction: column;
          z-index: 100000;
          position: absolute;
          left: 0;
          right: 0;
          top: 60;
        `
      : css`
          margin-left: 100px;
          padding-left: 0px;
          flex-direction: row;
        `}
`;

export { Header };
