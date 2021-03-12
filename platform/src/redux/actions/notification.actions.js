//
// ────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: N O T I F I C A T I O N S   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import * as NotificationsAPI from '../../api/notificationsAPI';
import {
  APPEND_NOTIFICATIONS,
  RESET_NOTIFICATIONS_DATA,
  RESET_NOTIFICATIONS_FILTERS,
  SAVE_NOTIFICATIONS,
  SAVE_NOTIFICATIONS_PAGINATION,
  SET_NOTIFICATIONS_FILTER,
  SET_SELECTED_NOTIFICATION,
} from './actionTypes/notifications';

export function saveNotifications(notifications) {
  return {
    type: SAVE_NOTIFICATIONS,
    notifications,
  };
}

export function appendNotifications(notifications) {
  return {
    type: APPEND_NOTIFICATIONS,
    notifications,
  };
}

export function setSelectedNotification(notification) {
  return {
    type: SET_SELECTED_NOTIFICATION,
    notification,
  };
}

export function saveNotificationsPagination(pagination) {
  return {
    type: SAVE_NOTIFICATIONS_PAGINATION,
    pagination,
  };
}

export function saveNotificationsFilter(field, value) {
  return {
    type: SET_NOTIFICATIONS_FILTER,
    field,
    value,
  };
}

export function resetNotificationsFilters() {
  return { type: RESET_NOTIFICATIONS_FILTERS };
}

export function resetNotificationsData() {
  return { type: RESET_NOTIFICATIONS_DATA };
}

export function fetchNotifications(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        notifications: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const notificationsResponse = await NotificationsAPI.fetchNotifications(params);
      if (notificationsResponse && notificationsResponse.data && notificationsResponse.data.content) {
        dispatch(saveNotifications(notificationsResponse.data.content));
        dispatch(saveNotificationsPagination(_.omit(notificationsResponse.data, 'content')));
        return notificationsResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchAndAppendNotifications(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        notifications: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const notificationsResponse = await NotificationsAPI.fetchNotifications(params);
      if (notificationsResponse && notificationsResponse.data && notificationsResponse.data.content) {
        dispatch(appendNotifications(notificationsResponse.data.content));
        dispatch(saveNotificationsPagination(_.omit(notificationsResponse.data, 'content')));
        return notificationsResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export async function markNotificationAsRead(notificationID) {
  try {
    const notificationsResponse = await NotificationsAPI.markNotificationAsRead(notificationID);
    return notificationsResponse;
  } catch (error) {
    throw new Error();
  }
}
