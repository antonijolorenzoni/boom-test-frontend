import { SAVE_ROLES, SAVE_ROLE_PERMISSIONS } from '../actions/actionTypes/roles';

export default function (state = [], action) {
  switch (action.type) {
    case SAVE_ROLES:
      return action.roles;
    case SAVE_ROLE_PERMISSIONS: {
      return state.map((p) => (p.id === action.roleId ? { ...p, permission: action.permissions } : p));
    }
    default:
      return state;
  }
}
