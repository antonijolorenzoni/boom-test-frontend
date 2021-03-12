import React, { useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Tabs, TabsProps } from './';
import { Tab } from '../Tab';

export default {
  title: 'Components/Tabs',
  component: Tabs,
} as Meta;

const contentStyle = { background: '#ffffff', color: '#000000', height: 300, padding: 10 };

const TemplateTabs: Story<TabsProps> = (args) => {
  const [activeTab, setActiveTab] = useState(args.activeTab);

  return (
    <div style={{ background: '#E5E5E5', padding: 10 }}>
      <Tabs {...args} onClick={setActiveTab} activeTab={activeTab}>
        <Tab iconName="reorder" name="one" label="One">
          <div style={contentStyle}>One</div>
        </Tab>
        <Tab iconName="calendar_today" name="two" label="Two" counter={150}>
          <div style={contentStyle}>Two</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export const Default = TemplateTabs.bind({});

Default.args = { activeTab: 'one', color: '#5AC0B1' };
