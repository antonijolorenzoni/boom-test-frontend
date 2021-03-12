//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A V A I L A B I L I T Y   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import {
  SAVE_USER_UNAVAILABILITY,
  SET_UNAVAILABILITY_FILTERS,
  RESET_UNAVAILABILITY_FILTERS,
  RESET_UNAVAILABILITY_DATA,
  SET_UNAVAILABILITY_FILTERS_BLOCK,
} from '../actions/actionTypes/availability';

const initialState = Immutable({
  data: {
    content: [],
    filters: {},
  },
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_USER_UNAVAILABILITY:
      return state.setIn(['data', 'content'], action.unavailabilities);
    case SET_UNAVAILABILITY_FILTERS:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_UNAVAILABILITY_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case RESET_UNAVAILABILITY_DATA:
      return state.setIn(['data', 'content'], []);
    case SET_UNAVAILABILITY_FILTERS_BLOCK:
      return state.setIn(['data', 'filters'], action.filters);
    default:
      return state;
  }
}
