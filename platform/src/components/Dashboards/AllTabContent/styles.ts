import styled from 'styled-components';

export const ContextualFilterWrapper = styled.div`
  margin-left: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
`;

export const IconWrapper = styled.a<{ backgroundColor: string }>`
  display: flex;
  text-decoration: unset;
  margin-left: 12px;
  padding: 3px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 5px;
`;
