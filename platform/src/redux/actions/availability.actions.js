//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   A V A I L A B I L I T Y   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import moment from 'moment';
import {
  SAVE_USER_UNAVAILABILITY,
  SET_UNAVAILABILITY_FILTERS,
  RESET_UNAVAILABILITY_FILTERS,
  RESET_UNAVAILABILITY_DATA,
  SET_UNAVAILABILITY_FILTERS_BLOCK,
} from './actionTypes/availability';
import * as PhotographersAPI from '../../api/photographersAPI';
import { elaborateUnavailabilityCalendarEvents } from '../../config/utils';

export function saveUserUnavailability(unavailabilities) {
  return {
    type: SAVE_USER_UNAVAILABILITY,
    unavailabilities,
  };
}

export function setUnavailabilityFilters(field, value) {
  return {
    type: SET_UNAVAILABILITY_FILTERS,
    field,
    value,
  };
}

export function setUnavailabilityFilterBlock(filters) {
  return {
    type: SET_UNAVAILABILITY_FILTERS_BLOCK,
    filters,
  };
}

export function resetUnavailabilityFilters() {
  return { type: RESET_UNAVAILABILITY_FILTERS };
}

export function resetUnavailabilityData() {
  return { type: RESET_UNAVAILABILITY_DATA };
}

export function fetchPhotographerUnavailability() {
  return async (dispatch, getState) => {
    try {
      const {
        availability: {
          data: { filters },
        },
      } = getState();
      const params = {
        ...filters,
      };
      const response = await PhotographersAPI.getPhotographerUnavailabilities(params);
      if (response.data) {
        const unavailabilities = response.data.content;
        const calendarUnavailabilities = _.flatMap(unavailabilities, (event) =>
          elaborateUnavailabilityCalendarEvents(event, filters.dateFrom, filters.dateTo)
        );
        dispatch(saveUserUnavailability(calendarUnavailabilities));
        return calendarUnavailabilities;
      }
      throw new Error();
    } catch (e) {
      throw new Error(e);
    }
  };
}

export function createUserUnavailability(unavailability) {
  return async (dispatch) => {
    try {
      const { startTime, endTime, date, timezone } = unavailability;
      const unavailabilityDTO = {
        startDate: moment(date)
          .set('hours', moment(startTime).get('hours'))
          .set('minutes', moment(startTime).get('minutes'))
          .valueOf(),
        endDate: moment(date)
          .set('hours', moment(endTime).get('hours'))
          .set('minutes', moment(endTime).get('minutes'))
          .valueOf(),
        periodicity: unavailability.periodicity ? 'WEEKLY' : 'NONE',
        timezone,
      };
      const response = await PhotographersAPI.setPhotographerUnavailabilities(unavailabilityDTO);
      if (response.data) {
        dispatch(fetchPhotographerUnavailability());
        return response.data;
      }
      throw new Error();
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.code) throw error.response.data.code;
      throw error;
    }
  };
}

export function deleteUserUnavailability(unavailabilityId) {
  return async (dispatch) => {
    try {
      const response = await PhotographersAPI.deletePhotographerUnavailabilities(unavailabilityId);
      if (response) {
        dispatch(fetchPhotographerUnavailability());
        return;
      }
      throw new Error();
    } catch (e) {
      throw e;
    }
  };
}

export function changeUserUnavailabilityPeriodicity(periodicity, id) {
  return async (dispatch) => {
    try {
      const response = await PhotographersAPI.modifyUserUnavailability(periodicity, id);
      if (response) {
        dispatch(fetchPhotographerUnavailability());
        return;
      }
      throw new Error();
    } catch (e) {
      throw e;
    }
  };
}
