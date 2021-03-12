import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import MDSwitchView from './MDSwitchView';

class MDSwitchField extends React.Component {
  onHandleChange(value, input) {
    const { onHandleChange } = this.props;
    if (input) {
      input.onChange(value);
    }
    if (onHandleChange) {
      onHandleChange(value);
    }
  }

  render() {
    const { color, input, title, label } = this.props;
    const theme = createMuiTheme({
      palette: {
        primary: color || red,
      },
      typography: {
        useNextVariants: true,
      },
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h4>{title}</h4>
        <MuiThemeProvider theme={theme}>
          <MDSwitchView onSelect={(v) => this.onHandleChange(v, input)} label={label} {...this.props} />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MDSwitchField;
