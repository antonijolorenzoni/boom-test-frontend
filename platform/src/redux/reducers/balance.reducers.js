//
// ────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: B A L A N C E   R E D U C E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import {
  SAVE_BALANCE_ITEMS,
  APPEND_BALANCE_ITEMS,
  SAVE_BALANCE_ITEMS_PAGINATION,
  SET_BALANCE_FILTER,
  RESET_BALANCE_FILTER,
  RESET_BALANCE_DATA,
} from '../actions/actionTypes/balance';

const initialState = Immutable({
  data: {
    content: [],
    filters: {},
  },
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_BALANCE_ITEMS:
      return state.setIn(['data', 'content'], action.items);
    case APPEND_BALANCE_ITEMS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.items]);
    case SAVE_BALANCE_ITEMS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_BALANCE_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_BALANCE_FILTER:
      return state.setIn(['data', 'filters'], {});
    case RESET_BALANCE_DATA:
      return state.setIn(['data', 'content'], []).setIn(['data', 'pagination'], {});
    default:
      return state;
  }
}
