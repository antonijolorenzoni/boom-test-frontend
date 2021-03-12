import React from 'react';
import Switch from '@material-ui/core/Switch';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = (theme) => ({
  colorBar: {},
  colorChecked: {},
  iOSSwitchBase: {
    '&$iOSChecked': {
      color: theme.palette.common.white,
      '& + $iOSBar': {
        backgroundColor: '#52d869',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  iOSChecked: {
    transform: 'translateX(15px)',
    '& + $iOSBar': {
      opacity: 1,
      border: 'none',
    },
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  iOSIcon: {
    width: 24,
    height: 24,
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1],
  },
});

const MDSwitchView = ({ onSelect, input, value, classes, label }) => {
  const checked = input.value && _.isBoolean(input.value) ? input.value : false;
  return (
    <div>
      <FormControlLabel
        control={<Switch checked={checked} onChange={() => onSelect(!checked)} color="primary" value={value} />}
        label="Material"
      />
      <FormControlLabel
        control={
          <Switch
            classes={{
              switchBase: classes.iOSSwitchBase,
              bar: classes.iOSBar,
              icon: classes.iOSIcon,
              iconChecked: classes.iOSIconChecked,
              checked: classes.iOSChecked,
            }}
            checked={checked}
            onChange={() => onSelect(!checked)}
            value="checkedB"
          />
        }
        label={label}
      />
    </div>
  );
};

export default withStyles(styles)(MDSwitchView);
