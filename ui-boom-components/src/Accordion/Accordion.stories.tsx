import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Accordion, AccordionProps } from '.';
import { Icon } from '../Icon';
import { Typography } from '../Typography';

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as Meta;

const Template: Story<AccordionProps> = (args) => (
  <Accordion
    wrapperStyle={{ width: '100%' }}
    titleComponent={
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon name="camera" color="#000000" />
        <Typography variantName="title2" style={{ marginLeft: 5 }}>
          The title
        </Typography>
      </div>
    }
    {...args}
  >
    <Typography variantName="body2" style={{ marginLeft: 5 }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
      culpa qui officia deserunt mollit anim id est laborum.
    </Typography>
  </Accordion>
);

export const Default = Template.bind({});
Default.args = {};
