import React, { useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { TooltipDatePicker } from '.';

export default {
  title: 'Components/TooltipDatePicker',
  component: TooltipDatePicker,
} as Meta;

const Template: Story = (args) => {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  return (
    <div style={{ width: 250 }}>
      <TooltipDatePicker
        label="Date"
        {...args}
        onChangeDate={(start, end) => setDateRange({ start, end })}
        start={dateRange.start}
        end={dateRange.end}
        style={{ width: 150 }}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
