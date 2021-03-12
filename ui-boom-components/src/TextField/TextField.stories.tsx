import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { TextField, TextFieldProps } from '../TextField';

export default {
  title: 'Components/TextField',
  component: TextField,
} as Meta;

const TemplateTextField: Story<TextFieldProps> = (args) => <TextField {...args} required />;

export const Default = TemplateTextField.bind({});
