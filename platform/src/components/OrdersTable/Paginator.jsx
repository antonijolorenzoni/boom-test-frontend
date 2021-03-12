import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, IconButton, Dropdown, Typography } from 'ui-boom-components';

export const Paginator = ({ canPreviousPage, canNextPage, previousPage, nextPage, pageSize, pageIndex, totalPages, onSetPageSize }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 335 }} data-testid="table-paginator">
      <div style={{ width: 63 }}>
        <Dropdown
          value={{ value: pageSize, label: pageSize }}
          onChange={(option) => onSetPageSize(option.value)}
          options={[
            { value: 10, label: 10 },
            { value: 20, label: 20 },
            { value: 50, label: 50 },
          ]}
          showError={false}
        />
      </div>
      <Typography variantName="body2">{t('general.itemsPerPage')}</Typography>
      <IconButton disabled={!canPreviousPage} onClick={previousPage}>
        <Icon name="navigate_before" color="#5AC0B1" size={22} />
      </IconButton>
      <Typography variantName="body1" style={{ minWidth: 90, textAlign: 'center' }}>
        {t('general.tablePageIndicator', { pageIndex: pageIndex + 1, totalPages })}
      </Typography>
      <IconButton disabled={!canNextPage} onClick={nextPage}>
        <Icon name="navigate_next" color="#5AC0B1" size={22} />
      </IconButton>
    </div>
  );
};
