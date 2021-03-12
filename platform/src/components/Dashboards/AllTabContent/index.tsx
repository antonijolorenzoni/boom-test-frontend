import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'ui-boom-components';

import { setSpinnerVisibile } from 'redux/actions/utils.actions';
import { fillOrdersWithAllInfos } from 'utils/orders';
import { setSelectedShooting } from 'redux/actions/shootings.actions';
import { hideModal, showModal } from 'redux/actions/modals.actions';
import ShootingActionsView from 'components/Shooting/ShootingActionsView';
import { AllOrdersTable } from 'components/OrdersTable/AllOrdersTable';
import { Column, useTable, usePagination } from 'react-table';
import { Paginator } from 'components/OrdersTable/Paginator';
import { CalendarDateFilter } from './CalendarDateFilter';
import { CalendarViewType } from 'types/CalendarViewType';
import { CalendarTableSwitch } from './CalendarTableSwitch';
import { AddOrdersButton } from './AddOrderButton';
import { OrdersCalendar } from './OrdersCalendar';
import { useOrdersCalendar } from 'hook/useOrdersCalendar';
import { OrderEvent } from 'types/OrderEvent';
import { useDashboardAllColumns } from './useDashboardAllColumns';
import { isDayBlocked } from 'utils/date-utils';
import { NewOrderForm } from 'components/Forms/NewOrderForm';
import { createShootingRefund } from 'api/shootingsAPI';
import ShootingBulkUploadViewContainer from 'components/Shooting/ShootingBulkUploadView/container';
import { ContextualFilterWrapper } from './styles';
import { useOrdersDashboardAll } from 'hook/useOrdersDashboardAll';
import { AllDashboardFilterPanel } from './AllDashboardFilterPanel';
import { Option } from 'types/Option';
import { OrderStatus } from 'types/OrderStatus';
import { DateRange } from 'types/DateRange';
import { Ordering } from 'types/Ordering';
import { invertOrdering } from 'utils/invert-ordering';
import { mapOrderStatus, revertToOriginalStatuses } from 'config/utils';
import { DashboardAllOrderOriginalStatus } from './type';
import { COMPANIES_ORDER_STATUSES_TRANSLATION_MAP } from 'config/consts';
import { useWhoAmI } from 'hook/useWhoAmI';
import { NewOrderFormForSubscribers } from 'components/Forms/NewOrderForm/NewOrderFormForSubscribers';
import { InfoModal } from 'components/Modals/InfoModal';
import { useModal } from 'hook/useModal';
import { useSmbProfile } from 'hook/useSmbProfile';
import { useSubscription } from 'hook/useSubscription';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

interface Props {
  onUpdateCounter: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const getDateField = (calendarViewType: CalendarViewType) => {
  switch (calendarViewType) {
    case CalendarViewType.Day:
      return 'day';
    case CalendarViewType.Week:
      return 'week';
    case CalendarViewType.Month:
    default:
      return 'month';
  }
};

interface FetchParams {
  search: string;
  orderStatuses: Array<string>;
  company: number | null;
  subCompany: number | null;
  fromDate: number | null;
  toDate: number | null;
  startDateDirection: Ordering | null;
  updatedAt: Ordering | null;
  createdAt: Ordering | null;
}

const dateOrders = [null, Ordering.ASC, Ordering.DESC];

export const AllTabContent: React.FC<Props> = ({ onUpdateCounter }) => {
  const { t } = useTranslation();

  const [tabPageIndex, setTabPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState<number>();

  const { isBoom, isClient, isSMB } = useWhoAmI();
  const { openModal } = useModal();

  const { smbProfile } = useSmbProfile(isSMB);
  const { subscription } = useSubscription(isSMB, smbProfile?.companyId);
  const unsubscribedGrace = subscription?.subscriptionStatus === SubscriptionStatus.UNSUBSCRIBED_GRACE;

  const initialFilter = {
    freeText: '',
    statuses: [],
    company: null,
    subCompany: null,
    fromDate: isClient || isSMB ? null : moment().utc().day('Sunday').startOf('day').valueOf(),
    toDate: isClient || isSMB ? null : moment().utc().day('Sunday').add(7, 'days').startOf('day').valueOf(),
    startDateDirection: 2,
    updatedAt: 0,
    createdAt: 0,
  };

  const [columnOrderDate, setColumnOrderDate] = useState<Array<number>>([
    initialFilter.startDateDirection,
    initialFilter.updatedAt,
    initialFilter.createdAt,
  ]);

  const selectedStartDateDirection = dateOrders[columnOrderDate[0]];
  const selectedUpdatedAt = dateOrders[columnOrderDate[1]];
  const selectedCreatedAt = dateOrders[columnOrderDate[2]];

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarViewType, setCalendarViewType] = useState<CalendarViewType>(CalendarViewType.Week);
  const [date, setDate] = useState<string>(moment.utc().format());

  const [invalidateCacheKey, setInvalidateCacheKey] = useState(Math.random());

  const dispatch = useDispatch();
  const organizationId = useSelector((state: any) => state.user.data.organization);

  const [fetchParams, setFetchParams] = useState<FetchParams>({
    search: initialFilter.freeText,
    orderStatuses: initialFilter.statuses,
    company: initialFilter.company,
    subCompany: initialFilter.subCompany,
    fromDate: initialFilter.fromDate,
    toDate: initialFilter.toDate,
    startDateDirection: dateOrders[initialFilter.startDateDirection],
    updatedAt: dateOrders[initialFilter.updatedAt],
    createdAt: dateOrders[initialFilter.createdAt],
  });

  useEffect(() => {
    setInvalidateCacheKey(Math.random());
  }, [calendarVisible]);

  const onCompleteInsert = () => (calendarVisible ? calendarOrdersMutate() : orderMutate());

  const selectOrder = async (order: { orderId: number; companyId: number; score?: number }) => {
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
          content: <ShootingActionsView updateOrders={onCompleteInsert} />,
        },
      })
    );
  };

  const openNewOrderForm = (start?: string | Date) => {
    const momentStart = moment(start);

    if (isDayBlocked(momentStart)) {
      dispatch(
        showModal('DateBlocked', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('shootings.dayIsBlocked'),
          },
        })
      );
    } else if (momentStart.hours() < 8 && !isBoom) {
      dispatch(
        showModal('OrderDateRangeError', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('calendar.timeSlotTooEarly'),
          },
        })
      );
    } else {
      dispatch(
        showModal('NewOrderDrawer', {
          modalType: 'OPERATIONAL_VIEW',
          modalProps: {
            content: (
              <div style={{ padding: '20px 40px' }} id="create-order-drawer">
                {isSMB ? (
                  <NewOrderFormForSubscribers
                    onCancel={() => dispatch(hideModal('NewOrderDrawer'))}
                    onCreateOrderCompleted={() => {
                      openModal('onGoingPayment');
                      dispatch(hideModal('NewOrderDrawer'));
                    }}
                  />
                ) : (
                  <NewOrderForm
                    initialDate={momentStart.valueOf()}
                    initialStartTime={momentStart.valueOf()}
                    onCancel={() => dispatch(hideModal('NewOrderDrawer'))}
                    onCreateOrderCompleted={(organizationId, orderId, refund) => {
                      onCompleteInsert();

                      if (isBoom && refund) {
                        createShootingRefund(organizationId, orderId, { amount: refund });
                      }
                    }}
                  />
                )}
              </div>
            ),
          },
        })
      );
    }
  };

  const openBulkUpload = () =>
    dispatch(
      showModal('BulkUpload', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          maxWidth: 'lg',
          width: '60vw',
          height: '70vh',
          overflow: 'hidden',
          titleStyle: { fontSize: 17 },
          innerContainerStyle: { height: 'calc(100% - 88px)', boxSizing: 'border-box' },
          bodyContentContainerStyle: { height: '100%' },
          title: t('calendar.bulkUploadModalTitle'),
          content: <ShootingBulkUploadViewContainer onCompleteInsert={onCompleteInsert} />,
        },
      })
    );

  const updateFetchParams = ({
    freeText,
    company,
    subCompany,
    statuses,
    dateRange,
    countryCode,
    address,
  }: {
    freeText: string;
    subCompany: Option | null;
    company: Option | null;
    statuses: Array<OrderStatus>;
    dateRange: DateRange;
    countryCode: string | null;
    address: string;
  }) => {
    setFetchParams((fetchParams) => ({
      ...fetchParams,
      search: freeText,
      company: company?.value ?? null,
      subCompany: subCompany?.value ?? null,
      orderStatuses: isClient || isSMB ? revertToOriginalStatuses(statuses, COMPANIES_ORDER_STATUSES_TRANSLATION_MAP) : statuses,
      fromDate: dateRange.start ? moment.utc(dateRange.start).startOf('day').valueOf() : null,
      toDate: dateRange.end ? moment.utc(dateRange.end).startOf('day').valueOf() : null,
      address: address,
      countryCode: countryCode,
    }));

    setTabPageIndex(0);
    setInvalidateCacheKey(Math.random());
  };

  const onResetFetchParams = () => {
    setFetchParams({
      search: initialFilter.freeText,
      orderStatuses: initialFilter.statuses,
      company: initialFilter.company,
      subCompany: initialFilter.subCompany,
      fromDate: initialFilter.fromDate,
      toDate: initialFilter.toDate,
      startDateDirection: dateOrders[initialFilter.startDateDirection],
      updatedAt: dateOrders[initialFilter.updatedAt],
      createdAt: dateOrders[initialFilter.createdAt],
    });
    setTabPageIndex(0);
    setColumnOrderDate([initialFilter.startDateDirection, initialFilter.createdAt, initialFilter.updatedAt]);

    setInvalidateCacheKey(Math.random());
  };

  const setOrderingParams = useCallback<(updatedOrderingParams: Array<number>) => void>((updatedOrderingParams) => {
    const [startDateDirectionIndex, updatedAtIndex, createdAtIndex] = updatedOrderingParams;
    setFetchParams((fetchParams) => ({
      ...fetchParams,
      startDateDirection: dateOrders[startDateDirectionIndex],
      updatedAt: dateOrders[updatedAtIndex],
      createdAt: dateOrders[createdAtIndex],
    }));
  }, []);

  const onSetStartDateOrdering = useCallback(() => {
    const newIndexes = [(columnOrderDate[0] + 1) % 3, 0, 0];
    setColumnOrderDate(newIndexes);
    setOrderingParams(newIndexes);
  }, [columnOrderDate, setOrderingParams]);

  const onSetUpdatedAtOrdering = useCallback(() => {
    const newIndexes = [0, (columnOrderDate[1] + 1) % 3, 0];
    setColumnOrderDate(newIndexes);
    setOrderingParams(newIndexes);
  }, [columnOrderDate, setOrderingParams]);

  const onSetCreatedAtOrdering = useCallback(() => {
    const newIndexes = [0, 0, (columnOrderDate[2] + 1) % 3];
    setColumnOrderDate(newIndexes);
    setOrderingParams(newIndexes);
  }, [columnOrderDate, setOrderingParams]);

  const { dashboardAllOrdersResponse, error: dashboardAllOrdersError, mutate: orderMutate } = useOrdersDashboardAll(
    {
      page: tabPageIndex,
      pageSize,
      ...fetchParams,
      startDateDirection: fetchParams.startDateDirection,
      updatedAt: invertOrdering(fetchParams.updatedAt),
      createdAt: invertOrdering(fetchParams.createdAt),
    },
    !calendarVisible,
    invalidateCacheKey
  );

  const { calendarOrdersResponse, error: calendarOrdersError, mutate: calendarOrdersMutate } = useOrdersCalendar(
    {
      fromDate: moment.utc(date).startOf(calendarViewType).valueOf(),
      toDate: moment.utc(date).endOf(calendarViewType).valueOf(),
      ..._.omit(fetchParams, 'fromDate', 'toDate'),
    },
    calendarVisible,
    invalidateCacheKey
  );

  const calendarEvents: Array<OrderEvent> =
    calendarOrdersResponse?.data.orders.map((order) => ({
      ...order,
      startDate: moment(order.startDate).toDate(),
      endDate: moment(order.endDate).toDate(),
      orderStatus: mapOrderStatus(isBoom, false, order.orderStatus),
    })) || [];

  useEffect(() => {
    onUpdateCounter((counter) => {
      const totalElements = calendarVisible ? calendarOrdersResponse?.data.total : dashboardAllOrdersResponse?.totalElements;
      return totalElements ?? counter;
    });
  }, [dashboardAllOrdersResponse, calendarOrdersResponse, calendarVisible, onUpdateCounter]);

  useEffect(() => {
    setTotalPages((pages) => {
      const totalPages = dashboardAllOrdersResponse?.totalPages;
      return totalPages ?? pages;
    });
  }, [dashboardAllOrdersResponse]);

  const isLoading = calendarVisible
    ? !calendarOrdersResponse && !calendarOrdersError
    : !dashboardAllOrdersResponse && !dashboardAllOrdersError;

  const orders =
    dashboardAllOrdersResponse?.content.map((order) => ({
      ...order,
      orderStatus: mapOrderStatus(isBoom, false, order.orderStatus),
      originalStatus: order.orderStatus,
    })) || [];

  const columns: Array<Column<DashboardAllOrderOriginalStatus>> = useDashboardAllColumns(
    onSetStartDateOrdering,
    onSetUpdatedAtOrdering,
    onSetCreatedAtOrdering,
    selectedStartDateDirection,
    selectedUpdatedAt,
    selectedCreatedAt,
    orderMutate
  );

  const tableInstance: any = useTable(
    {
      columns,
      data: orders,
      manualPagination: true,
      pageCount: totalPages,
      autoResetSelectedRows: false,
    } as any,
    usePagination
  );

  const {
    canPreviousPage,
    canNextPage,
    previousPage,
    nextPage,
    gotoPage,
    state: { pageIndex },
  } = tableInstance;

  useEffect(() => {
    setTabPageIndex(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    if (tabPageIndex === 0) {
      gotoPage(0);
    }
  }, [tabPageIndex, gotoPage]);

  return (
    <>
      <div style={{ padding: '14px 12px 0', backgroundColor: '#ffffff', borderTopRightRadius: 20 }}>
        <AllDashboardFilterPanel
          isLoading={isLoading}
          onSearch={updateFetchParams}
          onReset={onResetFetchParams}
          calendarVisible={calendarVisible}
          initialDateRange={{
            start: fetchParams.fromDate ? new Date(fetchParams.fromDate) : null,
            end: fetchParams.toDate ? new Date(fetchParams.toDate) : null,
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', padding: '0px 10px 10px 10px' }}>
        <CalendarTableSwitch calendarVisible={calendarVisible} onChangeCalendarVisible={setCalendarVisible} />
        <ContextualFilterWrapper>
          {calendarVisible ? (
            <CalendarDateFilter
              from={date}
              viewType={calendarViewType}
              onChangeView={setCalendarViewType}
              onTodaySelection={() => setDate(moment().format())}
              onPrevious={() => {
                setDate((date) => {
                  const dateField = getDateField(calendarViewType);
                  return moment.utc(date).subtract(1, dateField).format();
                });
              }}
              onNext={() => {
                setDate((date) => {
                  const dateField = getDateField(calendarViewType);
                  return moment.utc(date).add(1, dateField).format();
                });
              }}
            />
          ) : (
            <Paginator
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              previousPage={previousPage}
              nextPage={nextPage}
              pageSize={pageSize}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onSetPageSize={setPageSize}
            />
          )}
        </ContextualFilterWrapper>
      </div>
      {calendarVisible ? (
        <>
          <OrdersCalendar
            date={date}
            calendarViewType={calendarViewType}
            events={calendarEvents}
            onSelectEvent={selectOrder}
            onOpenNewOrderForm={openNewOrderForm}
            smbUnsubscribedGrace={unsubscribedGrace}
          />
          <div id="event-modal" />
        </>
      ) : (
        <div style={{ marginBottom: 30, backgroundColor: '#ffffff' }}>
          {orders.length === 0 && !isLoading ? (
            <Typography variantName="body1" style={{ marginLeft: 12 }}>
              {t('order.noItemsFound')}
            </Typography>
          ) : (
            <AllOrdersTable tableInstance={tableInstance} isLoading={isLoading} onSelectRow={selectOrder} />
          )}
        </div>
      )}
      <ShowForPermissions permissions={[Permission.ShootingCreate]}>
        <AddOrdersButton onSingle={openNewOrderForm} onBulk={openBulkUpload} disabled={unsubscribedGrace} />
      </ShowForPermissions>
      {isSMB && (
        <InfoModal
          id="onGoingPayment"
          title={t('forms.newOrder.payment.onGoingTitle')}
          body={t('forms.newOrder.payment.onGoingDescription')}
          style={{ width: 450 }}
          onConfirm={onCompleteInsert}
        />
      )}
    </>
  );
};
