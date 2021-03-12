import styled from 'styled-components';

export const LineBreak = styled.div`
  border-top: 0.5px solid #a3abb1;
  transform: matrix(1, 0, 0, 1, 0, 0);
  opacity: 0.5;
`;

export const Li = styled.li`
  line-height: 5px;
  font-size: 10px;
`;

export const Box = styled.div`
  display: flex;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  justify-content: space-evenly;
  margin-bottom: 27px;
  max-width: fit-content;
`;

export const PointedList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0.5;
  padding: 10px 10px 10px 10px;
`;

export const EmptyCardPlaceholder = styled.div`
  width: 50px;
  height: 30px;
  background: #f5f6f7;
  border: 1px solid #acb2b7;
  box-sizing: border-box;
  border-radius: 3px;
`;
