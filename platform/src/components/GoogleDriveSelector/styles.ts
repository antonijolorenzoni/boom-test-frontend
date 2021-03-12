import styled from 'styled-components';

export const DriveRectange = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  padding: 12px 11px;
  height: 16px;
  width: 270px;
  border: 1px solid #80888d;

  background: ${(props) => props.color};
`;

export const TextRectangle = styled.div`
  border: 1px solid #a3abb1;
  border-radius: 6px;
  padding: 9px 8px;
  height: 17px;
  overflow: hidden;
`;

export const ButtonNoStyle = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 5px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:active {
    transform: scale(0.95);
  }

  transition: box-shadow 0.2s ease, transform 0.5s ease;
`;

export const ErrorLabel = styled.div`
  @media (min-width: 320px) {
    font-size: 12px;
  }
  color: red;
  font-weight: bold;
  margin-bottom: 20px;
`;
