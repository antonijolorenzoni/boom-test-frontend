import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { AssigneeDropdown } from 'components/AssigneeDropdown';
import { onFetchAssigneeUsers, onChangeAssignee } from 'utils/userUtils';
import { useFetchInitialOperators } from 'hook/useFetchInitialOperators';

export const ShootingInfoDetailsAssigneeDropdown = ({ assignee, organizationId, shootingId, userData, onChange }) => {
  const { t } = useTranslation();

  const { initialOperators } = useFetchInitialOperators(userData);

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
      defaultOptions={initialOperators}
      placeholder={t('shootings.unassigned').toUpperCase()}
      isShowIcon={true}
      colorOptionMenuClosed={'#ffffff'}
    />
  );
};
