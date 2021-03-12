import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Button, ButtonProps, OutlinedButtonProps, OutlinedButton } from '../Button';

export default {
  title: 'Components/Button',
  component: Button,
} as Meta;

const TemplateButton: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = TemplateButton.bind({});

Default.args = { children: 'Hello, world' };

const TemplateOutlinedButton: Story<OutlinedButtonProps> = (args) => <OutlinedButton {...args} />;

export const Outlined = TemplateOutlinedButton.bind({});

Outlined.args = { children: 'Hello, world' };
