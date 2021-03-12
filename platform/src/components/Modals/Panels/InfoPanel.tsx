import React from 'react';
import { Icon, Typography, Button, OutlinedButton } from 'ui-boom-components';
import styled from 'styled-components';

interface Props {
  title: string | React.ReactElement;
  subtitle?: string | React.ReactElement;
  body?: string | React.ReactElement;
  button: string;
  buttonCancel?: string;
  isError?: boolean;
  style?: React.CSSProperties;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const CenteredPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InfoPanel: React.FC<Props> = ({
  title,
  subtitle,
  body,
  button,
  buttonCancel,
  isError = false,
  style,
  onConfirm = () => {},
  onCancel,
}) => (
  <CenteredPanel style={style}>
    {isError && <Icon name="warning" size={19} color="#D84315" style={{ marginBottom: 13 }} />}
    <Typography variantName="title2" textColor="#000000" style={{ padding: '0px 0px 16px' }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variantName="body3" textColor="#000000" textAlign="center" style={{ paddingBottom: 10 }}>
        {subtitle}
      </Typography>
    )}
    {body && typeof body === 'string' ? (
      <Typography variantName="body3" textColor="#80888D" textAlign="center" style={{ paddingBottom: 25 }}>
        {body}
      </Typography>
    ) : (
      <div style={{ marginBottom: 20 }}>{body}</div>
    )}
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    {buttonCancel && onCancel && (
      <OutlinedButton onClick={onCancel} style={{ padding: '9px 20px', marginRight: 20 }}>
        {buttonCancel}
      </OutlinedButton>
    )}
    <Button onClick={onConfirm} style={{ padding: '9px 20px' }}>
      {button}
    </Button>
    </div>
  </CenteredPanel>
);
