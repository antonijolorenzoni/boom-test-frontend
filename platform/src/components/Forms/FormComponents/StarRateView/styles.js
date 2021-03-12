import styled from 'styled-components';
import { Icon } from 'ui-boom-components';

const StarRateViewWrapper = styled.div`
  display: flex;
  align-items: center;

  & > :nth-child(1) {
    flex-basis: 35%;
  }

  & > :nth-child(2) {
    flex-grow: 1;
  }
`;

const StarIcon = styled(Icon).attrs(({ isSelected }) => ({
  name: isSelected ? 'star' : 'star_border',
}))`
  opacity: ${({ disabled }) => (disabled ? '50%' : '100%')};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: #a3abb1;
  text-transform: uppercase;
  opacity: ${({ disabled }) => (disabled ? '50%' : '100%')}; ;
`;

export { StarRateViewWrapper, StarIcon, Title };
