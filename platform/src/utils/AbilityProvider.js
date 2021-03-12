//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N Y   A N D   O R G A N I Z A T I O N   A B I L I T Y   P R O V I D E R : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import AbilityHelper from './abilityhelpers/AbilityHelper';

class AbilityProvider {
  organizationAbilityHelper = new AbilityHelper(); // For the outer level

  companyAbilityHelper = new AbilityHelper(); // For inner companies

  getOrganizationAbilityHelper() {
    return this.organizationAbilityHelper;
  }

  getCompanyAbilityHelper() {
    return this.companyAbilityHelper;
  }
}

export default new AbilityProvider();
