import AppBar from '@material-ui/core/AppBar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { isMobileBrowser } from '../../config/utils';

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#74beb2' },
    secondary: { main: '#000000' },
  },
  typography: {
    useNextVariants: true,
  },
});

class MDTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
  }

  onTabChange(index) {
    const { onTabChange } = this.props;
    this.setState({ selectedTab: index });
    if (onTabChange) onTabChange(index);
  }

  render() {
    const { children, tabContainers, containerstyle } = this.props;
    const { selectedTab } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar
          position="static"
          style={{
            backgroundColor: 'white',
            boxShadow: [
              'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px',
              'rgba(0, 0, 0, 0.14) 0px 1px 1px 0px',
              'rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
            ],
            borderRadius: 4,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(e, index) => this.onTabChange(index)}
            indicatorColor="primary"
            textColor="secondary"
            scrollable
            scrollButtons="off"
            style={{
              boxShadow: '#e1e1e1 0px -10px 0px -8px inset',
              fontWeight: 'bold',
            }}
          >
            {children}
          </Tabs>
          {<div style={containerstyle || { padding: isMobileBrowser() ? 10 : 32 }}>{tabContainers[selectedTab]}</div>}
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

export default MDTabs;
