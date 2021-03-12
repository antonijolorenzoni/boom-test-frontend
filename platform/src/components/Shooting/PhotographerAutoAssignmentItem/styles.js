import { SHOOTINGS_STATUSES, SHOOTING_STATUSES_UI_ELEMENTS } from '../../../config/consts';

export const styles = {
  wrapper: {
    padding: 13,
    width: 320,
    borderRadius: 12,
  },
  idNameWrapper: {
    marginLeft: 30,
    width: 'auto',
  },
  id: {
    fontSize: 18,
    fontWeight: 500,
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: 175,
  },
  status: {
    fontSize: 14,
    fontWeight: 700,
    marginLeft: 'auto',
  },

  // conditional style
  defaultInvitedWrapper: {
    boxShadow: '0px 3px 10px #00000029',
  },
  [`insertedWrapper_${SHOOTINGS_STATUSES.AUTO_ASSIGNMENT}`]: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.AUTO_ASSIGNMENT].color,
  },
  [`insertedWrapper_${SHOOTINGS_STATUSES.ASSIGNED}`]: {
    backgroundColor: SHOOTING_STATUSES_UI_ELEMENTS[SHOOTINGS_STATUSES.ASSIGNED].color,
  },
  refusedElapsedFreezedWrapper: {
    backgroundColor: '#F5F6F7',
    border: '1px solid #A3ABB1',
  },
  insertedId: {
    color: '#FFFFFF',
  },
  refusedOrElapsedId: {
    color: '#80888D',
  },
  freezedId: {
    color: '#00000080',
  },
  insertedName: {
    color: '#FFFFFF',
  },
  defaultName: {
    color: '#A3ABB1',
  },
  invitedName: {
    color: '#A3ABB1',
  },
  refusedOrElapsedName: {
    color: '#A3ABB1',
  },
  freezedName: {
    color: '#A3ABB180',
  },
  insertedStatus: {
    color: '#FFFFFF',
  },
  refusedElapsedFreezedStatus: {
    color: '#A3ABB1',
  },
};
