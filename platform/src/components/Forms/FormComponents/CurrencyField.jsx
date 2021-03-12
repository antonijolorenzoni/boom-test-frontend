import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

const styles = {
  arrow: {
    padding: 5,
    '& > span > svg': {
      fontSize: 16,
    },
  },
};

const inc = (value, step) => value + (step - (value % step));
const dec = (value, step) => {
  const rest = value % step;
  const toSubtract = rest > 0 ? rest : step;
  return value > 0 ? value - toSubtract : 0;
};

const CurrencyField = ({ label, value, onChange, step, color, classes }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: 30,
          flexBasis: '60%',
        }}
      >
        {label}
        {value}
      </span>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 20,
        }}
      >
        <ShowForPermissions permissions={[Permission.ShootingAssign]}>
          <IconButton classes={{ root: classes.arrow }} aria-label="inc" onClick={() => onChange(inc(value, step))} color={color}>
            <UpIcon />
          </IconButton>
          <IconButton classes={{ root: classes.arrow }} aria-label="dec" color={color} onClick={() => onChange(dec(value, step))}>
            <DownIcon />
          </IconButton>
        </ShowForPermissions>
      </div>
    </div>
  );
};

export default withStyles(styles)(CurrencyField);
