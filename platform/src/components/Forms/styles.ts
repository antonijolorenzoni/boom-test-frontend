import styled from 'styled-components';
import { MediaQueryBreakpoint } from 'ui-boom-components';

const LineBreak = styled.div`
  border-top: 1px solid #a3abb1;
  transform: matrix(1, 0, 0, 1, 0, 0);
  opacity: 0.5;
  margin-left: 20px;
  margin-right: 20px;
`;

const RowWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    flex-direction: column;
  }
`;

const FieldWrapper = styled.div`
  width: 48%;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    width: auto;
  }
`;

const FieldInlineWrapper = styled.div`
  width: 100%;
`;

const SpacedWrapper = styled.div`
  margin: 8px 0px;
`;

const ImportantSpacedWrapper = styled.div`
  margin: 16px 0px;
`;

const SpacedRowWrapper = styled(RowWrapper)`
  margin-top: 8px;
`;

const Background = styled.div`
  background: #f5f6f7;
  border-radius: 3;
  padding: 10px 14px 14px;
  margin-top: 10;
  cursor: default;
`;

export { LineBreak, RowWrapper, FieldWrapper, FieldInlineWrapper, SpacedWrapper, ImportantSpacedWrapper, Background, SpacedRowWrapper };
