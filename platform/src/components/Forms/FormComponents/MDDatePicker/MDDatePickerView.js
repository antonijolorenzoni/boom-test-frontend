import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';

const styles = (theme) => ({
  textField: {
    width: '100%',
  },
});

class MDDatePickerView extends React.Component {
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
        label={label || 'Date'}
        InputLabelProps={{
          shrink: true,
        }}
        type="date"
        onChange={(event) => this.handleChange(event)}
      />
    );
  }
}

MDDatePickerView.propTypes = {
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(MDDatePickerView);
