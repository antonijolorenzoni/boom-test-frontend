import React, { useMemo } from 'react';
import moment from 'moment';
import { Column } from 'react-table';
import i18Countries from 'i18n-iso-countries';
import { Button, Icon, Popup, Typography } from 'ui-boom-components';

import { Header } from 'components/OrdersTable/Header';
import { useTranslation } from 'react-i18next';
import { EllipsisTypography } from 'components/OrdersTable/styles';
import { IconWrapper } from './styles';
import { clientStatuses, PERMISSIONS, PERMISSION_ENTITIES, SHOOTING_STATUSES_UI_ELEMENTS } from 'config/consts';
import { InfoPoint } from 'components/InfoPoint';
import { OrderStatusLegend } from 'components/OrderStatusLegend';
import { Ordering } from 'types/Ordering';
import { getOrderIconName } from 'utils/get-ordering-icon';
import { DashboardAllOrdersResponse } from 'types/DashboardAllOrderResponse';
import { getDurationString } from 'utils/timeHelpers';
import { useModal } from 'hook/useModal';
import { Modal } from 'components/Modals';
import { useWhoAmI } from 'hook/useWhoAmI';
import { OrderStatus } from 'types/OrderStatus';
import { QuickActionIcon } from './QuickActionIcon';
import { responseInterface } from 'swr';
import { ApiResponse } from 'types/ApiResponse';
import { DashboardAllOrderOriginalStatus } from './type';
import AbilityProvider from 'utils/AbilityProvider';
import { ShowForPermissions } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

export const useDashboardAllColumns = (
  setStartDateOrdering: () => void,
  setUpdatedAtOrdering: () => void,
  setCreatedAtOrdering: () => void,
  selectedStartDateOrder: Ordering | null,
  updatedAtOrder: Ordering | null,
  createdAtOrder: Ordering | null,
  updateOrders: responseInterface<ApiResponse<DashboardAllOrdersResponse>, any>['mutate']
) => {
  const { t, i18n } = useTranslation();

  moment.locale(window.navigator.language);

  const { isClient } = useWhoAmI();

  const canHandleOrder = AbilityProvider.getOrganizationAbilityHelper().hasPermission([PERMISSIONS.CREATE], PERMISSION_ENTITIES.SHOOTING);

  return useMemo((): Array<Column<DashboardAllOrderOriginalStatus>> => {
    const columns: Array<Column<DashboardAllOrderOriginalStatus>> = [
      {
        Header: <Header i18key="dashboards.dashboardAllHeader.code" />,
        accessor: 'orderCode',
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
        Header: () => {
          const { openModal, onClose } = useModal();

          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Header i18key="dashboards.dashboardAllHeader.status" />
              <InfoPoint onClick={() => openModal('statusLegend')} />
              <Modal id="statusLegend">
                <Typography variantName="title2" textColor="#000000" style={{ padding: '0px 0px 16px' }}>
                  {t('shootings.shootingStatusesLegend')}
                </Typography>
                <OrderStatusLegend statuses={isClient ? clientStatuses : Object.values(OrderStatus)} />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                  <Button onClick={() => onClose('statusLegend')}>{t('forms.close')}</Button>
                </div>
              </Modal>
            </div>
          );
        },
        accessor: 'orderStatus',
        Cell: ({ row: { original } }) => {
          const orderStatus = original.orderStatus;
          const orderStatusLabel = t(`shootingStatuses.${orderStatus}`);
          const orderStatusColor = SHOOTING_STATUSES_UI_ELEMENTS[orderStatus]?.color;

          return (
            <EllipsisTypography variantName="overline" style={{ textTransform: 'uppercase', color: orderStatusColor }}>
              {orderStatusLabel}
            </EllipsisTypography>
          );
        },
        width: '6%',
      },
      {
        Header: <Header i18key="dashboards.dashboardAllHeader.title" />,
        accessor: 'orderTitle',
        Cell: ({ row: { original } }) => (
          <Popup text={original.orderTitle}>
            {(paragraphRef) => (
              <EllipsisTypography variantName="body2" parentRef={paragraphRef}>
                {original.orderTitle}
              </EllipsisTypography>
            )}
          </Popup>
        ),
        width: '8%',
      },
      {
        Header: <Header i18key="dashboards.dashboardAllHeader.packageName" />,
        accessor: 'packet',
        Cell: ({ row: { original } }) => {
          const { packet } = original;

          const text = packet
            ? t('dashboards.packageInfo', { name: packet.name, photos: packet.photos, duration: getDurationString(packet.duration) })
            : '-';

          return (
            <Popup text={text}>
              {(paragraphRef) => (
                <EllipsisTypography variantName="body2" parentRef={paragraphRef}>
                  {text}
                </EllipsisTypography>
              )}
            </Popup>
          );
        },
        width: '8%',
      },
      {
        Header: <Header i18key="dashboards.dashboardAllHeader.country" />,
        accessor: 'countryIsoCode',
        Cell: ({ row: { original } }) => (
          <EllipsisTypography variantName="body2">{i18Countries.getName(original.countryIsoCode, i18n.language)}</EllipsisTypography>
        ),
        width: '6%',
      },
      {
        Header: <Header i18key="dashboards.dashboardAllHeader.address" />,
        accessor: 'address',
        Cell: ({ row: { original } }) => (
          <Popup text={original.address}>
            {(paragraphRef) => (
              <EllipsisTypography variantName="body2" parentRef={paragraphRef}>
                {original.address}
              </EllipsisTypography>
            )}
          </Popup>
        ),
        width: '12%',
      },
      {
        Header: (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={setStartDateOrdering}>
            <Header i18key="dashboards.dashboardAllHeader.date" />
            <Icon name={getOrderIconName(selectedStartDateOrder)} color="#5AC0B1" size={15} />
          </div>
        ),
        accessor: 'startDate',
        Cell: ({ row: { original } }) => (
          <EllipsisTypography variantName="caption" textColor="black">
            {moment(original.startDate).isValid() ? moment(original.startDate).format('L') : '-'}
          </EllipsisTypography>
        ),
        width: '6%',
      },
      {
        Header: <Header i18key="dashboards.dashboardAllHeader.time" />,
        accessor: 'startDate',
        id: 'startTime',
        Cell: ({ row: { original } }) => (
          <EllipsisTypography variantName="caption" textColor="black">
            {moment(original.startDate).isValid() ? moment(original.startDate).format('LT') : '-'}
          </EllipsisTypography>
        ),
        width: '4%',
      },
      {
        Header: (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={setUpdatedAtOrdering}>
            <Header i18key="dashboards.dashboardAllHeader.updatedAt" />
            <Icon name={getOrderIconName(updatedAtOrder)} color="#5AC0B1" size={15} />
          </div>
        ),
        accessor: 'updatedAt',
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
        width: '4%',
      },
      {
        Header: (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={setCreatedAtOrdering}>
            <Header i18key="dashboards.dashboardAllHeader.createdAt" />
            <Icon name={getOrderIconName(createdAtOrder)} color="#5AC0B1" size={15} />
          </div>
        ),
        accessor: 'createdAt',
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
        width: '4%',
      },
    ];

    const packageColumn: Column<DashboardAllOrderOriginalStatus> = {
      Header: <Header i18key="dashboards.dashboardAllHeader.packagePrice" />,
      accessor: 'packet',
      id: 'packagePrice',
      Cell: ({ row: { original } }) => {
        const { packet } = original;

        return <Typography variantName="body2">{packet ? `${packet?.price} ${packet?.currency}` : '-'}</Typography>;
      },
      width: '4%',
    };

    const companyColumn: Column<DashboardAllOrderOriginalStatus> = {
      Header: <Header i18key="dashboards.dashboardAllHeader.company" />,
      accessor: 'companyName',
      Cell: ({ row: { original } }) => (
        <Popup text={original.companyName}>
          {(paragraphRef) => (
            <EllipsisTypography variantName="body1" parentRef={paragraphRef}>
              {original.companyName}
            </EllipsisTypography>
          )}
        </Popup>
      ),
      width: '10%',
    };

    const photographerColumn: Column<DashboardAllOrderOriginalStatus> = {
      Header: <Header i18key="dashboards.dashboardAllHeader.photographer" />,
      accessor: 'photographer',
      Cell: ({ row: { original } }) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <EllipsisTypography variantName="body2">{original.photographer?.name || ' - '}</EllipsisTypography>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {original.photographer ? (
                <>
                  <ShowForPermissions permissions={[Permission.PhotographerPhoneRead]}>
                    <Popup text={original.photographer?.phone} isWidthCheck={false} style={{ marginTop: -50 }}>
                      {(paragraphRef: any) => (
                        <IconWrapper
                          href={`tel:${original.photographer?.phone}`}
                          backgroundColor="#5AC0B1"
                          ref={paragraphRef}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon name="call" color="white" size={15} />
                        </IconWrapper>
                      )}
                    </Popup>
                  </ShowForPermissions>
                  <ShowForPermissions permissions={[Permission.PhotographerMailRead]}>
                    <Popup text={original.photographer?.email} isWidthCheck={false} style={{ marginTop: -50 }}>
                      {(paragraphRef: any) => (
                        <IconWrapper
                          href={`tel:${original.photographer?.email}`}
                          backgroundColor="#5AC0B1"
                          ref={paragraphRef}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon name="email" color="white" size={15} />
                        </IconWrapper>
                      )}
                    </Popup>
                  </ShowForPermissions>
                </>
              ) : (
                <>
                  <ShowForPermissions permissions={[Permission.PhotographerPhoneRead]}>
                    <IconWrapper backgroundColor="#A3ABB1">
                      <Icon name="call" color="white" size={15} />
                    </IconWrapper>
                  </ShowForPermissions>
                  <ShowForPermissions permissions={[Permission.PhotographerMailRead]}>
                    <IconWrapper backgroundColor="#A3ABB1">
                      <Icon name="email" color="white" size={15} />
                    </IconWrapper>
                  </ShowForPermissions>
                </>
              )}
            </div>
          </div>
        );
      },
      width: '12%',
    };

    const quickActionsColumn: Column<DashboardAllOrderOriginalStatus> = {
      Header: <Header i18key="dashboards.dashboardAllHeader.actions" />,
      id: 'actions',
      accessor: 'orderId',
      Cell: ({ row: { original } }) => <QuickActionIcon order={original} onUpdateOrders={updateOrders} />,
      width: '1%',
    };

    if (isClient) {
      return canHandleOrder
        ? [...columns.slice(0, 4), packageColumn, ...columns.slice(4, 8), quickActionsColumn, ...columns.slice(8)]
        : [...columns.slice(0, 4), packageColumn, ...columns.slice(4)];
    }

    return [...columns.slice(0, 3), companyColumn, ...columns.slice(3, 8), photographerColumn, ...columns.slice(8)];
  }, [
    t,
    i18n,
    isClient,
    selectedStartDateOrder,
    updatedAtOrder,
    createdAtOrder,
    setStartDateOrdering,
    setUpdatedAtOrdering,
    setCreatedAtOrdering,
    updateOrders,
    canHandleOrder,
  ]);
};
