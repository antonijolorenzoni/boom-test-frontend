//
// ──────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   A C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────
//

import { datadogLogs } from '@datadog/browser-logs';
import { LogMessage } from 'utils/logger';
import _ from 'lodash';
import moment from 'moment';
import {
  SAVE_SHOOTINGS,
  APPEND_SHOOTINGS,
  SAVE_SHOOTINGS_PAGINATION,
  SET_SELECTED_SHOOTING,
  SET_SHOOTING_FILTER,
  SET_SHOOTING_FILTER_BLOCK,
  RESET_SHOOTING_FILTERS,
  UPDATE_SHOOTING,
  RESET_SHOOTINGS_DATA,
  DELETE_SHOOTING,
  SAVE_CALENDAR_SHOOTINGS,
  SAVE_DAILY_SHOOTINGS,
  SAVE_DAILY_SHOOTINGS_PAGINATION,
  APPEND_DAILY_SHOOTINGS,
  RESET_DAILY_SHOOTINGS,
  SET_DAILY_SHOOTING_FILTER,
  RESET_DAILY_SHOOTINGS_FILTERS,
  REPLACE_SHOOTING_TOOLTIP,
  REMOVE_SHOOTING_TOOLTIP,
  UPDATE_CALENDAR_SHOOTING,
} from './actionTypes/shootings';
import * as ShootingsAPI from '../../api/shootingsAPI';
import * as OrdersAPI from '../../api/ordersAPI';
import * as AWSAPI from '../../api/awsAPI';
import * as PhotographersAPI from '../../api/photographersAPI';
import * as InvoicingItemsAPI from '../../api/invoicingItemsAPI';
import * as CompaniesAPI from '../../api/companiesAPI';
import * as UtilsActions from './utils.actions';
import * as InvoiceItemsActions from './invoicingItems.actions';
import * as BalanceActions from './balance.actions';
import translations from '../../translations/i18next';
import {
  INVOICE_ITEMS_TYPES,
  HIDDEN_EVEN_TYPE_BOOM,
  HIDDEN_INVOICE_TYPES_EVENTS,
  PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES,
  SHOOTINGS_STATUSES,
} from '../../config/consts';

import { listCalendarPhOrders, listDashboardPhOrders } from 'api/photographerOrderAPI';

const HOUR_IN_MILLISECONDS = 3600_000;

export function showShootingTooltip(tooltipId) {
  return {
    type: REPLACE_SHOOTING_TOOLTIP,
    tooltipId,
  };
}

export function hideShootingTooltip(tooltipId) {
  return {
    type: REMOVE_SHOOTING_TOOLTIP,
    tooltipId,
  };
}

export function saveShootings(shootings) {
  return {
    type: SAVE_SHOOTINGS,
    shootings,
  };
}

export function saveCalendarShootings(calendarShootings) {
  return {
    type: SAVE_CALENDAR_SHOOTINGS,
    calendarShootings,
  };
}

export function updateCalendarShooting(shooting) {
  const calendarShooting = {
    title: shooting.title || `Shooting ${shooting.code}`,
    start: moment(shooting.startDate).toDate(),
    end: moment(shooting.endDate).toDate(),
    ...shooting,
  };
  return {
    type: UPDATE_CALENDAR_SHOOTING,
    shooting: calendarShooting,
  };
}

export function saveDailyShootings(dailyShootings) {
  return {
    type: SAVE_DAILY_SHOOTINGS,
    dailyShootings,
  };
}

export function saveDailyShootingsFilter(field, value) {
  return {
    type: SET_DAILY_SHOOTING_FILTER,
    field,
    value,
  };
}

export function resetDailyShootingsFilters() {
  return { type: RESET_DAILY_SHOOTINGS_FILTERS };
}

export function resetDailyShootingsData() {
  return { type: RESET_DAILY_SHOOTINGS };
}

export function saveDailyShootingsPagination(pagination) {
  return {
    type: SAVE_DAILY_SHOOTINGS_PAGINATION,
    pagination,
  };
}
export function appendDailyShootingsInState(shootings) {
  return {
    type: APPEND_DAILY_SHOOTINGS,
    shootings,
  };
}

export function appendShootingsInState(shootings) {
  return {
    type: APPEND_SHOOTINGS,
    shootings,
  };
}

export function setSelectedShooting(shooting) {
  return {
    type: SET_SELECTED_SHOOTING,
    shooting,
  };
}

export function updateShootingInState(shooting) {
  return {
    type: UPDATE_SHOOTING,
    shooting,
  };
}

export function saveShootingsPagination(pagination) {
  return {
    type: SAVE_SHOOTINGS_PAGINATION,
    pagination,
  };
}

export function setShootingFilter(field, value) {
  return {
    type: SET_SHOOTING_FILTER,
    field,
    value,
  };
}

export function setShootingFilterBlock(filters) {
  return {
    type: SET_SHOOTING_FILTER_BLOCK,
    filters,
  };
}

export function resetShootingFilter() {
  return {
    type: RESET_SHOOTING_FILTERS,
  };
}

export function resetShootingsData() {
  return { type: RESET_SHOOTINGS_DATA };
}

export function deleteShootingInState(shootingId) {
  return {
    type: DELETE_SHOOTING,
    shootingId,
  };
}

/*
 * Fetch shootings from BE
 */
export function fetchShootings(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
        user: {
          data: { organization, isPhotographer },
        },
      } = getState();

      let filterStates = filters.states ?? [];

      if (isPhotographer) {
        const newInviteStatus = filterStates.find((s) => s === PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES.NEW_INVITE);
        if (newInviteStatus) {
          filterStates = filterStates.filter((s) => s !== newInviteStatus);
          filterStates = [...filterStates, SHOOTINGS_STATUSES.PENDING, SHOOTINGS_STATUSES.AUTO_ASSIGNMENT, SHOOTINGS_STATUSES.ASSIGNED];
        }
      }

      const params = {
        page,
        pageSize,
        ...filters,
        states: filterStates,
      };

      const shootingsResponse = await ShootingsAPI.fetchShootings(organization, params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootings = shootingsResponse.data.content;
        // Calendar shootings have a different object shape and need to be saved separately
        const calendarShootings = _.map(shootings, (event) => ({
          title: event.title || `Shooting ${event.code}`,
          start: moment(event.startDate).toDate(),
          end: moment(event.endDate).toDate(),
          ...event,
        }));
        dispatch(saveShootings(shootings));
        dispatch(saveCalendarShootings(calendarShootings));
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return shootings;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/**
 ** Function that fetch shootings and append them to the already saved shooting on Redux State
 **/
export function fetchAndAppendShootings(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await listDashboardPhOrders(params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootings = shootingsResponse.data.content;
        dispatch(appendShootingsInState(shootings));
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return shootings;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/**
 * * Function that create the right data for CSV creation (called from ShootingManagement.jsx)
 * TODO: THE CSV MUST BE CREATED ON THE BACKEND SIDE 

 *
**/
export function fetchShootingsForCSV(filters, organization, page = 0, pageSize = 1000) {
  return async (dispatch) => {
    try {
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await ShootingsAPI.fetchShootings(organization, params);
      const shootingsToExport = [];
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootings = shootingsResponse.data.content;
        /**
         * * Promise map: fetch shootings information for every shooting
         */
        const approvationCalls = _.map(shootings, async (shooting) => {
          let shootingToExport = shooting;
          try {
            const shootingDetailedResponse = await ShootingsAPI.fetchShootingDetails(organization, shooting.id);
            if (shootingDetailedResponse && shootingDetailedResponse.data) {
              const shootingFetched = shootingDetailedResponse.data.shooting || shootingDetailedResponse.data;
              shootingToExport = shootingFetched;
            }
          } catch (error) {}
          try {
            const invoicingItemsResponse = await InvoicingItemsAPI.fetchInvoicingItems({
              shootingId: shooting.id,
              pageSize: 40,
            });
            if (invoicingItemsResponse && invoicingItemsResponse.data && invoicingItemsResponse.data.content) {
              shootingToExport = { ...shootingToExport, items: invoicingItemsResponse.data.content };
            }
          } catch (error) {}
          if (shooting && shooting.photographerId) {
            try {
              const photographerResponse = await PhotographersAPI.getPhotographerDetail(shooting.photographerId);
              if (photographerResponse && photographerResponse.data) {
                shootingToExport = { ...shootingToExport, photographer: photographerResponse.data };
              }
            } catch (error) {}
          }
          shootingsToExport.push(shootingToExport);
        });

        // AWAIT PROMISE MAP
        await Promise.all(approvationCalls);
        return shootingsToExport;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch Daily Shootings: they are saved in a different part of the Redux State with respect to normal shootings
 */
export function fetchDailyShootings(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          dailyShootings: { filters },
        },
        user: {
          data: { organization },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await ShootingsAPI.fetchShootings(organization, params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootings = shootingsResponse.data.content;
        dispatch(saveDailyShootings(shootings));
        dispatch(saveDailyShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return shootings;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch and append daily shootings
 */
export function fetchAndAppendDailyShootings(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          dailyShootings: { filters },
        },
        user: {
          data: { organization },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await ShootingsAPI.fetchShootings(organization, params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootings = shootingsResponse.data.content;
        dispatch(appendDailyShootingsInState(shootings));
        dispatch(saveDailyShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return shootings;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function that given the CreateShooting Form data extract the correct ShootingDTO and POST it.
 */
export function createNewShooting(shootingData) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const startDate = shootingData.date
        ? moment(shootingData.date)
            .set('hours', moment(shootingData.startTime).get('hours'))
            .set('minutes', moment(shootingData.startTime).get('minutes'))
            .valueOf()
        : null;

      const endDate = shootingData.date
        ? moment(shootingData.date)
            .set('hours', moment(shootingData.endTime).get('hours'))
            .set('minutes', moment(shootingData.endTime).get('minutes'))
            .valueOf()
        : null;

      const shootingDTO = {
        ...shootingData,
        place: shootingData.placeSelected.value,
        company: shootingData.companySelected.value.id,
        startDate,
        endDate,
      };

      const selectedOrganization = organization === 1 ? shootingData.organizationSelected.value.id : organization;
      const response = await ShootingsAPI.createShooting(selectedOrganization, shootingDTO);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Create shooting initial photographer refund
 */
export function setShootingInitialRefund(shootingId, amount) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const response = await ShootingsAPI.createShootingRefund(organization, shootingId, { amount });
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch more information about a shooting and update it in the Redux State
 */
export function fetchShootingDetails(shootingId) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const response = await ShootingsAPI.fetchShootingDetails(organization, shootingId);
      if (response && response.data) {
        const shootingFetched = response.data.shooting || response.data;
        dispatch(updateShootingInState(shootingFetched));
        return shootingFetched;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function invoked to update the shootings additional infomrmation
 */
export function updateShootingAdditionalInfo(shootingId, infoDTO) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const response = await ShootingsAPI.updateShooting(organization, shootingId, infoDTO);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function to accept an assigned shooting (ASSIGNED > ACCEPTED)
 */
export function acceptShooting(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.acceptShooting(organization, shootingId);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function to accept shooting photos (UPLOADED > POST PROCESSING)
 */

export function acceptShootingPhototos(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.acceptShootingPhotos(organization, shootingId);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function to cancel a shooting (X > CANCEL)
 */
export function cancelShootingReservation(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.cancelShooting(organization, shootingId);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function to assign a photographer to a shooting (X > ASSIGNED)
 */
export function assignShootingPhotographer(shootingId, photographerId, manualAssignPhotographerDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.assignShootingPhotographer(organization, shootingId, photographerId, manualAssignPhotographerDTO);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Remove the assigned photographer
 */
export function removeAssignShootingPhotographer(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.unassignShootingPhotographer(organization, shootingId);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Function to refuse an assigned shooting
 */

export function refuseShooting(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();

      const response = await ShootingsAPI.refuseShooting(organization, shootingId);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Retrieve the matched phorographer list
 */
export function fetchShootingMatchedPhotographers(shooting) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingMatchedPhotographers(organization, shooting.id);
      if (response && response.data) {
        dispatch(updateShootingInState({ ...shooting, matchedPhotographers: response.data }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchShootingCompanyPenalties(shooting) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingCompanyPenalties(organization, shooting.id);
      if (response && response.data) {
        dispatch(updateShootingInState({ ...shooting, companyPenalties: response.data }));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchShootingPhotographerRefunds(shooting, photographer) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingPhotographerRefunds(organization, shooting.id);
      if (photographer) {
        if (response && response.data) {
          dispatch(updateShootingInState({ ...shooting, photographerRefunds: response.data }));
          return response.data;
        }
      } else {
        const refunds = {
          photographerRefund: 0,
          photographerTravelRefund: 0,
          photographerRefundPercentage: 0,
          photographerTravelRefundPercentage: 0,
        };
        dispatch(updateShootingInState({ ...shooting, photographerRefunds: refunds }));
        return refunds;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Refuse shooting photos
 */
export function refuseShootingPhotos(shootingId, toBeReshoot = false, comments) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const params = {
        comments,
      };
      const response = await ShootingsAPI.refuseShootingPhotos(organization, shootingId, toBeReshoot, params);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Reschedule a shooting
 */
export function rescheduleShooting(shootingId, shootingRescheduledDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.rescheduleShooting(organization, shootingId, shootingRescheduledDTO);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Send the photographer reminder
 */
export function sendShootingReminder(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.sendShootingReminder(organization, shootingId);
      if (response && response.data) {
        dispatch(updateShootingInState(response.data));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch the list of shootings along with scores and photographer.
 * This is usefull for the Management Shooting View
 */
export function fetchShootingsToManage(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
        user: {
          data: { organization },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await ShootingsAPI.fetchShootings(organization, params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootingsFetched = shootingsResponse.data.content;
        dispatch(appendShootingsInState(shootingsResponse.data.content));
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        _.each(shootingsFetched, async (shooting) => {
          let shootingDetailed = shooting;
          try {
            const shootingsScores = await dispatch(getShootingScore(shooting));
            shootingDetailed = { ...shootingDetailed, score: shootingsScores };
          } catch (error) {}
          if (shooting && shooting.photographerId) {
            try {
              const photographerResponse = await PhotographersAPI.getPhotographerDetail(shooting.photographerId);
              if (photographerResponse && photographerResponse.data) {
                shootingDetailed = { ...shootingDetailed, photographer: photographerResponse.data };
              }
            } catch (error) {}
          }
          dispatch(updateShootingInState(shootingDetailed));
        });
        return shootingsResponse.data.content;
      }
    } catch (error) {
      throw error;
    }
  };
}

//
// ──────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: F I L E S   M A N A G E M E N T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────
//

//
// ──────────────────────────────────────────────────────── III ──────────
//   :::::: D O W N L O A D : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────
//

/*
 * Send the completion ACK of download success
 */
export function confirmPhotoDownloadSuccess(organization, shootingId) {
  return async () => {
    try {
      const response = await ShootingsAPI.confirmShootingPhotosDownload(organization, shootingId);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw new Error(error);
    }
  };
}

/*
 * Retrieve the download link and start the browser download with window.open
 */
export function downloadShootingsPhotos(shooting) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingPhotosRequest(organization, shooting.id);
      if (response && response.data && response.data.downloadLink) {
        window.open(response.data.downloadLink, 'download');
        await dispatch(confirmPhotoDownloadSuccess(organization, shooting.id));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Retrieve the download link of RAW photos and start the browser download with window.open
 */

export function downloadShootingsPhotosToReview(shooting) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingPhotosRawRequest(organization, shooting.id);
      if (response && response.data && response.data.downloadLink) {
        window.open(response.data.downloadLink, 'download');
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

//
// ──────────────────────────────────────────────────── III ──────────
//   :::::: U P L O A D : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────
// The uploadMultipartFile function splits the selectedFile into chunks
// of 15MB and does the following:
// (1) call the backend server for a presigned url for each part,
// (2) uploads them, and
// (3) upon completion of all responses, sends a completeMultipartUpload call to the backend server.
//
// Note: the AWS SDK can only split one file into 10,000 separate uploads.
// This means that, each uploaded part being 10MB, each file has a max size of
// 100GB.
// ──────────────────────────────────────────────────────────────

/*
 * Confirm revised photos upload to backend
 */
export function confirmPostProductionPhotosUploadedSuccess(organization, shootingId) {
  return async (dispatch, getState) => {
    try {
      const response = await ShootingsAPI.confirmShootingPostProducionPhotosUpload(organization, shootingId);
      if (response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw new Error(error);
    }
  };
}

/*
 * Send RAW part upload error to backend
 */
export function sendUploadRAWPartError(shootingId, errorDTO) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    const response = await ShootingsAPI.createRAWPartFailedLog(organization, shootingId, {
      payload: JSON.stringify(errorDTO),
    });
    return response;
  };
}

/*
 * Send POST part upload error to backend
 */
export function sendUploadPOSTPartError(shootingId, errorDTO) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    const response = await ShootingsAPI.createPOSTPartFailedLog(organization, shootingId, {
      payload: JSON.stringify(errorDTO),
    });
    return response;
  };
}

/*
 * Photographer RAW photo upload: First fetch the AWS upload Id and then send the parts (uploadRAWMultipartFile())
 */
export function uploadRAWPhotos(shootingId, file, comments) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
      shootings: {
        selectedShooting: { photographerId },
      },
    } = getState();
    const uploadPartStartTime = moment().valueOf();
    const stepsArray = [];
    try {
      const params = {
        fileName: file.name,
        fileType: file.type,
      };
      const response = await AWSAPI.getRAWMultipartUploadId(organization, shootingId, params);

      if (response && response.data && response.data.uploadId) {
        const { uploadId } = response.data;
        dispatch(UtilsActions.setLoadingProgress(0));
        await dispatch(uploadRAWMultipartFile(uploadId, shootingId, file, comments, stepsArray)); // upload ID
      }

      if (stepsArray.length > 0) {
        datadogLogs.logger.error(LogMessage.uploadRAWPhotos, {
          step: stepsArray,
          shootingId,
          photographerId: photographerId,
        });
      }
    } catch (error) {
      const errorTime = moment().diff(uploadPartStartTime);

      stepsArray.push('sendUploadRAWPartError ' + error.message);

      datadogLogs.logger.error(LogMessage.uploadRAWPhotos, {
        step: stepsArray,
        shootingId,
        photographerId: photographerId,
      });

      dispatch(
        sendUploadRAWPartError(shootingId, {
          description: 'Upload RAW photos fail',
          shootingId,
          fileName: file.name,
          timeElapsed: errorTime,
        })
      );

      throw error;
    }
  };
}

/*
 * UPLOAD RAW FILE SEQUENTIAL MULTIPART
 * (1) Divide the files into 10MB chunks and upload each chunk and generate the URL
 * (2) Uplaod each part on S3 server and retrieve the etag
 * (3) Generate the etags array
 * (4) Confirm the upload success
 */

export function uploadRAWMultipartFile(uploadId, shootingId, file, comments, stepsArray) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    const FILE_CHUNK_SIZE = 5500000; // 5.5MB in order to pass the minimum allowed object size by AWS fixed to 5MB
    const fileSize = file.size;
    const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1;
    let start;
    let end;
    let blobChunk;
    const eTagsArray = [];
    const uploadPartStartTime = moment().valueOf();

    for (let index = 1; index < NUM_CHUNKS + 1; index += 1) {
      start = (index - 1) * FILE_CHUNK_SIZE;
      end = index * FILE_CHUNK_SIZE;
      blobChunk = index < NUM_CHUNKS ? file.slice(start, end) : file.slice(start);
      const blobChunkSize = blobChunk.size;
      const perc = Math.round(((index - 1) / NUM_CHUNKS) * 100);
      // (1) Generate presigned URL for each part
      const params = {
        partNumber: index,
        uploadId,
        size: blobChunkSize,
      };
      let counter = 0;
      let hasFinishUpload = false;
      while (!hasFinishUpload) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const getUploadUrlResp = await AWSAPI.getRAWMultipartUrl(organization, shootingId, params);
          const { uploadLink } = getUploadUrlResp.data;

          // (2) Puts each file part into the storage server and get the AWS ETAG
          // eslint-disable-next-line no-await-in-loop
          const responser = await AWSAPI.uploadMediaS3(uploadLink, blobChunk, (progress) =>
            dispatch(UtilsActions.setLoadingProgress(perc + Math.round(progress / NUM_CHUNKS)))
          );
          eTagsArray.push(responser.headers.etag);
          hasFinishUpload = true;
        } catch (error) {
          const waitingTime = 2 ** counter * 100;

          if (waitingTime > HOUR_IN_MILLISECONDS) {
            const fileName = file.name;
            const partNumber = index;
            const partSize = blobChunkSize;
            const uploadID = uploadId;
            const errorFormatted = JSON.stringify(error);
            const errorTime = moment().diff(uploadPartStartTime);
            dispatch(
              sendUploadRAWPartError(shootingId, {
                shootingId,
                fileName,
                fileSize,
                partNumber,
                partSize,
                timeElapsed: errorTime,
                error: errorFormatted,
                uploadID,
              })
            );
            hasFinishUpload = true;
            throw error;
          } else {
            counter += 1;
            stepsArray.push(`uploadRAWMultipartFile retrying(${counter}) to upload ${index} of ${NUM_CHUNKS} chunks`);
            await sleep(waitingTime);
          }
        }
      }
    }

    try {
      // (3) Create the ETAGS array
      const uploadPartsArray = _.map(eTagsArray, (etag, index) => {
        return {
          etag: _.replace(etag, /"/g, ''),
          partNumber: index + 1,
        };
      });

      // (4) Calls the CompleteMultipartUpload endpoint in the backend server
      const params = {
        fileName: file.name,
        etags: uploadPartsArray,
        uploadId,
      };
      await AWSAPI.completeRAWMultipartUpload(organization, shootingId, params);
    } catch (error) {
      stepsArray.push('completeRAWMultipartUploadError ' + error.message);
      throw error;
    }

    try {
      // (4) Confirm to BE
      await ShootingsAPI.confirmShootingPhotosUpload(organization, shootingId, { comments });
    } catch (error) {
      stepsArray.push('confirmShootingPhotosUploadError ' + error.message);
      throw error;
    }
  };
}

/*
 * POST photo upload: First fetch the AWS upload Id and then send the parts (uploadPOSTMultipartFile())
 */
export function uploadPOSTPhotos(shootingId, file, comments) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const params = {
        fileName: file.name,
        fileType: file.type,
      };
      const response = await AWSAPI.getPOSTMultipartUploadId(organization, shootingId, params);
      if (response && response.data && response.data.uploadId) {
        const { uploadId } = response.data;
        dispatch(UtilsActions.setLoadingProgress(0));
        await dispatch(uploadPOSTMultipartFile(uploadId, shootingId, file, comments)); // upload ID
      }
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Upload a single chunk to S3 and return the eTag
 */

export function uploadChunkPOSTParallelProcedure(index, FILE_CHUNK_SIZE, NUM_CHUNKS, file, uploadId, shootingId) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    const start = (index - 1) * FILE_CHUNK_SIZE;
    const end = index * FILE_CHUNK_SIZE;
    const blobChunk = index < NUM_CHUNKS ? file.slice(start, end) : file.slice(start);
    const blobChunkSize = blobChunk.size;
    let savedProgress = false;
    // (1) Generate presigned URL for each part
    const params = {
      partNumber: index,
      uploadId,
      size: blobChunkSize,
    };
    const uploadPartStartTime = moment().valueOf();
    try {
      // eslint-disable-next-line no-await-in-loop
      const getUploadUrlResp = await AWSAPI.getPOSTMultipartUrl(organization, shootingId, params);
      const { uploadLink } = getUploadUrlResp.data;

      // (2) Puts each file part into the storage server
      // eslint-disable-next-line no-await-in-loop

      const responser = await AWSAPI.uploadMediaS3(uploadLink, blobChunk, (p) => {
        const {
          utils: {
            loader: { progress },
          },
        } = getState();
        if (p === 100 && !savedProgress) {
          savedProgress = true; // control variable for axios p variable bug
          dispatch(UtilsActions.setLoadingProgress(progress + (1 / NUM_CHUNKS) * 100));
        }
      });
      return responser.headers.etag;
    } catch (error) {
      const fileName = file.name;
      const fileSize = file.size;
      const partNumber = index;
      const partSize = blobChunkSize;
      const uploadID = uploadId;
      const errorFormatted = JSON.stringify(error);
      const errorTime = moment().diff(uploadPartStartTime);
      dispatch(
        sendUploadPOSTPartError(shootingId, {
          shootingId,
          fileName,
          fileSize,
          partNumber,
          partSize,
          error: errorFormatted,
          timeElapsed: errorTime,
          uploadID,
        })
      );
      throw error;
    }
  };
}

/*
 * UPLOAD POST PARALLER PROCEDURE
 * (1) Divide the file in 15MB chunks
 * (2) Create a Map of Promise for every chunk
 * (3) Await the Promise Map and obtain the ETAGS
 * (4) Confirm POST UPLOAd SUCCESS
 */

export function uploadPOSTMultipartFile(uploadId, shootingId, file, comments) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    const FILE_CHUNK_SIZE = 15000000; // 15MB
    const fileSize = file.size;
    const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1;
    const uploadChunksPromises = _.map(_.times(NUM_CHUNKS), (value) =>
      dispatch(uploadChunkPOSTParallelProcedure(value + 1, FILE_CHUNK_SIZE, NUM_CHUNKS, file, uploadId, shootingId))
    );
    try {
      const eTagsArray = await Promise.all(uploadChunksPromises);
      const uploadPartsArray = _.map(eTagsArray, (etag, index) => {
        return {
          etag: _.replace(etag, /"/g, ''),
          partNumber: index + 1,
        };
      });

      // (3) Calls the CompleteMultipartUpload endpoint in the backend server
      const params = {
        fileName: file.name,
        etags: uploadPartsArray,
        uploadId,
      };

      await AWSAPI.completePOSTMultipartUpload(organization, shootingId, params);
      // (4) Confirm to BE
      const successResponse = await dispatch(confirmPostProductionPhotosUploadedSuccess(organization, shootingId));
      return successResponse;
    } catch (error) {
      throw error;
    }
  };
}

//
// ────────────────────────────────────────────────────────────────────────── III ──────────
//   :::::: S C O R E S   M A N A G E M E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────
//

/*
 * Get shooting score
 */
export function getShootingScore(shooting) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingScores(organization, shooting.id);
      if (response && response.data && response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch the list of shootings and then for each shooting fetch its score
 */

export function fetchShootingsWithScores(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await listDashboardPhOrders(params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootingsFetched = shootingsResponse.data.content;
        dispatch(appendShootingsInState(shootingsResponse.data.content));
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        _.each(shootingsFetched, async (shooting) => {
          try {
            const shootingsScores = await dispatch(getShootingScore(shooting));
            dispatch(updateShootingInState({ ...shooting, score: shootingsScores }));
            return { ...shooting, score: shootingsScores };
          } catch (error) {
            dispatch(updateShootingInState(shooting));
            return shooting;
          }
        });
        return shootingsResponse.data.content;
      }
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Create the company shooting evaluation
 */
export function createCompanyShootingScore(shootingId, scoreValue) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const scoreDTO = {
        companyScore: scoreValue,
      };
      const response = await ShootingsAPI.createCompanyShootingScore(organization, shootingId, scoreDTO);
      if (response && response.data && response.data) {
        dispatch(getShootingScore(shootingId));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Create the BOOM shooting evaluation
 */

export function createBoomShootingScore(shooting, scoreDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.createCompanyShootingScoreBOOM(organization, shooting.id, scoreDTO);
      if (response && response.data && response.data) {
        dispatch(getShootingScore(shooting));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Create the shooting uopload notes
 */
export function createShootingUploadNotes(shooting, notesDTO) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const data = {
        uploadNotes: notesDTO,
      };
      const response = await ShootingsAPI.createShootingUploadNotes(organization, shooting.id, data);
      if (response && response.data && response.data) {
        dispatch(updateShootingInState(shooting));
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Retrieve shooting upload notes
 */
export function fetchShootingUploadNotes(shootingId) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const response = await ShootingsAPI.fetchShootingUploadNotes(organization, shootingId);
      if (response && response.data && response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

//
// ──────────────────────────────────────────────────────────────────────────────────────── III ──────────
//   :::::: S H O O T I N G S   F E T C H I N G   C A L L S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────
//

/*
 * Fetch shooting list and fetch their details
 */
export function fetchShootingsWithDetails(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await listDashboardPhOrders(params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootingsFetched = shootingsResponse.data.content;
        const approvationCalls = _.map(shootingsFetched, async (shooting) => {
          try {
            const shootingDetails = await dispatch(fetchShootingDetails(shooting.id));
            dispatch(updateShootingInState({ ...shootingDetails }));
            return { ...shootingDetails };
          } catch (error) {
            dispatch(updateShootingInState(shooting));
            return shooting;
          }
        });
        await Promise.all(approvationCalls);
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return shootingsResponse.data.content;
      }
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch shooting list and fetch their invoice items
 */
export function fetchShootingsWithItems(page = 0, pageSize = 10) {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
        user: {
          data: { organization },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const shootingsResponse = await ShootingsAPI.fetchShootings(organization, params);
      if (shootingsResponse && shootingsResponse.data && shootingsResponse.data.content) {
        const shootingsFetched = shootingsResponse.data.content;
        const approvationCalls = _.map(shootingsFetched, async (shooting) => {
          try {
            dispatch(InvoiceItemsActions.setInvoicingItemFilter('shootingId', shooting.id));
            const shootingInvoiceItems = await dispatch(InvoiceItemsActions.fetchInvoicingItems(0, 5000));
            dispatch(InvoiceItemsActions.resetInvoicingItemsData());
            dispatch(InvoiceItemsActions.resetInvoicingItemsFilters());
            dispatch(updateShootingInState({ ...shooting, items: shootingInvoiceItems }));
            return { ...shooting, items: shootingInvoiceItems };
          } catch (error) {
            dispatch(updateShootingInState(shooting));
            return shooting;
          }
        });
        await Promise.all(approvationCalls);
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return shootingsResponse.data.content;
      }
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch shooting list and then fetch:
 * 1: shooting invoice items
 * 2: shooting photographer
 * 3: shooting upload note
 * 4: shooting event log
 * 5: checklist
 * REST paradignm it's a bitch
 */
export function fetchShootingDetailsAndItems(shooting) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const response = await ShootingsAPI.fetchShootingDetails(organization, shooting.id);
      if (response && response.data) {
        const shootingFetched = response.data.shooting || response.data;
        dispatch(InvoiceItemsActions.setInvoicingItemFilter('shootingId', shooting.id));
        let shootingDetails = { ...shootingFetched, score: shooting.score };
        try {
          const shootingInvoiceItems = await dispatch(InvoiceItemsActions.fetchInvoicingItems(0, 5000));
          shootingDetails = { ...shootingDetails, items: shootingInvoiceItems };
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
        }
        if (shootingDetails.photographerId) {
          try {
            const photographerResponse = await PhotographersAPI.getPhotographerDetail(shootingDetails.photographerId);
            shootingDetails = { ...shootingDetails, photographer: photographerResponse.data };
          } catch (error) {
            dispatch(updateShootingInState(shootingDetails));
          }
        }
        try {
          const uploadNotes = await dispatch(fetchShootingUploadNotes(shooting.id));
          shootingDetails = { ...shootingDetails, uploadNotes };
          dispatch(updateShootingInState(shootingDetails));
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
        }
        try {
          const events = await dispatch(fetchShootingEvents(shooting.id));
          const filteredEvents = _.filter(
            events,
            (event) =>
              !(
                event.type in HIDDEN_EVEN_TYPE_BOOM ||
                ((event.type === 'INVOICE_ITEM_CREATED' || event.type === 'INVOICE_ITEM_DELETED') &&
                  event.invoiceItem &&
                  event.invoiceItem.type in HIDDEN_INVOICE_TYPES_EVENTS)
              )
          );
          shootingDetails = { ...shootingDetails, events: filteredEvents };
          dispatch(updateShootingInState(shootingDetails));
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
        }
        try {
          const shootingsScores = await dispatch(getShootingScore(shooting));
          shootingDetails = { ...shootingDetails, score: shootingsScores };
          dispatch(updateShootingInState(shootingDetails));
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
        }
        try {
          const checklist = await dispatch(fetchShootingChecklist(shootingDetails));
          shootingDetails = { ...shootingDetails, checklist };
          dispatch(updateShootingInState(shootingDetails));
          return shootingDetails;
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
          return shootingDetails;
        }
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Given a single shooting fetch:
 * 1: all information of photographer balance (penalty and refund)
 * 2: shooting checklist
 * 3: shooting event log
 */
export function fetchShootingDetailsAndPenalties(shooting) {
  return async (dispatch, getState) => {
    const {
      user: {
        data: { organization },
      },
    } = getState();
    try {
      const response = await ShootingsAPI.fetchShootingDetails(organization, shooting.id);
      if (response && response.data) {
        dispatch(BalanceActions.setBalanceItemsFilter('shootingId', shooting.id));
        const shootingFetched = response.data.shooting || response.data;
        let shootingDetails = { ...shootingFetched, score: shooting.score };
        try {
          const photographerItems = await dispatch(BalanceActions.fetchPhotographerPersonalBalance(0, 50));
          dispatch(BalanceActions.resetBalanceItemsData());
          dispatch(BalanceActions.resetBalanceItemsFilters());
          shootingDetails = { ...shootingDetails, photographerItems };
          dispatch(updateShootingInState(shootingDetails));
        } catch (error) {
          dispatch(BalanceActions.resetBalanceItemsData());
          dispatch(BalanceActions.resetBalanceItemsFilters());
          dispatch(updateShootingInState(shootingDetails));
        }
        try {
          const events = await dispatch(fetchShootingEvents(shooting.id));
          shootingDetails = { ...shootingDetails, events };
          dispatch(updateShootingInState(shootingDetails));
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
        }
        try {
          const checklist = await dispatch(fetchShootingChecklist(shootingFetched));
          shootingDetails = { ...shootingDetails, checklist };
          dispatch(updateShootingInState(shootingDetails));
          return shootingDetails;
        } catch (error) {
          dispatch(updateShootingInState(shootingDetails));
          return shootingDetails;
        }
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Cancel shooting by BOOM:
 * Depending on the cancelData a photoghrapher/company penalty can be created
 */
export function cancelShootingWithInvoices(shootingId, cancelData, selectedReason, textReason) {
  return async (dispatch, getState) => {
    try {
      let companyPenaltyItemDTO;
      let companyTravelPenaltyItemDTO;
      let photographerRefundItemDTO;
      let photographerTravelRefundItemDTO;
      const customPenalties = [];

      if (cancelData.companyPenalties && cancelData.companyPenalties !== 0) {
        companyPenaltyItemDTO = {
          amount: cancelData.companyPenalties.companyPenalty,
          companyId: cancelData.company && cancelData.company.id,
          currencyId:
            cancelData && cancelData.pricingPackage && cancelData.pricingPackage.currency ? cancelData.pricingPackage.currency.id : 1,
          itemDate: moment().valueOf(),
          income: false,
          shootingId,
          type: INVOICE_ITEMS_TYPES.COMPANY_PENALTY,
          description: `${translations.t('invoice.invoicePenaltyTitle')} ${cancelData.code}`,
          percentage: cancelData.companyPenalties.companyPenaltyPercentage,
          cancellationNotes: cancelData.cancellationNotes,
          authorizedBy: cancelData.authorization && cancelData.authorization.label,
        };

        customPenalties.push(companyPenaltyItemDTO);
        companyTravelPenaltyItemDTO = {
          amount: cancelData.companyPenalties.companyTravelPenalty,
          companyId: cancelData.company && cancelData.company.id,
          currencyId:
            cancelData && cancelData.pricingPackage && cancelData.pricingPackage.currency ? cancelData.pricingPackage.currency.id : 1,
          itemDate: moment().valueOf(),
          income: false,
          shootingId,
          type: INVOICE_ITEMS_TYPES.SHOOTING_TRAVEL_EXPENSES,
          description: `${translations.t('invoice.invoiceTravelPenaltyTitle')} ${cancelData.code}`,
          percentage: cancelData.companyPenalties.companyTravelPenaltyPercentage,
          cancellationNotes: cancelData.cancellationNotes,
          authorizedBy: cancelData.authorization && cancelData.authorization.label,
        };
        customPenalties.push(companyTravelPenaltyItemDTO);
      }

      if (cancelData.photographerRefunds && cancelData.photographerRefunds !== 0) {
        photographerRefundItemDTO = {
          amount: cancelData.photographerRefunds.photographerRefund,
          photographerId: cancelData.photographer && cancelData.photographer.id,
          currencyId:
            cancelData && cancelData.pricingPackage && cancelData.pricingPackage.currency ? cancelData.pricingPackage.currency.id : 1,
          itemDate: moment().valueOf(),
          income: true,
          shootingId,
          type: INVOICE_ITEMS_TYPES.PHOTOGRAPHER_REFUND,
          description: `${translations.t('invoice.invoiceRefundTitle')} ${cancelData.code}`,
          percentage: cancelData.photographerRefunds.photographerRefundPercentage,
          cancellationNotes: cancelData.cancellationNotes,
          authorizedBy: cancelData.authorization && cancelData.authorization.label,
        };

        customPenalties.push(photographerRefundItemDTO);
        photographerTravelRefundItemDTO = {
          amount: cancelData.photographerRefunds.photographerTravelRefund,
          photographerId: cancelData.photographer && cancelData.photographer.id,
          currencyId:
            cancelData && cancelData.pricingPackage && cancelData.pricingPackage.currency ? cancelData.pricingPackage.currency.id : 1,
          itemDate: moment().valueOf(),
          income: true,
          shootingId,
          type: INVOICE_ITEMS_TYPES.PHOTOGRAPHER_TRAVEL_EXPENSES,
          description: `${translations.t('invoice.invoiceTravelRefundTitle')} ${cancelData.code}`,
          percentage: cancelData.photographerRefunds.photographerTravelRefundPercentage,
          cancellationNotes: cancelData.cancellationNotes,
          authorizedBy: cancelData.authorization && cancelData.authorization.label,
        };
        customPenalties.push(photographerTravelRefundItemDTO);
      }

      await OrdersAPI.deleteOrder(shootingId, selectedReason, textReason, customPenalties);
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch a shooting ocmpany checklist
 */
export function fetchShootingChecklist(shooting) {
  return async (dispatch, getState) => {
    try {
      const {
        user: {
          data: { organization },
        },
      } = getState();
      const { company } = shooting;
      const response = await CompaniesAPI.fetchCompanyShootingChecklist(organization, company.id);
      if (response && response.data) {
        return response.data;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

/*
 * Fetch a shooting event log
 */
export function fetchShootingEvents(shootingId) {
  return async (dispatch, getState) => {
    try {
      const params = {
        pageSize: 100,
        page: 0,
      };
      const response = await ShootingsAPI.fetchShootingEvents(shootingId, params);
      if (response && response.data && response.data.content) {
        const orderedEvents = _.orderBy(response.data.content, 'createdAt', 'desc');
        return orderedEvents;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function fetchCalendarPhOrders() {
  return async (dispatch, getState) => {
    try {
      const {
        shootings: {
          data: { filters },
        },
      } = getState();

      let filterStates = filters.states ?? [];

      const newInviteStatus = filterStates.find((s) => s === PHOTOGRAPHER_SHOOTING_CALENDAR_STATUSES.NEW_INVITE);
      if (newInviteStatus) {
        filterStates = filterStates.filter((s) => s !== newInviteStatus);
        filterStates = [...filterStates, SHOOTINGS_STATUSES.PENDING, SHOOTINGS_STATUSES.AUTO_ASSIGNMENT, SHOOTINGS_STATUSES.ASSIGNED];
      }

      const params = {
        ...filters,
        states: filterStates,
      };

      const shootingsResponse = await listCalendarPhOrders(params);
      if (shootingsResponse && shootingsResponse.data) {
        // Calendar shootings have a different object shape and need to be saved separately
        const calendarShootings = _.map(shootingsResponse.data, (event) => ({
          title: event.title || `Shooting ${event.code}`,
          start: moment(event.startDate).toDate(),
          end: moment(event.endDate).toDate(),
          ...event,
        }));
        dispatch(saveCalendarShootings(calendarShootings));
        dispatch(saveShootingsPagination(_.omit(shootingsResponse.data, 'content')));
        return calendarShootings;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}
