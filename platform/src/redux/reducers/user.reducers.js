//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U S E R   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import {
  SAVE_USER_DATA,
  LOGOUT,
  SAVE_PHOTO_TYPES,
  SAVE_PERSONAL_ACCESS_RULES,
  SET_SMB_SUBSCRIPTION_STATUS,
} from '../actions/actionTypes/user';

const initialState = Immutable({
  data: {},
  photoTypes: [],
  accessRules: {},
  subscriptionStatus: null,
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_USER_DATA:
      return state.set('data', action.userData);
    case SAVE_PHOTO_TYPES:
      return state.set('photoTypes', action.types);
    case SAVE_PERSONAL_ACCESS_RULES:
      return state.setIn(['accessRules', action.companyId], action.accessRules);
    case SET_SMB_SUBSCRIPTION_STATUS:
      return state.set('subscriptionStatus', action.subscriptionStatus);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
