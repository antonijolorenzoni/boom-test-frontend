import React, { useCallback, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { Icon, Popup, Typography } from 'ui-boom-components';
import { responseInterface } from 'swr';

import { DashboardAllOrdersResponse } from 'types/DashboardAllOrderResponse';
import { OrderStatus } from 'types/OrderStatus';
import { FeedbackClientPanel } from 'components/FeedbackClientPanel';
import { Modal } from 'components/Modals';
import { DeleteReasonPanel } from 'components/CancellationReasons/DeleteReasonPanel';
import { useModal } from 'hook/useModal';
import { download } from 'utils/download';
import { deleteOrder } from 'api/ordersAPI';
import { ApiResponse } from 'types/ApiResponse';
import { confirmShootingPhotosDownload, createCompanyShootingScore } from 'api/shootingsAPI';
import { useSelector } from 'react-redux';
import { useAlertModal } from 'hook/useAlertModal';
import { DashboardAllOrderOriginalStatus } from './type';

enum QuickAction {
  Delete = 'Delete',
  DeleteDisabled = 'DeleteDisabled',
  Download = 'Download',
  Rate = 'Rate',
}

const toActionMap: { [k: string]: QuickAction } = {
  [OrderStatus.Accepted]: QuickAction.Delete,
  [OrderStatus.New]: QuickAction.Delete,
  [OrderStatus.Pending]: QuickAction.Delete,
  [OrderStatus.Matched]: QuickAction.Delete,
  [OrderStatus.Assigned]: QuickAction.Delete,
  [OrderStatus.AutoAssignment]: QuickAction.Delete,
  [OrderStatus.Unscheduled]: QuickAction.Delete,
  [OrderStatus.Refused]: QuickAction.Delete,
  [OrderStatus.Uploaded]: QuickAction.DeleteDisabled,
  [OrderStatus.Done]: QuickAction.Download,
  [OrderStatus.Downloaded]: QuickAction.Rate,
};

const getAction = (orderStatus: OrderStatus): QuickAction | null => toActionMap[orderStatus] || null;

const getActionIcon = (action: QuickAction | null, tooltipDeleteDisabled: string, companyScore?: number | null) => {
  switch (action) {
    case QuickAction.Delete:
      return <Icon name="delete" color="#FF2727" size={18} outlined data-testid="delete-icon" />;
    case QuickAction.DeleteDisabled:
      return (
        <Popup text={tooltipDeleteDisabled} isWidthCheck={false} style={{ marginTop: -60, width: 240 }}>
          {(ref: any) => (
            <div ref={ref} style={{ display: 'flex' }}>
              <Icon name="delete" color="#A3ABB1" size={18} outlined style={{ cursor: 'not-allowed' }} data-testid="delete-disabled-icon" />
            </div>
          )}
        </Popup>
      );
    case QuickAction.Download:
      return <Icon name="file_download" color="#5AC0B1" size={18} outlined data-testid="download-icon" />;
    case QuickAction.Rate: {
      return (
        <>
          {companyScore ? (
            <Icon name="star" color="#F2994A" size={18} data-testid="rated-icon" />
          ) : (
            <Icon name="star_outline" color="#5AC0B1" size={18} data-testid="to-be-rate-icon" />
          )}
          <Typography variantName="caption">&nbsp;{companyScore || '-'}</Typography>
        </>
      );
    }
    default:
      return null;
  }
};

export const QuickActionIcon: React.FC<{
  order: DashboardAllOrderOriginalStatus;
  onUpdateOrders: responseInterface<ApiResponse<DashboardAllOrdersResponse>, any>['mutate'];
  DeleteModal?: React.FC<any>;
  FeedbackModal?: React.FC<any>;
}> = ({ order, onUpdateOrders, DeleteModal = DeleteReasonPanel, FeedbackModal = FeedbackClientPanel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { openModal, onClose } = useModal();
  const { t } = useTranslation();

  const organizationId = useSelector((state: any) => state.user.data.organization);

  const { orderId, startDate, companyScore, downloadLink, originalStatus } = order;

  const modalId = `${orderId}-quick-action`;

  const action = getAction(originalStatus);

  const showAlert = useAlertModal();

  const getActionModal = useCallback(() => {
    switch (action) {
      case QuickAction.Delete: {
        const now = moment().valueOf();
        const isStartBefore = moment(startDate).isBefore(now);
        const diff = moment(startDate).diff(now);
        const duration = moment.duration(diff);

        let warningMessage = t('shootings.onCancelShootingConfirm');

        if (isStartBefore || (duration.days() === 0 && duration.hours() <= 6)) {
          warningMessage = t('shootings.onCancelShootingConfirmPenalityHard');
        } else if (duration.days() === 0 && duration.hours() >= 6) {
          warningMessage = t('shootings.onCancelShootingConfirmPenality');
        }
        return (
          <div style={{ marginTop: 20 }}>
            <DeleteModal
              orderStatus={originalStatus}
              onConfirmCancellation={async (reason, text) => {
                setLoading(true);
                try {
                  await deleteOrder(orderId, reason, text);
                  onUpdateOrders();
                  showAlert(t('shootings.cancelShootingSuccess'), 'success');
                } catch (error) {
                  showAlert(t('shootings.cancelShootingError'), 'error');
                } finally {
                  setLoading(false);
                  onClose(modalId);
                }
              }}
              warningMessage={warningMessage}
              loading={loading}
            />
          </div>
        );
      }

      case QuickAction.Rate:
        return (
          <FeedbackModal
            color="#FFA501"
            onConfirm={async (rate: number, note: string) => {
              setLoading(true);
              try {
                await createCompanyShootingScore(organizationId, orderId, {
                  companyScore: rate,
                  comment: note,
                });
                onUpdateOrders();
                showAlert(t('shootings.evaluateServiceSuccess'), 'success');
              } catch (error) {
                showAlert(t('shootings.evaluateServiceError'), 'error');
              } finally {
                setLoading(false);
                onClose(modalId);
              }
            }}
            loading={loading}
          />
        );
      default:
        return null;
    }
  }, [t, action, modalId, organizationId, onClose, orderId, originalStatus, startDate, loading, onUpdateOrders, showAlert]);

  return (
    <>
      <div
        data-testid="quick-action-icon"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={async (e) => {
          e.stopPropagation();
          if (QuickAction.Delete === action || (QuickAction.Rate === action && !companyScore)) {
            openModal(modalId);
          }

          if (action === QuickAction.Download && downloadLink) {
            await confirmShootingPhotosDownload(organizationId, orderId);
            await onUpdateOrders();
            download(downloadLink, `${order.orderCode}.zip`);
          }
        }}
      >
        {getActionIcon(action, t('dashboards.deleteOrderDisabled'), companyScore)}
      </div>
      <Modal id={modalId} style={{ overflow: 'initial' }}>
        {getActionModal()}
      </Modal>
    </>
  );
};
