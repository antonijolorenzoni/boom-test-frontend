import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { MessageBox, MessageBoxProps } from '../MessageBox';

export default {
  title: 'Components/MessageBox',
  component: MessageBox,
} as Meta;

const TemplateMessageBox: Story<MessageBoxProps> = (args) => (
  <div style={{ width: 500 }}>
    <MessageBox {...args} />
  </div>
);

export const Default = TemplateMessageBox.bind({});

Default.args = { title: 'This is a title', subTitle: 'This is also a subtilte', type: 'error' };
