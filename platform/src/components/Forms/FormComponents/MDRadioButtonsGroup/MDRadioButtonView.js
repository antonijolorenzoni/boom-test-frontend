import React from 'react';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const MDRadioButtonView = ({ colorIndex, label, value, handleChange, labelStyle }) => (
  <FormControlLabel
    color={colorIndex || 'primary'}
    value={value}
    onChange={(e) => handleChange(e)}
    control={<Radio />}
    label={<h5 style={{ ...labelStyle }}>{label}</h5>}
  />
);

export default MDRadioButtonView;
