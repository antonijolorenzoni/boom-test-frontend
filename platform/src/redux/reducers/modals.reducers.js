//
// ──────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M O D A L S   R E D U C E R : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
//

import Immutable from 'seamless-immutable';
import _ from 'lodash';
import { SHOW_MODAL, HIDE_MODAL } from '../actions/actionTypes/modals';

const initialState = Immutable({
  data: [],
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return state.set('data', state.data.concat([{ id: action.id, data: action.data }]));
    case HIDE_MODAL:
      return state.set(
        'data',
        _.filter(state.data, (modal) => modal.id !== action.id)
      );
    default:
      return state;
  }
}
