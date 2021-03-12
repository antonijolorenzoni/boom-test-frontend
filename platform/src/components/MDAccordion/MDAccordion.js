import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const MDAccordion = ({ classes, containerstyle, subtitleStyle, defaultExpanded, titleStyle, title, subtitle, children }) => (
  <div className={classes.root} style={{ ...containerstyle }}>
    <ExpansionPanel defaultExpanded={defaultExpanded}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading} style={{ color: '#3f3f3f', fontSize: 15, fontWeight: 'bold', ...titleStyle }}>
          {title}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
        {subtitle && <Typography style={{ color: '#3f3f3f', fontSize: 12, ...subtitleStyle }}>{subtitle}</Typography>}
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

export default withStyles(styles)(MDAccordion);
