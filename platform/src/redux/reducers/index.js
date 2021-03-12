//
// ──────────────────────────────────────────────────────────────────── I ──────────
//   :::::: R E D U C E R S   I N D E X : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
//

import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import utilsReducers from './utils.reducers';
import userReducers from './user.reducers';
import organizationsReducers from './organizations.reducers';
import companiesReducers from './companies.reducers';
import usersReducers from './users.reducers';
import rolesReducers from './roles.reducers';
import photographersReducers from './photographers.reducers';
import shootingsReducers from './shootings.reducers';
import availabilityReducers from './availability.reducers';
import notificationsReducers from './notifications.reducers';
import invoicingItemsReducers from './invoicingItems.reducers';
import balanceReducers from './balance.reducers';
import modalsReducers from './modals.reducers';

const rootReducers = combineReducers({
  form: formReducer,
  utils: utilsReducers,
  user: userReducers,
  organizations: organizationsReducers,
  companies: companiesReducers,
  users: usersReducers,
  photographers: photographersReducers,
  roles: rolesReducers,
  shootings: shootingsReducers,
  notifications: notificationsReducers,
  availability: availabilityReducers,
  invoicingItems: invoicingItemsReducers,
  balance: balanceReducers,
  modals: modalsReducers,
});

export default rootReducers;
