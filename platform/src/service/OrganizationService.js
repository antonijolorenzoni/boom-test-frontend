//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E R V I C E   F O R   O R G A N I Z A T I O N   A P I   C A L L   F I L T E R I N G : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import AbilityProvider from '../utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../config/consts';
import * as OrganizationsAPI from '../api/organizationsAPI';

// This class will check that user has permission before make a specific API call
export default class fetchOrganizationsOrganizationService {
  static async fetchOrganizations(params) {
    if (this.hasPermission([PERMISSIONS.READ])) {
      return OrganizationsAPI.fetchOrganizations(params);
    }
    throw new Error('User does not have permissions to fetch organizations');
  }

  static async fetchOrganizationDetails(params) {
    if (this.hasPermission([PERMISSIONS.READ])) {
      return OrganizationsAPI.fetchOrganizationDetails(params);
    }
    throw new Error('User does not have permissions to fetch organization details');
  }

  static async createOrganization(data) {
    if (this.hasPermission([PERMISSIONS.CREATE])) {
      return OrganizationsAPI.createOrganization(data);
    }
    throw new Error('User does not have permissions to create organizations');
  }

  static async updateOrganization(id, data) {
    if (this.hasPermission([PERMISSIONS.CREATE])) {
      return OrganizationsAPI.updateOrganization(id, data);
    }
    throw new Error('User does not have permissions to update organizations');
  }

  static async deleteOrganization(id) {
    if (this.hasPermission([PERMISSIONS.CREATE])) {
      return OrganizationsAPI.deleteOrganization(id);
    }
    throw new Error('User does not have permissions to delete organizations');
  }

  static async fetchOrganizationRootCompany(data) {
    if (this.hasPermission([PERMISSIONS.CREATE])) {
      return OrganizationsAPI.fetchOrganizationRootCompany(data);
    }
    throw new Error('User does not have permissions to fetch organization root company');
  }

  static hasPermission(checkPermissions) {
    return AbilityProvider.getOrganizationAbilityHelper().hasPermission(checkPermissions, PERMISSION_ENTITIES.ORGANIZATION);
  }
}
