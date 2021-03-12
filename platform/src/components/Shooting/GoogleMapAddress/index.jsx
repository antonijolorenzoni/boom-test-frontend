import React from 'react';
import { Icon, Typography } from 'ui-boom-components';
import { Wrapper } from './styles';

export const GoogleMapAddress = ({ address, lat, long, color }) => {
  const openGMap = () => window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${long}`);

  return (
    <Wrapper onClick={openGMap}>
      <Icon name="place" size="12" color="#80888D" style={{ marginRight: 8, marginTop: 2 }} />

      <Typography
        variantName="body1"
        textColor={color}
        style={{ cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'break-spaces' }}
      >
        {address}
      </Typography>
    </Wrapper>
  );
};
