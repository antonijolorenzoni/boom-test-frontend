import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import MDRadioButtonView from './MDRadioButtonView';

const styles = {
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },
  titleText: {
    margin: 0,
    marginRight: 5,
    fontSize: 15,
    fontWeight: 100,
  },
};

class MDRadioButtonsGroupField extends React.Component {
  onHandleChange(e, input) {
    const { onHandleChange } = this.props;
    if (input) {
      input.onChange(e);
    }
    if (onHandleChange) {
      onHandleChange(e);
    }
  }

  render() {
    const {
      classes,
      containerstyle,
      groupLabel,
      groupName,
      options,
      horizontal,
      input,
      radioLabelStyle,
      title,
      required,
      meta,
      showErrorLabel,
    } = this.props;

    const hasError = meta.touched && meta.error ? true : false;

    return (
      <div style={{ ...containerstyle }}>
        <div className={classes.titleContainer}>
          <h4 className={classes.titleText} style={{ color: hasError ? 'red' : 'black' }}>
            {title}
          </h4>
          {required && <span style={{ color: '#D71F4B' }}>*</span>}
        </div>
        <FormControl component="fieldset" style={{ display: 'flex' }}>
          <RadioGroup aria-label={groupLabel} name={groupName} value={input.value} style={{ flexDirection: horizontal ? 'row' : 'column' }}>
            {_.map(options, (option, index) => {
              return (
                <MDRadioButtonView
                  key={index}
                  handleChange={(e) => this.onHandleChange(e, input)}
                  value={String(option.id)}
                  labelStyle={radioLabelStyle}
                  label={option.value}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        {showErrorLabel && hasError && <h6 style={{ color: 'red', marginTop: 4, marginLeft: 10 }}>{meta.error}</h6>}
      </div>
    );
  }
}

export default withStyles(styles)(MDRadioButtonsGroupField);
