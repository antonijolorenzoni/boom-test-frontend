import styled, { css } from "styled-components";
import { variant } from "./Typography/variant";

export const Label = styled(
  styled.label({
    ...variant.overline.style,
    cursor: "pointer",
    textTransform: "uppercase",
    marginBottom: 5,
  } as any)
)<{ required?: boolean } & React.LabelHTMLAttributes<HTMLLabelElement>>`
  ${(props) =>
    props.required &&
    css`
      &:after {
        content: "*";
      }
    `}
`;
