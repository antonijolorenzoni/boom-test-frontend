import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#66c0b0' },
  },
  typography: {
    useNextVariants: true,
  },
});

const MDCheckBoxView = ({ checked, label, onSelect }) => (
  <MuiThemeProvider theme={theme}>
    <FormControlLabel control={<Checkbox color="primary" checked={checked} onChange={() => onSelect(!checked)} />} label={label} />
  </MuiThemeProvider>
);

export default MDCheckBoxView;
