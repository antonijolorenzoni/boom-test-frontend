import styled, { css } from 'styled-components';

enum Direction {
  Down,
  DownRight,
}

interface Props {
  shadowDirection?: Direction;
}

const Paper = styled.div<Props>`
  position: relative;
  background-color: #ffffff;
  padding: 25px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  ${(props) => {
    switch (props.shadowDirection) {
      case Direction.Down:
        return css`
          box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
        `;
      case Direction.DownRight:
        return css`
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
        `;
      default:
        return css`
          box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
        `;
    }
  }}
`;

export { Paper, Direction };
