//
// ────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G S   R E D U C E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import moment from 'moment';
import Immutable from 'seamless-immutable';
import {
  UPDATE_CALENDAR_SHOOTING,
  APPEND_DAILY_SHOOTINGS,
  REPLACE_SHOOTING_TOOLTIP,
  REMOVE_SHOOTING_TOOLTIP,
  APPEND_SHOOTINGS,
  DELETE_SHOOTING,
  RESET_DAILY_SHOOTINGS,
  RESET_DAILY_SHOOTINGS_FILTERS,
  RESET_SHOOTINGS_DATA,
  RESET_SHOOTING_FILTERS,
  SAVE_CALENDAR_SHOOTINGS,
  SAVE_DAILY_SHOOTINGS,
  SAVE_DAILY_SHOOTINGS_PAGINATION,
  SAVE_SHOOTINGS,
  SAVE_SHOOTINGS_PAGINATION,
  SET_DAILY_SHOOTING_FILTER,
  SET_SELECTED_SHOOTING,
  SET_SHOOTING_FILTER,
  SET_SHOOTING_FILTER_BLOCK,
  UPDATE_SHOOTING,
} from '../actions/actionTypes/shootings';

const initialState = Immutable({
  data: {
    content: [],
    pagination: {},
    filters: {
      states: [],
    },
  },
  dailyShootings: {
    content: [],
    pagination: {},
    filters: {
      dateFrom: moment().startOf('day').valueOf(),
      dateTo: moment().endOf('day').valueOf(),
    },
  },
  calendarShootings: [],
  calendarTootilps: [],
  selectedShooting: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_SHOOTINGS:
      return state.setIn(['data', 'content'], action.shootings);
    case SAVE_CALENDAR_SHOOTINGS:
      return state.set('calendarShootings', action.calendarShootings);
    case UPDATE_CALENDAR_SHOOTING: {
      const index = _.findIndex(state.calendarShootings, (data) => data.id === action.shooting.id);
      if (index !== -1) {
        return state.setIn(['calendarShootings', index], action.shooting);
      }
      return state.set('calendarShootings', [...state.data.content, action.shooting]);
    }
    case APPEND_SHOOTINGS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.shootings]);
    case RESET_SHOOTINGS_DATA:
      return state.setIn(['data', 'content'], []).setIn(['data', 'pagination'], {});
    case UPDATE_SHOOTING: {
      const index = _.findIndex(state.data.content, (data) => data.id === action.shooting.id);
      if (index !== -1) {
        return state.setIn(['data', 'content', index], action.shooting);
      }
      return state.setIn(['data', 'content'], [...state.data.content, action.shooting]);
    }
    case REPLACE_SHOOTING_TOOLTIP:
      return state.set('calendarTootilps', [action.tooltipId]);
    case REMOVE_SHOOTING_TOOLTIP: {
      const tooltips = _.filter(state.calendarTootilps, (tooltipsState) => tooltipsState !== action.tooltipId);
      return state.set('calendarTootilps', tooltips);
    }
    case DELETE_SHOOTING: {
      const shootings = _.filter(state.data.content, (shootingInState) => shootingInState.id !== action.shootingId);
      return state.setIn(['data', 'content'], shootings);
    }
    case SAVE_SHOOTINGS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SAVE_DAILY_SHOOTINGS:
      return state.setIn(['dailyShootings', 'content'], action.dailyShootings);
    case APPEND_DAILY_SHOOTINGS:
      return state.setIn(['dailyShootings', 'content'], [...state.dailyShootings.content, ...action.shootings]);
    case SAVE_DAILY_SHOOTINGS_PAGINATION:
      return state.setIn(['dailyShootings', 'pagination'], action.pagination);
    case SET_DAILY_SHOOTING_FILTER:
      return state.setIn(['dailyShootings', 'filters', action.field], action.value);
    case RESET_DAILY_SHOOTINGS:
      return state.setIn(['dailyShootings', 'content'], {}).setIn(['dailyShootings', 'pagination'], {});
    case RESET_DAILY_SHOOTINGS_FILTERS:
      return state.setIn(['dailyShootings', 'filters'], initialState.dailyShootings.filters);
    case SET_SELECTED_SHOOTING:
      return state.set('selectedShooting', action.shooting);
    case SET_SHOOTING_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case SET_SHOOTING_FILTER_BLOCK:
      return state.setIn(['data', 'filters'], action.filters);
    case RESET_SHOOTING_FILTERS:
      return state.setIn(['data', 'filters'], {});
    default:
      return state;
  }
}
