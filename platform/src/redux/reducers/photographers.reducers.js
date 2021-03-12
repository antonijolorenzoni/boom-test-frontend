//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import Immutable from 'seamless-immutable';

import {
  APPEND_PHOTOGRAPHERS,
  DELETE_PHOTOGRAPHER,
  RESET_PHOTOGRAPHERS_DATA,
  RESET_PHOTOGRAPHERS_FILTERS,
  SAVE_PHOTOGRAPHERS,
  SAVE_PHOTOGRAPHERS_PAGINATION,
  SET_PHOTOGRAPHERS_FILTER,
  SET_PHOTOGRAPHERS_FILTER_BLOCK,
  SET_SELECTED_PHOTOGRAPHER,
  UPDATE_PHOTOGRAPHER,
} from '../actions/actionTypes/photographers';

const initialState = Immutable({
  data: {
    content: [],
    pagination: {},
    filters: {},
  },
  selectedPhotographer: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_PHOTOGRAPHERS:
      return state.setIn(['data', 'content'], action.photographers);
    case APPEND_PHOTOGRAPHERS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.photographers]);
    case DELETE_PHOTOGRAPHER: {
      const users = _.filter(state.data.content, (photographerState) => photographerState.id !== action.photographerId);
      return state.setIn(['data', 'content'], users);
    }
    case SET_SELECTED_PHOTOGRAPHER:
      return state.set('selectedPhotographer', action.photographer);
    case UPDATE_PHOTOGRAPHER: {
      const index = _.findIndex(state.data.content, (data) => data.id === action.photographer.id);
      if (index !== -1) {
        return state.setIn(['data', 'content', index], action.photographer);
      }
      return state.setIn(['data', 'content'], [...state.data.content, action.photographer]);
    }
    case SAVE_PHOTOGRAPHERS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_PHOTOGRAPHERS_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case SET_PHOTOGRAPHERS_FILTER_BLOCK:
      return state.setIn(['data', 'filters'], action.filters);
    case RESET_PHOTOGRAPHERS_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case RESET_PHOTOGRAPHERS_DATA:
      return state.setIn(['data', 'content'], []);
    default:
      return state;
  }
}
