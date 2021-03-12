//
// ──────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M O D A L S   A C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
//

import { SHOW_MODAL, HIDE_MODAL } from './actionTypes/modals';

export function showModal(id, data) {
  return {
    type: SHOW_MODAL,
    id,
    data,
  };
}

export function hideModal(id) {
  return {
    type: HIDE_MODAL,
    id,
  };
}
