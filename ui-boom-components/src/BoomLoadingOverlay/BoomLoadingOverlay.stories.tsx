import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { BoomLoadingOverlay } from '.';

export default {
  title: 'Components/BoomLoadingOverlay',
  component: BoomLoadingOverlay,
} as Meta;

const Template: Story<{}> = (args) => <BoomLoadingOverlay {...args} />;

export const Primary = Template.bind({});
