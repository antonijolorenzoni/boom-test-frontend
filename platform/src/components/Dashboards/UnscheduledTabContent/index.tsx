import React, { useState, useEffect, useCallback } from 'react';
import { get, flatten } from 'lodash';
import { Typography } from 'ui-boom-components';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { ccBulkAssign, bulkAssignOperator } from 'api/assigneeAPI';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import { listOrders } from 'api/paths/orders';
import { showModal } from 'redux/actions/modals.actions';
import { setSelectedShooting } from 'redux/actions/shootings.actions';
import { setSpinnerVisibile } from 'redux/actions/utils.actions';

import { fillOrdersWithAllInfos } from 'utils/orders';
import { SHOOTINGS_STATUSES, UNASSIGNED } from 'config/consts';
import { UnscheduledOrdersTable } from '../../OrdersTable/UnscheduledOrdersTable';
import { UnscheduledDashboardFilterPanel } from './UnscheduledDashboardFilterPanel';
import ShootingActionsView from '../../Shooting/ShootingActionsView';
import { Option } from 'types/Option';
import { useFetchInitialOperators } from 'hook/useFetchInitialOperators';
import { Ordering } from 'types/Ordering';
import { invertOrdering } from 'utils/invert-ordering';

const initialFilter = {
  freeText: '',
  countryCode: '',
  orderTypes: [],
  statuses: [SHOOTINGS_STATUSES.UNSCHEDULED],
  country: null,
  address: '',
  company: null,
  subCompany: null,
  assigneeId: null,
  assignedContactCenter: null,
  assigned: null,
  updatedAtOrder: 0,
  createdAtOrder: 2,
  code: '',
};

interface FetchParams {
  search: string;
  orderCode: string;
  photoTypes: Array<number>;
  orderStatuses: Array<string>;
  countryCode: string;
  address: string;
  company: number | null;
  subCompany: number | null;
  assigneeIds: number | null;
  assignedContactCenter: number | null;
  updatedAt: Ordering | null;
  createdAt: Ordering | null;
}

interface Props {
  onUpdateCounter: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const UnscheduledTabContent: React.FC<Props> = ({ onUpdateCounter }) => {
  const { organizationId, isBoom } = useSelector((state: any) => {
    const { organization, isBoom } = state.user.data;
    return { organizationId: organization, isBoom };
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [columnOrderDate, setColumnOrderDate] = useState<Array<number>>([initialFilter.updatedAtOrder, initialFilter.createdAtOrder]);

  const dateOrders = [null, Ordering.ASC, Ordering.DESC];
  const selectedUpdatedOrder = dateOrders[columnOrderDate[0]];
  const selectedCreatedOrder = dateOrders[columnOrderDate[1]];

  const [fetchParams, setFetchParams] = useState<FetchParams>({
    search: initialFilter.freeText,
    orderCode: initialFilter.code,
    photoTypes: initialFilter.orderTypes,
    orderStatuses: initialFilter.statuses,
    countryCode: initialFilter.countryCode,
    address: initialFilter.address,
    company: initialFilter.company,
    subCompany: initialFilter.subCompany,
    assigneeIds: initialFilter.assigneeId,
    assignedContactCenter: initialFilter.assignedContactCenter,
    updatedAt: dateOrders[initialFilter.updatedAtOrder],
    createdAt: dateOrders[initialFilter.createdAtOrder],
  });

  const [invalidateCacheKey, setInvalidateCacheKey] = useState(Math.random());

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const [groupedSelectedOrder, setGroupedSelectedOrder] = useState({});

  const selectRow = useCallback(
    (orderId) => {
      setGroupedSelectedOrder((currentSelectedOrders: any) => {
        const currentPageOrders = currentSelectedOrders[pageIndex];
        const yetSelected = currentPageOrders?.orders.some((id: number) => id === orderId);
        const pageOrders = currentPageOrders?.orders || [];

        return {
          ...currentSelectedOrders,
          [pageIndex]: {
            orders: yetSelected ? pageOrders.filter((id: number) => id !== orderId) : [...pageOrders, orderId],
            allSelected: currentPageOrders?.allSelected,
          },
        };
      });
    },
    [pageIndex]
  );

  const getAssigneeFilterParams = (
    assigneeId: Option<string | number> & { contactCenter: boolean }
  ): { assigneeIds: number | null; assignedContactCenter: number | null } => {
    const assigneeValue = get(assigneeId, 'value', null);
    const contactCenterAssignee = get(assigneeId, 'contactCenter', false);

    if (contactCenterAssignee) {
      return { assignedContactCenter: 1, assigneeIds: null };
    }

    return {
      assigneeIds: assigneeValue === UNASSIGNED ? null : (assigneeValue as number),
      assignedContactCenter: null,
    };
  };

  const updateFetchParams = ({ assigneeId, freeText, code, orderTypes, address, countryCode, company, subCompany, statuses }: any) => {
    const filterParams = {
      search: freeText,
      orderCode: code,
      photoTypes: orderTypes,
      address,
      countryCode,
      company: get(company, 'value', null),
      subCompany: get(subCompany, 'value', null),
      orderStatuses: statuses,
      updatedAt: fetchParams.updatedAt,
      createdAt: fetchParams.createdAt,
    };

    setPageIndex(0);
    setGroupedSelectedOrder({});

    setFetchParams({ ...filterParams, ...getAssigneeFilterParams(assigneeId) });
    setInvalidateCacheKey(Math.random());
  };

  const onResetFetchParams = () => {
    setFetchParams({
      search: initialFilter.freeText,
      orderCode: initialFilter.code,
      photoTypes: initialFilter.orderTypes,
      orderStatuses: initialFilter.statuses,
      countryCode: initialFilter.countryCode,
      address: initialFilter.address,
      company: initialFilter.company,
      subCompany: initialFilter.subCompany,
      assigneeIds: initialFilter.assigneeId,
      assignedContactCenter: initialFilter.assignedContactCenter,
      updatedAt: dateOrders[initialFilter.updatedAtOrder],
      createdAt: dateOrders[initialFilter.createdAtOrder],
    });

    setPageIndex(0);
    setGroupedSelectedOrder({});
    setColumnOrderDate([initialFilter.updatedAtOrder, initialFilter.createdAtOrder]);

    setInvalidateCacheKey(Math.random());
  };

  const setCreatedUpdatedAtParams = useCallback(
    (updatedOrderIndexes) => {
      const [updatedOrderIndex, createdOrderIndex] = updatedOrderIndexes;
      setFetchParams({ ...fetchParams, updatedAt: dateOrders[updatedOrderIndex], createdAt: dateOrders[createdOrderIndex] });
    },
    [dateOrders, fetchParams]
  );

  const onSetUpdatedFilter = useCallback(() => {
    const newIndexes = [(columnOrderDate[0] + 1) % 3, 0];
    setColumnOrderDate(newIndexes);
    setCreatedUpdatedAtParams(newIndexes);
  }, [columnOrderDate, setCreatedUpdatedAtParams]);

  const onSetCreatedFilter = useCallback(() => {
    const newIndexes = [0, (columnOrderDate[1] + 1) % 3];
    setColumnOrderDate(newIndexes);
    setCreatedUpdatedAtParams(newIndexes);
  }, [columnOrderDate, setCreatedUpdatedAtParams]);

  const { data: ordersResponse, error, mutate } = useSWR(
    [
      listOrders(
        { ...fetchParams, updatedAt: invertOrdering(fetchParams.updatedAt), createdAt: invertOrdering(fetchParams.createdAt) },
        pageIndex,
        pageSize
      ),
      invalidateCacheKey,
    ],
    (url, key) => axiosBoomInstance.get(url),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    onUpdateCounter((counter) => {
      const totalElements = ordersResponse?.data.totalElements;
      return totalElements ?? counter;
    });

    setTotalPages((pages) => {
      const totalPages = ordersResponse?.data.totalPages;
      return totalPages ?? pages;
    });
  }, [ordersResponse, onUpdateCounter]);

  useEffect(() => {
    setGroupedSelectedOrder({});
  }, [pageSize, columnOrderDate]);

  const onChangeAssignee = () => setInvalidateCacheKey(Math.random());

  const selectOrder = async (order: any) => {
    dispatch(setSpinnerVisibile(true));
    const fullOrder = await fillOrdersWithAllInfos(
      organizationId || 1,
      { id: order.orderId, companyId: order.companyId, score: null },
      isBoom
    );
    dispatch(setSelectedShooting(fullOrder));
    dispatch(setSpinnerVisibile(false));
    dispatch(
      showModal('SHOOTING_OPERATIONAL_VIEW', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          closeIconColor: '#ffffff',
          content: (
            <ShootingActionsView
              updateOrders={() => {
                setGroupedSelectedOrder({});
                mutate();
              }}
              onChangeAssignee={onChangeAssignee}
            />
          ),
        },
      })
    );
  };

  const isLoading = !ordersResponse && !error;

  const bulkAssignOperators = async (id: number | string, contactCenter: boolean) => {
    const isUnassigned = id === UNASSIGNED;
    const selectedOrderIds = flatten(Object.values(groupedSelectedOrder).map((pageOrders: any) => pageOrders.orders));

    try {
      if (contactCenter) {
        const entries = selectedOrderIds.map((orderId) => ({ contactCenterId: (id as string).split('_')[0], orderId }));
        await ccBulkAssign(entries);
      } else {
        const entries = selectedOrderIds.map((orderId) => ({ operatorId: isUnassigned ? null : id, orderId }));
        await bulkAssignOperator(entries);
      }

      setGroupedSelectedOrder({});
      mutate();

      dispatch(
        showModal('BULK_ASSIGN_SHOOTING_OK', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t(isUnassigned ? 'shootings.submitBulkUnassignSuccess' : 'shootings.submitBulkAssignSuccess'),
          },
        })
      );
    } catch {
      dispatch(
        showModal('BULK_ASSIGN_SHOOTING_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('shootings.submitBulkAssignError'),
          },
        })
      );
    }
  };

  const orders = ordersResponse?.data.content || [];

  const selectAllOrders = useCallback(() => {
    setGroupedSelectedOrder((currentSelectedOrders: any) => {
      const yetAllSelected = currentSelectedOrders[pageIndex]?.allSelected;

      return {
        ...currentSelectedOrders,
        [pageIndex]: { allSelected: !yetAllSelected, orders: yetAllSelected ? [] : orders.map(({ orderId }: any) => orderId) },
      };
    });
  }, [pageIndex, orders]);

  const userData = useSelector((state: any) => state.user.data);
  const { initialOperators } = useFetchInitialOperators(userData);

  return (
    <>
      <div style={{ padding: '14px 12px 0', backgroundColor: '#ffffff', borderTopRightRadius: 20 }}>
        <UnscheduledDashboardFilterPanel
          onReset={onResetFetchParams}
          onSearch={updateFetchParams}
          isLoading={isLoading}
          initialOperators={initialOperators}
        />
      </div>
      <div style={{ marginBottom: 30, backgroundColor: '#ffffff' }}>
        {orders.length === 0 && !isLoading ? (
          <Typography variantName="body1" style={{ marginLeft: 12 }}>
            {t('order.noItemsFound')}
          </Typography>
        ) : (
          <UnscheduledOrdersTable
            isBoom={isBoom}
            data={orders}
            updatedAtOrder={selectedUpdatedOrder}
            createdAtOrder={selectedCreatedOrder}
            onSetUpdatedAtOrder={onSetUpdatedFilter}
            onSetCreatedAtOrder={onSetCreatedFilter}
            onSelectOrder={selectOrder}
            onSelectRow={selectRow}
            onBulkAssignOperators={bulkAssignOperators}
            onChangeAssignee={mutate}
            onSelectAllOrders={selectAllOrders}
            pageIndex={pageIndex}
            onUpdatePageIndex={setPageIndex}
            totalPages={totalPages}
            pageSize={pageSize}
            onSetPageSize={setPageSize}
            groupedSelectedOrder={groupedSelectedOrder}
            isLoading={isLoading}
            initialOperators={initialOperators}
          />
        )}
      </div>
    </>
  );
};
