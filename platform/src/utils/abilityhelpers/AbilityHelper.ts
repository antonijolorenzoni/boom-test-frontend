//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A B I L I T Y   H E L P E R   F O R   C H E C K   P E R M I S S I O N S   A N D   R O L E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { RawRule } from '@casl/ability';
import { AbilityBuilder } from '@casl/ability';
import _ from 'lodash';

export default class AbilityCompanyHelper {
  ability = AbilityBuilder.define((can: any) => {});

  userRole = null;

  setUserRole(role: any) {
    this.userRole = role;
  }

  getAbility() {
    return this.ability;
  }

  updateAbilities(abilities: RawRule[]) {
    this.ability.update(abilities);
  }

  hasRolesAndPermissions(roles: any, checkPermissions: string[], entity: any) {
    return this.hasRoles(roles) && this.hasPermission(checkPermissions, entity);
  }

  hasPermission(checkPermissions: string[], entity: any) {
    for (let i = 0; i < checkPermissions.length; i += 1) {
      if (this.ability.can(checkPermissions[i], entity)) {
        return true;
      }
    }
    return false;
  }

  hasRoles(roles: any) {
    return this.userRole && _.includes(roles, this.userRole);
  }
}
