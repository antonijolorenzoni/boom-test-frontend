import React from 'react';
import { SHOOTING_STATUSES_UI_ELEMENTS } from '../../config/consts';

const style = {
  display: 'flex',
  width: 27,
  height: 27,
  fontSize: 14,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'grey',
};

const statusStyle = (shootingStatus) => ({
  DEFAULT: {
    backgroundColor: '#FFFFFF',
    color: SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus].color,
    border: '2px solid',
    borderColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus].color,
  },
  INVITED: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus].color,
    color: '#FFFFFF',
  },
  INSERTED: {
    backgroundColor: '#FFFFFF',
    color: SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus].color,
  },
  REFUSED: {
    backgroundColor: '#A3ABB1',
    color: '#F5F6F7',
  },
  ELAPSED: {
    backgroundColor: '#A3ABB1',
    color: '#F5F6F7',
  },
  FREEZED: {
    backgroundColor: '#F5F6F7',
    color: SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus].secondaryColor,
    border: '2px solid',
    borderColor: SHOOTING_STATUSES_UI_ELEMENTS[shootingStatus].secondaryColor,
  },
});

const PositionIndicator = ({ position, status, shootingStatus }) => {
  return <div style={{ ...style, ...statusStyle(shootingStatus)[status] }}>{position}</div>;
};

export default PositionIndicator;
