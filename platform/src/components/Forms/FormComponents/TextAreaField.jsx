import React from 'react';
import { TextArea } from 'ui-boom-components';

class TextAreaField extends React.Component {
  render() {
    const { name, rows, cols, label, input, containerStyle, disabled } = this.props;

    // redux form props
    const { meta } = this.props;
    const error = meta.touched && meta.error ? meta.error : undefined;

    return (
      <div style={{ opacity: disabled ? '50%' : '100%', display: 'flex', flexDirection: 'column', ...containerStyle }}>
        <TextArea name={name} rows={rows} cols={cols} label={label} onChange={input.onChange} error={error} disabled={disabled} />
      </div>
    );
  }
}

export { TextAreaField };
