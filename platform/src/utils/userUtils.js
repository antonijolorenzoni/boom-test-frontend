import { getCompleteName } from '../config/utils';
import { UNASSIGNED, USER_ROLES } from '../config/consts';
import constsWithTranslations from '../config/constsWithTranslations';

import { fetchUsers } from '../api/userAPI';
import { get } from 'lodash';
import { assignContactCenter, assignOperator } from '../api/assigneeAPI';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { getContactCenterUsers } from 'api/paths/contact-center';

export const onFetchAssigneeUsers = async (input, userData) => {
  const paramsToSend = {
    fullName: input,
    organizationId: 1,
    photographer: false,
  };
  const isCc = get(userData, 'roles', []).some((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER);

  const usersResponse = isCc ? await axiosBoomInstance.get(getContactCenterUsers(1, { fullName: input })) : await fetchUsers(paramsToSend);

  const users = get(usersResponse, 'data.content', []);

  const options = users.map((user) => {
    if (user.id === userData.id) {
      return { value: userData.id, label: `${getCompleteName(userData)} ${constsWithTranslations.meSuffix}` };
    }
    return { value: user.id, label: getCompleteName(user) };
  });

  return options;
};

export const onChangeAssignee = async (
  option,
  organizationId,
  shootingId,
  isContactCenterSelected,
  onChange,
  setAssigneeDisabled,
  setAssigneeValue
) => {
  if (option) {
    try {
      setAssigneeDisabled(true);

      if (isContactCenterSelected) {
        await assignContactCenter(organizationId, shootingId, { contactCenterId: 1 });
      } else {
        await assignOperator(organizationId, shootingId, { operator: option.value === UNASSIGNED ? null : option.value });
      }

      onChange && onChange();

      const labelContainsMe = option.label.includes(constsWithTranslations.meSuffix);

      if (option.value === UNASSIGNED) {
        setAssigneeValue(null);
      } else if (labelContainsMe) {
        setAssigneeValue(option.label.split(constsWithTranslations.meSuffix)[0]);
      } else {
        setAssigneeValue(option.label);
      }
    } catch {}
  }
  setAssigneeDisabled(false);
};
