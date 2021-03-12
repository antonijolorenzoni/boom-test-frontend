import * as React from 'react';
import { variant as variantList, VariantName } from './variant';

const Typography: React.FC<{
  textColor?: string;
  variantName?: VariantName;
  textAlign?: string;
  disabled?: boolean;
  className?: string;
  onClick?: Function;
  style?: React.CSSProperties;
  parentRef?: object;
  isUppercase?: boolean;
}> = ({ textColor, variantName, children, textAlign, disabled, className, onClick, style, parentRef, isUppercase }) => {
  const variant = variantName ? variantList[variantName] : variantList.default;

  const Component = variant.component as any;
  const settingColor = textColor || variant.style.color;

  return (
    <Component
      className={className}
      disabled={disabled}
      onClick={onClick}
      ref={parentRef}
      style={{
        margin: 0,
        padding: 0,
        ...variant.style,
        color: settingColor,
        textAlign,
        textTransform: isUppercase ? 'uppercase' : 'none',
        ...style,
      }}
    >
      {children}
    </Component>
  );
};

Typography.defaultProps = {
  textAlign: 'left',
};

export { Typography };
