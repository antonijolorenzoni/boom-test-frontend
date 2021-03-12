import React from "react";

import { Wrapper, InputText, WrapperField, WrapperIcon } from "./styles";
import { Typography } from "../Typography";
import { Label } from "../Label";
import { Icon } from "../Icon";

const TextFieldCtaIcon = ({
  label,
  value,
  password,
  error,
  nameIcon,
  colorIcon,
  colorActiveIcon,
  onClick,
  onEnterKeyPress,
  ...inputProps
}) => {
  const { name } = inputProps;

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && onEnterKeyPress) {
      event.preventDefault();
      onEnterKeyPress();
    }
  };

  return (
    <Wrapper>
      <Label htmlFor={name}>{label}</Label>
      <WrapperField>
        <InputText
          id={name}
          {...inputProps}
          value={value}
          type={"text"}
          onKeyPress={handleKeyPress}
        />
        <WrapperIcon onClick={onClick} value={value}>
          <Icon
            name={nameIcon}
            color={value ? colorActiveIcon : colorIcon}
            size="18"
          />
        </WrapperIcon>
      </WrapperField>
      {error && (
        <Typography
          variantName="error"
          style={{
            visibility: error ? "visible" : "hidden",
            order: 3,
            minHeight: 18,
            marginTop: 2,
          }}
        >
          {error}
        </Typography>
      )}
    </Wrapper>
  );
};

export { TextFieldCtaIcon };
