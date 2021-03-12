import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Button, Checkbox, Spinner } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { AsyncDropdown } from 'ui-boom-components';
import { onFetchAssigneeUsers } from 'utils/userUtils';
import { useSelector } from 'react-redux';
import { AssigneeHeaderSpinnerWrapper } from './styles';

const AssigneeHeader = ({
  selectedOrders,
  onBulkAssignOperators,
  onSelectAllOrders,
  allOrdersChecked,
  allOfThePageSelected,
  initialOperators,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDrodpownDisabled, setIsDropdownDisabled] = useState(false);
  const { t } = useTranslation();

  const userData = useSelector((state) => state.user.data);

  useEffect(() => {
    if (selectedOrders.length === 0) {
      setIsDropdownVisible(false);
    }
  }, [selectedOrders]);

  const assignToLabel = `${t('general.assignTo')} (${selectedOrders.length})`;

  const allCheckedButRemovedSome = !allOfThePageSelected && allOrdersChecked;

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <div style={{ marginLeft: 11 }}>
        <Checkbox
          onChange={onSelectAllOrders}
          size={10}
          checked={allOrdersChecked}
          variantName={allCheckedButRemovedSome ? 'classic' : 'square'}
          iconName={allCheckedButRemovedSome ? 'remove' : undefined}
        />
      </div>
      <Header i18key="general.assignee" />
      {selectedOrders.length > 0 && (
        <>
          {!isDropdownVisible ? (
            <Button
              size="small"
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              style={{ position: 'absolute', right: 5, width: 115 }}
            >
              {assignToLabel}
            </Button>
          ) : (
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: '80%' }}>
              {isDrodpownDisabled && (
                <AssigneeHeaderSpinnerWrapper>
                  <Spinner size="xxsmall" />
                </AssigneeHeaderSpinnerWrapper>
              )}
              <AsyncDropdown
                id="assignee"
                value={null}
                defaultOptions={initialOperators}
                fetcher={(input) => onFetchAssigneeUsers(input, userData)}
                onChange={async (option) => {
                  setIsDropdownDisabled(true);
                  await onBulkAssignOperators(option.value, option.contactCenter);
                  setIsDropdownDisabled(false);
                }}
                onBlur={() => setIsDropdownVisible(false)}
                isClearable
                autoFocus
                openMenuOnFocus
                placeholder={assignToLabel}
                showError={false}
                disabled={isDrodpownDisabled}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { AssigneeHeader };
