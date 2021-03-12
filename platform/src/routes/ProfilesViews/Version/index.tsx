import React from 'react';
import { Typography } from 'ui-boom-components';

const secondary = '#A3ABB1';

const Version = () => {
  return process.env.REACT_APP_VERSION ? (
    <Typography variantName="caption2" textColor={secondary} style={{ textAlign: 'center' }}>
      {`BOOM Imagestudio Platform v ${process.env.REACT_APP_VERSION}`}
    </Typography>
  ) : null;
};

export default Version;
