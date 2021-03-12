import styled from 'styled-components';

export const WrapperPenalities = styled.div`
  width: auto;
  padding: 19px 13px;
  border: 1px solid #a3abb1;
  border-radius: 6px;
`;

export const TypePenalityLabel = styled.span`
  margin-right: 8px;
  color: #a3abb1;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
`;

export const RefundLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const PenalitiesLabel = styled.div`
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: 500;
`;

export const ContainerRowPenality = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const RowPenality = styled.div`
  flex: 0 50%;
  box-sizing: border-box;
  width: 100%;
  padding-right: 10px;

  @media screen and (max-width: 1080px) {
    flex: 0 100%;
  }
`;
