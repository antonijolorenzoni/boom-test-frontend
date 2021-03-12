//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N I E S   A N D   P H O T O G R A P H E R S   B A L A N C E   A C T I O N S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import _ from 'lodash';
import * as BalanceAPI from '../../api/balanceAPI';

import {
  SAVE_BALANCE_ITEMS,
  APPEND_BALANCE_ITEMS,
  SAVE_BALANCE_ITEMS_PAGINATION,
  SET_BALANCE_FILTER,
  RESET_BALANCE_FILTER,
  RESET_BALANCE_DATA,
} from './actionTypes/balance';

export function saveBalanceItems(items) {
  return {
    type: SAVE_BALANCE_ITEMS,
    items,
  };
}

export function appendBalanceItems(items) {
  return {
    type: APPEND_BALANCE_ITEMS,
    items,
  };
}

export function saveBalanceItemsPagination(pagination) {
  return {
    type: SAVE_BALANCE_ITEMS_PAGINATION,
    pagination,
  };
}

export function setBalanceItemsFilter(field, value) {
  return {
    type: SET_BALANCE_FILTER,
    field,
    value,
  };
}

export function resetBalanceItemsFilters() {
  return { type: RESET_BALANCE_FILTER };
}

export function resetBalanceItemsData() {
  return { type: RESET_BALANCE_DATA };
}

export function fetchCompanyBalance(page = 0, pageSize = 50000) {
  return async (dispatch, getState) => {
    try {
      const {
        balance: {
          data: { filters },
        },
        companies: { selectedRootCompany },
        organizations: { selectedOrganization: organization },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const balanceResponse = await BalanceAPI.fetchCompanyBalance(organization.id, selectedRootCompany.id, params);
      if (balanceResponse && balanceResponse.data && balanceResponse.data.content) {
        dispatch(saveBalanceItems(balanceResponse.data.content));
        dispatch(saveBalanceItemsPagination(_.omit(balanceResponse.data, 'content')));
        return balanceResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchPhotographerBalance(page = 0, pageSize = 50000) {
  return async (dispatch, getState) => {
    try {
      const {
        balance: {
          data: { filters },
        },
        photographers: { selectedPhotographer },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const balanceResponse = await BalanceAPI.fetchPhotographerBalance(selectedPhotographer.id, params);
      if (balanceResponse && balanceResponse.data && balanceResponse.data.content) {
        dispatch(saveBalanceItems(balanceResponse.data.content));
        dispatch(saveBalanceItemsPagination(_.omit(balanceResponse.data, 'content')));
        return balanceResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchPhotographerPersonalBalance(page = 0, pageSize = 50000) {
  return async (dispatch, getState) => {
    try {
      const {
        balance: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const balanceResponse = await BalanceAPI.fetchPhotographerPersonalBalance(params);
      const content = _.get(balanceResponse, 'data.content');
      if (content) {
        dispatch(saveBalanceItems(balanceResponse.data.content));
        dispatch(saveBalanceItemsPagination(_.omit(balanceResponse.data, 'content')));
        return balanceResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}

export function fetchPhotographerAccountingBalance(page = 0, pageSize = 50000) {
  return async (dispatch, getState) => {
    try {
      const {
        balance: {
          data: { filters },
        },
      } = getState();
      const params = {
        page,
        pageSize,
        ...filters,
      };
      const balanceResponse = await BalanceAPI.fetchPhotographerAccountingBalance(params);
      const content = _.get(balanceResponse, 'data.content');
      if (content) {
        dispatch(saveBalanceItems(balanceResponse.data.content));
        dispatch(saveBalanceItemsPagination(_.omit(balanceResponse.data, 'content')));
        return balanceResponse.data.content;
      }
      throw new Error();
    } catch (error) {
      throw error;
    }
  };
}
