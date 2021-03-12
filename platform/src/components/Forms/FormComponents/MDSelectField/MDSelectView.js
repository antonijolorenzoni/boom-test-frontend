import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

const styles = {
  formControl: {
    width: '100%',
  },
  icon: {
    right: 10,
  },
};

class ControlledOpenSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labelWidth: 80,
    };
  }

  handleChange(event) {
    const { onSelect } = this.props;
    if (onSelect) onSelect(event.target.value);
  }

  componentDidMount() {
    this.setState({
      labelWidth: this.labelRef.offsetWidth,
    });
  }

  render() {
    const { classes, title, value, options, hasError, disabled, required } = this.props;
    const { labelWidth } = this.state;
    return (
      <FormControl variant="outlined" className={classes.formControl} required={required}>
        <InputLabel
          ref={(ref) => {
            this.labelRef = ReactDOM.findDOMNode(ref);
          }}
          htmlFor="outlined-select-simple"
        >
          {title || 'Select'}
        </InputLabel>
        <Select
          classes={{ icon: classes.icon }}
          onOpen={() => this.handleOpen()}
          value={value}
          disabled={disabled}
          onChange={(event) => this.handleChange(event)}
          input={<OutlinedInput error={hasError} labelWidth={labelWidth} name="select" id="outlined-select-simple" />}
        >
          {_.map(options, (option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(ControlledOpenSelect);
