//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S Y N C   A N D   A S Y N C   S E L E C T O R   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import CreatableView from './CreatableView';
import SelectableView from './SelectableView';

const styles = {
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    margin: 0,
    marginRight: 5,
    fontWeight: 100,
  },
};

class SelectableField extends React.Component {
  onHandleChange(value) {
    const { onSelect, input } = this.props;
    if (input) {
      input.onChange(value);
    }
    if (onSelect) {
      onSelect(value);
    }
  }

  onInputChange(value) {
    const { onInputChange } = this.props;
    if (onInputChange) {
      onInputChange(value);
    }
  }

  render() {
    const {
      input,
      meta,
      title,
      multi,
      mandatory,
      classes,
      canCreate,
      onNewOption,
      onLoadOptions,
      titleStyle,
      titleContainerStyle,
      containerstyle,
    } = this.props;
    const hasError = meta.touched && meta.error;
    let { value } = input;
    if (multi) {
      if (!_.isArray(input.value)) {
        value = [input.value];
      }
    } else if (_.isArray(input.value) && input.value.length) {
      value = _.first(input.value);
    }

    return (
      <div style={{ zIndex: 10000, ...containerstyle }}>
        {title && (
          <div className={classes.titleContainer} style={{ ...titleContainerStyle }}>
            <h4 className={classes.titleText} style={{ ...titleStyle, color: hasError ? 'red' : '#3f3f3f' }}>
              {title}
            </h4>
            {mandatory && <h5 style={{ color: 'red', margin: 10, marginLeft: 0 }}>*</h5>}
          </div>
        )}
        {canCreate ? (
          <CreatableView
            value={value}
            onHandleChange={(tag) => this.onHandleChange(tag)}
            onLoadOptions={onLoadOptions ? (text) => onLoadOptions(text) : null}
            onNewOption={(optionName) => onNewOption(optionName)}
            hasError={hasError}
            {...this.props}
          />
        ) : (
          <SelectableView
            value={value}
            onHandleChange={(tag) => this.onHandleChange(tag)}
            onLoadOptions={onLoadOptions ? (text) => onLoadOptions(text) : null}
            hasError={hasError}
            {...this.props}
          />
        )}
        {hasError && <h5 style={{ color: 'red', marginTop: 10, marginBottom: 0 }}>{meta.error}</h5>}
      </div>
    );
  }
}

export default withStyles(styles)(SelectableField);
