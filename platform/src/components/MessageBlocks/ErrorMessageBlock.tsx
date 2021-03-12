import React from 'react';
import { MessageBlock } from './MessageBlock';

interface Props {
  title: string;
  subtitle?: string;
}

export const ErrorMessageBlock: React.FC<Props> = ({ title, subtitle }) => (
  <MessageBlock icon={'warning'} color={'#FF2727'} background={'#f5f6f7'} title={title} subtitle={subtitle} />
);
