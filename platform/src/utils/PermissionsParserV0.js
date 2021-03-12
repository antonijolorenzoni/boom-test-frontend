//
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P A R S E R   F O R   P E R M I S S I O N S   C O M I N G   F R O M   T H E   B E : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//
import _ from 'lodash';

/*
This function will parse a permision from the subject.action form to the object { subject, action }
*/
export default class PermissionsParserV0 {
  static parse(stringPermission) {
    if (!_.isString(stringPermission)) {
      throw new Error('Input permission must be a string');
    }

    const [entity, permission] = _.split(stringPermission, '.');
    const formattedEntity = _.upperCase(entity);
    const formattedPermission = _.upperCase(permission).replace(' ', '_');
    return {
      subject: formattedEntity,
      action: formattedPermission,
    };
  }

  static parseArray(stringPermissions) {
    if (!_.isArray(stringPermissions)) {
      throw new Error('Input permissions must be an array');
    }
    return _.map(stringPermissions, (permission) => this.parse(permission));
  }
}
