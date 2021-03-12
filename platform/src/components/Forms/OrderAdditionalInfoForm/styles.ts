import styled from 'styled-components';
import { MediaQueryBreakpoint } from 'ui-boom-components';

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

const ContainerIconAndText = styled.div`
  display: flex;
  align-items: baseline;
`;

export { RowWrapper, FieldWrapper, ContainerIconAndText };
