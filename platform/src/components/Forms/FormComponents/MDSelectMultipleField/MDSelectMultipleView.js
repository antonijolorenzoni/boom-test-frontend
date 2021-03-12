import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Checkbox from '@material-ui/core/Checkbox';

const styles = {
  formControl: {
    width: '100%',
  },
  icon: {
    right: 10,
  },
};

class MDSelectMultipleView extends React.Component {
  handleChange(event) {
    const { onSelect } = this.props;
    if (onSelect) onSelect(event.target.value);
  }

  render() {
    const { classes, title, value, options, hasError } = this.props;
    return (
      <FormControl variant="outlined" className={classes.formControl}>
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
          multiple
          renderValue={(selected) => {
            const values = _.map(selected, (selectedValue) => {
              const valueFound = _.find(options, (option) => option.id === selectedValue);
              return valueFound.value;
            });
            return values.join(', ');
          }}
          onChange={(event) => this.handleChange(event)}
          input={
            <OutlinedInput
              error={hasError}
              labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
              name="select"
              id="outlined-select-simple"
            />
          }
        >
          {_.map(options, (option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={value.indexOf(option.id) > -1} />
              {option.element || option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(MDSelectMultipleView);
