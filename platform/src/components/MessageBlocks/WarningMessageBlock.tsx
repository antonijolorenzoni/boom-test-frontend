import React from 'react';
import { MessageBlock } from './MessageBlock';

interface Props {
  title: string;
  subtitle?: string;
}

export const WarningMessageBlock: React.FC<Props> = ({ title, subtitle }) => (
  <MessageBlock icon={'warning'} color={'#F2994A'} background={'#F5F6F7'} title={title} subtitle={subtitle} />
);
