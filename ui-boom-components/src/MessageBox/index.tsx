import { Typography, Icon, VariantName } from '..';
import React from 'react';
import styled from 'styled-components';

type MessageType = 'error' | 'warning' | 'loading' | 'success' | 'generic';

interface VariantAttributes {
  backgroundColor: string;
  color: string;
  iconName: string;
  variantName: VariantName;
}

export interface MessageBoxProps {
  title: string;
  subTitle?: string;
  type: MessageType;
  transparentBackground?: boolean;
}

export const Wrapper = styled.div<{ backgroundColor: string; hasSubTitle: boolean }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: ${({ hasSubTitle }) => (hasSubTitle ? '10px 16px' : '7px 16px')};
`;

const typeToStyle: Map<MessageType, VariantAttributes> = new Map([
  ['error', { backgroundColor: '#F5F6F7', color: '#FF2727', iconName: 'warning', variantName: 'body1' }],
  ['warning', { backgroundColor: '#F5F6F7', color: '#F2994A', iconName: 'warning', variantName: 'body1' }],
  ['loading', { backgroundColor: '#FFF2DB', color: '#000000', iconName: 'warning', variantName: 'body2' }],
  ['success', { backgroundColor: '#E5F5E1', color: '#000000', iconName: 'done', variantName: 'body2' }],
  ['generic', { backgroundColor: '#EFF7FF', color: '#000000', iconName: 'notifications', variantName: 'body2' }],
]);

export const MessageBox: React.FC<MessageBoxProps> = ({ title, subTitle, type, transparentBackground = false }) => {
  const { backgroundColor, color, iconName, variantName } = typeToStyle.get(type) ?? {
    backgroundColor: '#F5F6F7',
    color: '#000000',
    iconName: 'warning',
    variantName: 'body1',
  };

  return (
    <Wrapper backgroundColor={transparentBackground ? 'transparent' : backgroundColor} hasSubTitle={Boolean(subTitle)}>
      <Icon name={iconName} color={color} size={16} style={{ marginRight: 10 }} />
      <div>
        <Typography variantName={variantName} textColor={color}>
          {title}
        </Typography>
        {subTitle && <Typography variantName="caption">{subTitle}</Typography>}
      </div>
    </Wrapper>
  );
};
