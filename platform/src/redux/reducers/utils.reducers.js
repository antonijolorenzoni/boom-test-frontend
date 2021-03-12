//
// ──────────────────────────────────────────────────────────────── I ──────────
//   :::::: U T I L   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import {
  SET_SPINNER_VISIBILITY,
  SET_SELECTED_LANGUAGE,
  SET_IS_APP_MOBILE,
  SET_LOADING_PROGRESS_VISIBLE,
  SET_LOADING_PROGRESS_VALUE,
  SAVE_PLATFORM_CURRENCIES,
  SAVE_PLATFORM_CURRENCIES_PAGINATION,
  SET_PLATFORM_CURRENCIES_FILTER,
  RESET_PLATFORM_CURRENCIES_FILTERS,
  SET_CALENDAR_TIMEZONE,
} from '../actions/actionTypes/utils';

const initialState = Immutable({
  spinner: {
    isVisible: false,
    title: null,
  },
  loader: {
    isVisible: false,
    progress: 0,
    title: null,
  },
  app: {
    isMobile: false,
  },
  selectedLanguage: '',
  selectedTimezone: null,
  currencies: {
    content: [],
    pagination: {},
    filters: {},
  },
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SPINNER_VISIBILITY:
      return state.setIn(['spinner', 'isVisible'], action.spinnerVisible).setIn(['spinner', 'title'], action.title);
    case SET_SELECTED_LANGUAGE:
      return state.set('selectedLanguage', action.language);
    case SET_IS_APP_MOBILE:
      return state.setIn(['app', 'isMobile'], action.isMobile);
    case SET_LOADING_PROGRESS_VALUE:
      return state.setIn(['loader', 'progress'], action.progress);
    case SET_LOADING_PROGRESS_VISIBLE:
      return state.setIn(['loader', 'isVisible'], action.isVisible).setIn(['loader', 'title'], action.title);
    case SAVE_PLATFORM_CURRENCIES:
      return state.setIn(['currencies', 'content'], action.currencies);
    case SAVE_PLATFORM_CURRENCIES_PAGINATION:
      return state.setIn(['currencies', 'pagination'], action.pagination);
    case SET_PLATFORM_CURRENCIES_FILTER:
      return state.setIn(['currencies', 'filters', action.field], action.value);
    case RESET_PLATFORM_CURRENCIES_FILTERS:
      return state.setIn(['currencies', 'filters'], initialState.currencies.filters);
    case SET_CALENDAR_TIMEZONE:
      return state.set('selectedTimezone', action.timezone);
    default:
      return state;
  }
}
