import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { USER_ROLES } from 'config/consts';

interface Props {
  do: Array<string>;
  on: string;
  roles?: Array<string>;
  rolesNot?: Array<string>;
  abilityHelper?: any;
}

const Permission: React.FC<Props> = ({ children, do: canDo, on, roles, rolesNot, abilityHelper }) => {
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (roles || rolesNot) {
      const rolesToWhitelist = rolesNot ? _.without(_.values(USER_ROLES), ...rolesNot) : roles;

      setIsAllowed(abilityHelper.hasRolesAndPermissions(rolesToWhitelist, canDo, on));
    } else {
      setIsAllowed(abilityHelper.hasPermission(canDo, on));
    }
  }, [setIsAllowed, abilityHelper, canDo, on, roles, rolesNot]);

  return isAllowed ? <>{children}</> : null;
};

export default Permission;
