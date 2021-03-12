import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';

const styles = {
  textField: {
    width: '100%',
  },
};

class MDTextInputView extends React.Component {
  inputRef = null;

  handleChange(event) {
    event.preventDefault();
    const { onChange } = this.props;
    if (onChange) onChange(event.currentTarget.value);
  }

  preventWheel = (e) => e.preventDefault();

  componentDidMount() {
    if (this.inputRef) {
      this.inputRef.addEventListener('wheel', this.preventWheel);
    }
  }

  componentWillUnmount() {
    if (this.inputRef) {
      this.inputRef.removeEventListener(this.preventWheel);
    }
  }

  render() {
    const { label, variant, min, step, textStyle } = this.props;
    return (
      <TextField
        inputRef={this.inputRef}
        variant={variant || 'outlined'}
        label={label}
        style={{ width: '100%', backgroundColor: '#FFFFFF' }}
        inputProps={{ min, style: textStyle, step }}
        onChange={(event) => this.handleChange(event)}
        {...this.props}
      />
    );
  }
}

export default withStyles(styles)(MDTextInputView);
