import { SHOOTINGS_STATUSES, SHOOTING_STATUSES_UI_ELEMENTS } from '../../../config/consts';

export const styles = {
  timer: {
    fontSize: 18,
    fontWeight: 500,
  },
  bar: {
    height: 13,
    border: '1px solid #A3ABB1',
  },
  linearColorPrimary: {
    backgroundColor: '#FFFFFF',
  },
  [`linearBarColorPrimary_${SHOOTINGS_STATUSES.AUTO_ASSIGNMENT}`]: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.AUTO_ASSIGNMENT].color,
  },
  [`linearBarColorPrimary_${SHOOTINGS_STATUSES.ASSIGNED}`]: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.ASSIGNED].color,
  },
  // conditional styles
  freezedTimer: {
    color: '#00000080',
  },
  elapsedRefusedTimer: {
    color: '#A3ABB1',
  },
  invitedDefaultBar: {
    backgroundColor: '#7A4AAC',
  },
  [`freezedBar_${SHOOTINGS_STATUSES.AUTO_ASSIGNMENT}`]: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.AUTO_ASSIGNMENT].secondaryColor,
  },
  [`freezedBar_${SHOOTINGS_STATUSES.ASSIGNED}`]: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.ASSIGNED].secondaryColor,
  },
  elapsedRefusedBar: {
    backgroundColor: '#A3ABB1',
  },
  photographerBar: {
    backgroundColor: '#FFA500',
  },
};
