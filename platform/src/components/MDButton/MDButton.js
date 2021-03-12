import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const MDButton = ({
  backgroundColor,
  buttonStyle,
  onClick,
  title,
  titleStyle,
  containerstyle,
  disabled,
  icon,
  secondary,
  buttonRef,
  component,
}) => {
  const theme = createMuiTheme({
    palette: {
      primary: backgroundColor ? { 500: backgroundColor } : { 500: '#cc0033' },
      seconday: '#cc0033',
    },
    typography: {
      useNextVariants: true,
    },
  });

  return (
    <div style={{ marginTop: 20, ...containerstyle }}>
      <MuiThemeProvider theme={theme}>
        <Button
          disabled={disabled}
          variant="contained"
          color={secondary ? 'secondary' : 'primary'}
          fullWidth
          style={{ ...buttonStyle, opacity: disabled ? 0.5 : 1 }}
          onClick={onClick ? () => onClick() : null}
          buttonRef={buttonRef}
          component={component}
        >
          {icon}
          <h5 style={{ margin: 0, color: 'white', ...titleStyle }}>{title}</h5>
        </Button>
      </MuiThemeProvider>
    </div>
  );
};

export default MDButton;
