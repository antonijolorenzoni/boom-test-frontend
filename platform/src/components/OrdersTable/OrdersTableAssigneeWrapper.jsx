import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { AssigneeDropdown } from '../AssigneeDropdown';
import { onFetchAssigneeUsers, onChangeAssignee } from 'utils/userUtils';

export const OrdersTableAssigneeWrapper = ({ assignee, organizationId, shootingId, defaultOptions, onChange }) => {
  const { t } = useTranslation();

  const userData = useSelector((state) => state.user.data);

  const [assigneeValue, setAssigneeValue] = useState(assignee);
  const [isAssigneeDisabled, setAssigneeDisabled] = useState(false);

  return (
    <AssigneeDropdown
      value={assigneeValue ? { value: assigneeValue, label: assigneeValue } : null}
      fetcher={(input) => onFetchAssigneeUsers(input, userData)}
      onChange={(option) =>
        onChangeAssignee(option, organizationId, shootingId, option.contactCenter, onChange, setAssigneeDisabled, setAssigneeValue)
      }
      showError={false}
      disabled={isAssigneeDisabled}
      defaultOptions={defaultOptions}
      placeholder={t('shootings.unassigned')}
      isShowIcon={false}
      colorOptionMenuClosed={'#A3ABB1'}
    />
  );
};
