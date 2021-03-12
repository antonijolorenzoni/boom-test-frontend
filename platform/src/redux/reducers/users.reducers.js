//
// ──────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P L A T F O R M   U S E R S   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  SAVE_USERS,
  APPEND_USERS,
  UPDATE_USER,
  SAVE_USERS_PAGINATION,
  SET_USERS_FILTER,
  RESET_USERS_FILTERS,
  DELETE_USER,
  RESET_USERS_DATA,
  SET_SELECTED_USER,
  SAVE_USER_ACCESS_RULES,
  APPEND_USER_ACCESS_RULES,
  RESET_USER_ACCESS_RULES,
  SAVE_USER_ACCESS_RULES_PAGINATION,
  SET_ACCESS_RULES_FILTERS,
  RESET_ACCESS_RULES_FILTERS,
} from '../actions/actionTypes/users';
import { ACCESS_RULES_TYPES } from '../../config/consts';

const initialState = Immutable({
  data: {
    content: [],
    pagination: {},
    filters: {},
  },
  accessRules: {
    content: [],
    pagination: {},
    filters: {
      type: ACCESS_RULES_TYPES.DEFAULT,
    },
  },
  selectedUser: {},
  organization: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_USERS:
      return state.setIn(['data', 'content'], action.users);
    case APPEND_USERS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.users]);
    case DELETE_USER: {
      const users = _.filter(state.data.content, (userState) => userState.id !== action.userId);
      return state.setIn(['data', 'content'], users);
    }
    case RESET_USER_ACCESS_RULES:
      return state.setIn(['accessRules', 'content'], []);
    case SAVE_USER_ACCESS_RULES:
      return state.setIn(['accessRules', 'content'], action.accessRules);
    case APPEND_USER_ACCESS_RULES:
      return state.setIn(['accessRules', 'content'], [...state.accessRules.content, ...action.accessRules]);
    case SAVE_USER_ACCESS_RULES_PAGINATION:
      return state.setIn(['accessRules', 'pagination'], action.pagination);
    case SET_SELECTED_USER:
      return state.set('selectedUser', action.user);
    case UPDATE_USER: {
      const index = _.findIndex(state.data.content, (data) => data.id === action.user.id);
      if (index !== -1) {
        return state.setIn(['data', 'content', index], action.user);
      }
      return state.setIn(['data', 'content'], [...state.data.content, action.user]);
    }
    case SET_ACCESS_RULES_FILTERS:
      return state.setIn(['accessRules', 'filters', action.field], action.value);
    case RESET_ACCESS_RULES_FILTERS:
      return state.setIn(['accessRules', 'filters'], {});
    case SAVE_USERS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_USERS_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_USERS_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case RESET_USERS_DATA:
      return state.setIn(['data', 'content'], []);
    default:
      return state;
  }
}
