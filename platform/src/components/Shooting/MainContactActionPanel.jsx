import React from 'react';
import styled from 'styled-components';
import { Typography, Icon } from 'ui-boom-components';

const A = styled.a`
  all: unset;
  display: flex;
  cursor: pointer;
  align-items: center;
`;

export const MainContactActionPanel = ({ contact, color, showInfo }) =>
  showInfo ? (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
        <Typography variantName="body1" style={{ marginRight: 19 }}>
          {contact.fullName}
        </Typography>
        <A href={`tel:${contact.phoneNumber}`}>
          <Icon name="local_phone" color={'#000000'} size={10} style={{ marginRight: 10 }} />
          <Typography variantName="title3" textColor="#000000">
            {contact.phoneNumber}
          </Typography>
        </A>
      </div>
      <div>
        <A href={`mailto:${contact.email}`}>
          <Icon name="mail_outline" color={'#000000'} size={10} style={{ marginRight: 10 }} />
          <Typography variantName="title3" textColor="#000000">
            {contact.email}
          </Typography>
        </A>
      </div>
    </>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variantName="body1" style={{ marginRight: 19 }}>
        {contact.fullName}
      </Typography>
      <A href={`tel:${contact.phoneNumber}`}>
        <Icon name="local_phone" color={color} size={17} style={{ marginRight: 17 }} />
      </A>
      <A href={`mailto:${contact.email}`}>
        <Icon name="mail_outline" color={color} size={17} style={{ marginRight: 17 }} />
      </A>
    </div>
  );
