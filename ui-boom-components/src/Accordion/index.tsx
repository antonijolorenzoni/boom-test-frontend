import React, { useEffect } from 'react';
import { Wrapper, Header, TransparentOverlay, IconWrapper, Content } from './style';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';

export interface AccordionProps {
  titleComponent?: JSX.Element;
  title?: string;
  color?: string;
  wrapperStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  disabled?: boolean;
  onToggle?: (value: boolean) => void;
  initiallyOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  titleComponent,
  title,
  color,
  wrapperStyle,
  iconStyle,
  disabled,
  onToggle,
  children,
  initiallyOpen = false,
}) => {
  const [isOpen, setOpen] = React.useState(initiallyOpen);

  useEffect(() => {
    disabled && setOpen(false);
  }, [disabled]);

  return (
    <Wrapper style={wrapperStyle}>
      <Header
        onClick={() => {
          if (!disabled) {
            onToggle && onToggle(!isOpen);
            setOpen(!isOpen);
          }
        }}
        data-testid="accordion-header"
      >
        <TransparentOverlay disabled={disabled} />
        {titleComponent || <div>{title}</div>}
        <IconWrapper isOpen={isOpen} style={iconStyle}>
          <IconButton>
            <Icon name="keyboard_arrow_down" color={color} />
          </IconButton>
        </IconWrapper>
      </Header>
      <Content isOpen={isOpen} data-testid="accordion-content">
        {children}
      </Content>
    </Wrapper>
  );
};

export { Accordion };
