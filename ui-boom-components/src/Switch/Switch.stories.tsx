import React, { useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Switch, SwitchProps } from '../Switch';
import { Typography } from '../Typography';

export default {
  title: 'Components/Switch',
  component: Switch,
} as Meta;

const Template: Story<SwitchProps> = (args) => {
  const [checked, setChecked] = useState(args.checked);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 225 }}>
      <Typography variantName={checked ? 'body2' : 'body1'} textColor={checked ? '#80888D' : '#000000'}>
        Order List
      </Typography>
      <Switch {...args} checked={checked} onClick={(e) => setChecked(!checked)} />
      <Typography variantName={!checked ? 'body2' : 'body1'} textColor={!checked ? '#80888D' : '#000000'}>
        Calendar
      </Typography>
    </div>
  );
};

export const Default = Template.bind({});
