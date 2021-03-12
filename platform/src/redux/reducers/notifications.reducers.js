//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: N O T I F I C A T I O N   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import {
  SAVE_NOTIFICATIONS,
  APPEND_NOTIFICATIONS,
  SAVE_NOTIFICATIONS_PAGINATION,
  SET_NOTIFICATIONS_FILTER,
  RESET_NOTIFICATIONS_FILTERS,
  SET_SELECTED_NOTIFICATION,
  RESET_NOTIFICATIONS_DATA,
} from '../actions/actionTypes/notifications';

const initialState = Immutable({
  data: {
    content: [],
    pagination: {},
    filters: {},
  },
  selectedNotification: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_NOTIFICATIONS:
      return state.setIn(['data', 'content'], action.notifications);
    case APPEND_NOTIFICATIONS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.notifications]);
    case SAVE_NOTIFICATIONS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_NOTIFICATIONS_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_NOTIFICATIONS_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case RESET_NOTIFICATIONS_DATA:
      return state.setIn(['data', 'content'], []).setIn(['data', 'pagination'], {});
    case SET_SELECTED_NOTIFICATION:
      return state.set('selectedNotification', action.notification);
    default:
      return state;
  }
}
