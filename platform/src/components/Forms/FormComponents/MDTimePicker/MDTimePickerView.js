import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';

const styles = (theme) => ({
  textField: {
    width: '100%',
  },
});

class MDTimePickerView extends React.Component {
  handleChange(event) {
    event.preventDefault();
    const { onChange } = this.props;
    if (onChange) onChange(event.currentTarget.value);
  }

  render() {
    const { classes, label } = this.props;

    return (
      <TextField
        {...this.props}
        variant="outlined"
        className={classes.textField}
        label={label || 'Time'}
        onChange={(event) => this.handleChange(event)}
        id="time"
        type="time"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 900, // 15 min
        }}
      />
    );
  }
}

MDTimePickerView.propTypes = {
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(MDTimePickerView);
