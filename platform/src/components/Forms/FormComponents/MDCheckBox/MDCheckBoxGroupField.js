import { withStyles } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import _ from 'lodash';
import React, { Component } from 'react';
import MDCheckBoxView from './MDCheckBoxView';

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

class MDCheckBoxGroupField extends Component {
  onHandleChange(e, input) {
    const { onHandleChange } = this.props;
    if (input) {
      input.onChange(e);
    }
    if (onHandleChange) {
      onHandleChange(e);
    }
  }

  onClick(o) {
    const { input, isSingleChoice } = this.props;
    const checkedItems = isSingleChoice ? null : input.value || [];
    if (_.includes(checkedItems, o.id) || _.isEqual(checkedItems, o.id)) {
      // if already selected
      this.onHandleChange(
        _.filter(checkedItems, (i) => i !== o.id),
        input
      );
    } else if (isSingleChoice) {
      this.onHandleChange(o.id, input);
    } else {
      this.onHandleChange([...checkedItems, o.id], input);
    }
  }

  render() {
    const { options, input, title, containerstyle, horizontal, meta, mandatory, classes, showErrorLabel } = this.props;
    const checkedItems = input.value || [];
    const hasError = meta.touched && meta.error ? true : false;
    return (
      <div style={{ ...containerstyle }}>
        <FormGroup>
          <div className={classes.titleContainer}>
            <h4 className={classes.titleText} style={{ color: hasError ? 'red' : 'black' }}>
              {title}
            </h4>
            {mandatory && <span style={{ color: '#D71F4B' }}>*</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', justifyContent: 'space-around' }}>
            {_.map(options, (option) => (
              <MDCheckBoxView
                key={option.value}
                checked={_.includes(checkedItems, option.id) || _.isEqual(checkedItems, option.id)}
                onSelect={() => this.onClick(option)}
                label={option.value}
              />
            ))}
          </div>
        </FormGroup>
        {showErrorLabel && hasError && <h6 style={{ color: 'red', marginTop: 4, marginLeft: 10 }}>{meta.error}</h6>}
      </div>
    );
  }
}

export default withStyles(styles)(MDCheckBoxGroupField);
