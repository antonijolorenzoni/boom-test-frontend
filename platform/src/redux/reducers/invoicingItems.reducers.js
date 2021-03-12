//
// ────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: I N V O I C E   I T E M S   R E D U C E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import _ from 'lodash';
import {
  SAVE_INVOICING_ITEMS,
  APPEND_INVOICING_ITEMS,
  SAVE_INVOICING_ITEMS_PAGINATION,
  SET_SELECTED_INVOICING_ITEM,
  RESET_INVOICING_ITEMS_DATA,
  SET_INVOICING_ITEMS_FILTER,
  RESET_INVOICING_ITEMS_FILTERS,
  DELETE_INVOICE_ITEM,
  UPDATE_OR_ADD_INVOICE_ITEM,
} from '../actions/actionTypes/invoicingItems';

const initialState = Immutable({
  data: {
    content: [],
    filters: {},
  },
  selectedInvoiceItem: {},
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_INVOICING_ITEMS:
      return state.setIn(['data', 'content'], action.items);
    case APPEND_INVOICING_ITEMS:
      return state.setIn(['data', 'content'], [...state.data.content, ...action.items]);
    case SAVE_INVOICING_ITEMS_PAGINATION:
      return state.setIn(['data', 'pagination'], action.pagination);
    case SET_INVOICING_ITEMS_FILTER:
      return state.setIn(['data', 'filters', action.field], action.value);
    case RESET_INVOICING_ITEMS_FILTERS:
      return state.setIn(['data', 'filters'], {});
    case RESET_INVOICING_ITEMS_DATA:
      return state.setIn(['data', 'content'], []).setIn(['data', 'pagination'], {});
    case UPDATE_OR_ADD_INVOICE_ITEM: {
      const index = _.findIndex(state.data.content, (data) => data.id === action.item.id);
      if (index !== -1) {
        return state.setIn(['data', 'content', index], action.item);
      }
      return state.setIn(['data', 'content'], [...state.data.content, action.item]);
    }
    case DELETE_INVOICE_ITEM: {
      const items = _.filter(state.data.content, (itemState) => itemState.id !== action.itemId);
      return state.setIn(['data', 'content'], items);
    }
    case SET_SELECTED_INVOICING_ITEM:
      return state.set('selectedInvoiceItem', action.item);
    default:
      return state;
  }
}
