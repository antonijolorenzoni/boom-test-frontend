import React from 'react';

import { withStyles } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import cn from 'classnames';

const styles = {
  deliveryMethodEmailChipInput: {
    padding: '14px 14px 6px 14px',
    backgroundColor: '#FFFFFF',
    fontSize: 13,
  },
  rootError: {
    border: '1px solid #D84315',
    borderRadius: 4,
  },
  deliveryMethodEmailChip: {
    border: 'solid 1px black',
    backgroundColor: 'white',
    height: 25,
    padding: 2,
    '& svg': {
      fill: 'black',
    },
    '& span': {
      fontWeight: 600,
    },
  },
};

class MDChipInputField extends React.Component {
  render() {
    const { input, handleAddChip, handleDeleteChip, componentStyle, classes, deliveryError, disabled, ...others } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        {disabled && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              minHeight: 'calc(100% + 2px)',
              minWidth: '100%',
              backgroundColor: 'rgba(228, 228, 228, 0.5)',
              zIndex: 100,
            }}
          />
        )}
        <ChipInput
          value={input || ''}
          onAdd={(chip) => handleAddChip(chip)}
          onDelete={(chip, index) => handleDeleteChip(chip, index)}
          classes={{
            chipContainer: cn({ [classes.rootError]: deliveryError }),
            inputRoot: classes.deliveryMethodEmailChipInput,
            chip: classes.deliveryMethodEmailChip,
          }}
          disabled={disabled}
          {...others}
        />
      </div>
    );
  }
}

export default withStyles(styles)(MDChipInputField);
