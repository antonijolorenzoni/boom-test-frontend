import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable, useRowSelect, usePagination } from 'react-table';
import moment from 'moment';
import i18Countries from 'i18n-iso-countries';
import { useSelector } from 'react-redux';
import { Icon, Popup, Checkbox } from 'ui-boom-components';
import { flatten } from 'lodash';

import { SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { mapOrderStatus } from 'config/utils';
import { EllipsisTypography, PhoneIconWrapper, TableWrapper } from './styles';
import { Header } from './Header';
import { OrdersTableAssigneeWrapper } from './OrdersTableAssigneeWrapper';
import { AssigneeHeader } from './AssigneeHeader';
import { incrementPhoneCallCounter } from 'api/phoneCallsAPI';
import { Paginator } from './Paginator';
import Spinner from '../Spinner/Spinner';
import { getOrderIconName } from 'utils/get-ordering-icon';
import { useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';
import { featureFlag } from 'config/featureFlags';

const UnscheduledOrdersTable = ({
  isBoom,
  data,
  updatedAtOrder,
  createdAtOrder,
  onSetUpdatedAtOrder,
  onSetCreatedAtOrder,
  onSelectOrder,
  onChangeAssignee,
  onSelectRow,
  onBulkAssignOperators,
  onSelectAllOrders,
  onUpdatePageIndex: onUpdateControlledPageIndex,
  pageIndex: controlledPageIndex,
  totalPages,
  pageSize,
  onSetPageSize,
  groupedSelectedOrder,
  isLoading,
  initialOperators,
}) => {
  const canReadBoInfo = useIsUserEnabled([Permission.OrderBoInfoRead]);

  const columns = useMemo(() => {
    const tableColumns = [
      {
        Header: <Header i18key="order.code" />,
        accessor: 'code',
        Cell: ({ row: { original } }) => {
          return (
            <EllipsisTypography variantName="overline" style={{ textTransform: 'uppercase' }}>
              {original.orderCode}
            </EllipsisTypography>
          );
        },
        width: '6%',
      },
      {
        Header: <Header i18key="order.status" />,
        accessor: 'status',
        Cell: ({ row: { original } }) => {
          const { t } = useTranslation();
          const orderStatus = mapOrderStatus(isBoom, false, original.orderStatus);
          const orderStatusLabel = t(`shootingStatuses.${orderStatus}`);
          const orderStatusColor = SHOOTING_STATUSES_UI_ELEMENTS[orderStatus].color;

          return (
            <EllipsisTypography variantName="overline" style={{ textTransform: 'uppercase', color: orderStatusColor }}>
              {orderStatusLabel}
            </EllipsisTypography>
          );
        },
        width: '10%',
      },
      {
        Header: <Header i18key="order.contact" />,
        accessor: 'contact',
        Cell: ({ row: { original } }) => {
          return (
            <Popup text={original.contactName}>
              {(paragraphRef) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <EllipsisTypography variantName="body2" style={{ flexBasis: '80%', overflow: 'hidden' }} parentRef={paragraphRef}>
                    {original.contactName}
                  </EllipsisTypography>
                  <a
                    style={{ textDecoration: 'unset' }}
                    href={`tel:${original.contactPhone}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementPhoneCallCounter(original.orderCode);
                    }}
                  >
                    <PhoneIconWrapper>
                      <Icon name="phone" color="#ffffff" size={15} />
                    </PhoneIconWrapper>
                  </a>
                </div>
              )}
            </Popup>
          );
        },
        width: '12%',
      },
      {
        Header: <Header i18key="general.businessName" />,
        accessor: 'businessName',
        Cell: ({ row: { original } }) => {
          return (
            <Popup text={`${original.businessName || '-'}\n${original.address || '-'}`}>
              {(paragraphRef) => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <EllipsisTypography variantName="body2" style={{ flexBasis: '80%' }} parentRef={paragraphRef}>
                    {original.businessName || '-'}
                  </EllipsisTypography>
                  <Icon name="place" color="#A3ABB1" size={15} />
                </div>
              )}
            </Popup>
          );
        },
        width: '10%',
      },
      {
        Header: <Header i18key="order.country" />,
        accessor: 'country',
        Cell: ({ row: { original } }) => {
          const userLanguage = useSelector((state) => {
            const language = state.user.data.language;
            return language === 'ENGLISH' ? 'en' : 'it';
          });

          const countryTranslated = i18Countries.getName(original.countryCode, userLanguage);
          return <EllipsisTypography variantName="body2">{countryTranslated}</EllipsisTypography>;
        },
        width: '8%',
      },
      {
        Header: <Header i18key="order.company" />,
        accessor: 'companyName',
        Cell: ({ row: { original } }) => <EllipsisTypography variantName="body2">{original.companyName}</EllipsisTypography>,
        width: '8%',
      },
      {
        Header: <Header i18key="order.notes" />,
        accessor: 'notes',
        Cell: ({ row: { original } }) => {
          return (
            <Popup text={original.notes || '-'}>
              {(paragraphRef) => (
                <EllipsisTypography variantName="caption" textColor="#000000" parentRef={paragraphRef}>
                  {original.notes || '-'}
                </EllipsisTypography>
              )}
            </Popup>
          );
        },
        width: '14%',
      },
      {
        Header: (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(_) => onSetUpdatedAtOrder()}>
            <Header i18key="general.modified" />
            <Icon name={getOrderIconName(updatedAtOrder)} color="#5AC0B1" size={15} />
          </div>
        ),
        accessor: 'modified',
        Cell: ({ row: { original } }) => {
          const { t } = useTranslation();
          const diffDays = moment().diff(moment(original.updatedAt), 'days');
          return (
            <EllipsisTypography variantName="body1">
              {diffDays}
              {t(`shootings.shortDays`)}
            </EllipsisTypography>
          );
        },
        width: '5%',
      },
      {
        Header: (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(_) => onSetCreatedAtOrder()}>
            <Header i18key="general.created" />
            <Icon name={getOrderIconName(createdAtOrder)} color="#5AC0B1" size={15} />
          </div>
        ),
        accessor: 'created',
        Cell: ({ row: { original } }) => {
          const { t } = useTranslation();
          const diffDays = moment().diff(moment(original.createdAt), 'days');
          return (
            <EllipsisTypography variantName="body1">
              {diffDays}
              {t(`shootings.shortDays`)}
            </EllipsisTypography>
          );
        },
        width: '5%',
      },
      {
        Header: ({ state: { pageIndex } }) => {
          const isPageSelected = groupedSelectedOrder[pageIndex]?.allSelected || false;
          const selectedPageOrders = groupedSelectedOrder[pageIndex]?.orders || [];
          const selectedOrderIds = flatten(Object.values(groupedSelectedOrder).map((pageOrders) => pageOrders.orders));

          return (
            <AssigneeHeader
              selectedOrders={selectedOrderIds}
              onBulkAssignOperators={onBulkAssignOperators}
              onSelectAllOrders={onSelectAllOrders}
              allOrdersChecked={isPageSelected}
              allOfThePageSelected={selectedPageOrders.length === pageSize}
              initialOperators={initialOperators}
            />
          );
        },
        accessor: 'assignee',
        Cell: ({ row: { original }, state: { pageIndex } }) => {
          const isSelected = groupedSelectedOrder[pageIndex]?.orders.some((id) => original.orderId === id) || false;

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 2,
                }}
              >
                <Checkbox checked={isSelected} onChange={() => onSelectRow(original.orderId)} variantName="square" size={10} />
                <div style={{ flexGrow: 1 }}>
                  <OrdersTableAssigneeWrapper
                    assignee={original.assignee}
                    shootingId={original.orderId}
                    organizationId={original.companyId}
                    defaultOptions={initialOperators}
                    onChange={onChangeAssignee}
                  />
                </div>
              </div>
            </div>
          );
        },
        width: '12%',
      },
    ];

    return tableColumns.filter((column) => {
      if (column.accessor === 'contact') {
        return featureFlag.isFeatureEnabled('c1-compliance') ? canReadBoInfo : true;
      }
      return true;
    });
  }, [
    updatedAtOrder,
    createdAtOrder,
    onChangeAssignee,
    isBoom,
    onBulkAssignOperators,
    onSelectRow,
    onSetCreatedAtOrder,
    onSetUpdatedAtOrder,
    onSelectAllOrders,
    groupedSelectedOrder,
    pageSize,
    initialOperators,
    canReadBoInfo,
  ]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount: totalPages,
      autoResetSelectedRows: false,
    },
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    onUpdateControlledPageIndex(pageIndex);
  }, [pageIndex, onUpdateControlledPageIndex]);

  useEffect(() => {
    if (controlledPageIndex === 0) {
      gotoPage(0);
    }
  }, [controlledPageIndex, gotoPage]);

  const [tableWrapperNode, setTableWrapperNode] = useState();

  return (
    <TableWrapper>
      <div style={{ marginBottom: 8, marginLeft: 12 }}>
        <Paginator
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalPages={totalPages}
          onSetPageSize={onSetPageSize}
        />
      </div>
      <div
        style={{ overflowY: 'scroll', height: `calc(100vh - ${tableWrapperNode?.getBoundingClientRect().y}px)` }}
        ref={setTableWrapperNode}
      >
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} style={{ width: column.width }}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const isSelected = groupedSelectedOrder[pageIndex]?.orders.some((id) => row.original.orderId === id) || false;
              const rowLength = row.cells.length;

              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => onSelectOrder(row.original)}
                  data-testid={`order-${row.original.orderId}`}
                  data-selected={isSelected}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: cell.column.id !== 'assignee' ? 10 : '0 10px',
                          maxWidth: 0,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          boxShadow: i === rowLength - 1 ? 'none' : '6px 0px 0px -5px rgba(162,171,177,.8)',
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && (
          <Spinner
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
          />
        )}
      </div>
    </TableWrapper>
  );
};

export { UnscheduledOrdersTable };
