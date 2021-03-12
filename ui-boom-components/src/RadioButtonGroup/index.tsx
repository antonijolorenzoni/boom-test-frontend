import React from 'react';

interface Props {
  name: string;
  selectedValue?: string | number | null;
  onClick: (e?: string | null) => void;
  isVertical?: boolean;
  color?: string;
  children: React.ReactNode;
}

const RadioButtonGroup = ({
  name,
  selectedValue,
  onClick,
  children,
  isVertical = false,
  color,
  ...rest
}: Omit<React.HTMLAttributes<any>, 'onClick'> & Props) => (
  <div role="radiogroup" {...rest} style={{ display: isVertical ? 'block' : 'flex' }}>
    {/* TODO need help to figure out right element type */}
    {React.Children.map(children, (element: any) =>
      React.cloneElement(element, {
        ...element.props,
        checked: selectedValue === element.props.value,
        onChange: () => onClick(element.props.value),
        name,
        color,
      })
    )}
  </div>
);

export { RadioButtonGroup };
