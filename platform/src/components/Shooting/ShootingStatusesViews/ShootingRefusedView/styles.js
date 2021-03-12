import styled from 'styled-components';

export const LabelTitle = styled.div`
  margin-bottom: 18px;
  font-weight: 500;
  font-size: 17px;
`;

export const SubTitleLabel = styled.div`
  color: #a3abb1;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 12px;
`;

export const ErrorLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 12px;
  color: #cc3300;

  & :first-child {
    margin-right: 5px;
  }
`;

export const TextSubLabel = styled.div`
  font-size: 13px;
  margin-bottom: 30px;
`;
