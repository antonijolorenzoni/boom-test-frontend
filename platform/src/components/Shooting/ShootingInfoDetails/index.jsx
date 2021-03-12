import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Icon, Typography, IconButton, Button, Tooltip } from 'ui-boom-components';

import AbilityProvider from 'utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES, SHOOTINGS_STATUSES, HIDDEN_DELETE_BUTTON_STATUSES, DELIVERY_METHOD_TYPE } from 'config/consts';
import { mapOrderStatus } from 'config/utils';
import { AdminPhotographerShootingInfoDetails } from './AdminPhotograherShootingInfoDetails';
import { ClientShootingInfoDetails } from './ClientShootingInfoDetails';
import { ColouredBox, TransparentButtonOverlay } from './styles';
import { ShootingInfoDetailsAssigneeDropdown } from './ShootingInfoDetailsAssigneeDropdown';
import { SummaryPanel } from './SummaryPanel';
import { useSmbProfile } from 'hook/useSmbProfile';
import { useSubscription } from 'hook/useSubscription';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { OrderStatus } from 'types/OrderStatus';
import { hideModal, showModal } from 'redux/actions/modals.actions';
import { NewOrderForm } from 'components/Forms/NewOrderForm';
import { getOrganization } from 'api/organizationsAPI';
import { createShootingRefund } from 'api/shootingsAPI';

const canOrderBeRescheduled = (
  startDate,
  canEdit,
  canBeRescheduled,
  canEditShootingOrganizationPermission,
  canEditShootingCompanyPermission
) => {
  let dateOk = true;

  if (startDate) {
    dateOk = moment(startDate).isAfter(moment.now().valueOf());
  }

  return dateOk && canBeRescheduled && canEdit && (canEditShootingOrganizationPermission || canEditShootingCompanyPermission);
};

const canOrderBeDeleted = (
  isPhotographer,
  states,
  canCancelShootingOrganizationPermission,
  canCancelShootingCompanyPermission,
  isCcUser,
  state
) => {
  return (
    (isCcUser && state === SHOOTINGS_STATUSES.UNSCHEDULED) ||
    (!isPhotographer &&
      !_.includes(HIDDEN_DELETE_BUTTON_STATUSES, states) &&
      (canCancelShootingOrganizationPermission || canCancelShootingCompanyPermission))
  );
};

const ShootingInfoDetails = ({
  isBoom,
  isPhotographer,
  isCcUser,
  isSMB,
  shooting,
  statusColor,
  backgroundStyle,
  onShowSalesInfo,
  onShowShootingInfoForm,
  onCancelShooting,
  onShowShootingRescheduleForm,
  onModifyTitleRequest,
  onChangeAssignee,
  updateOrders,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { smbProfile } = useSmbProfile(isSMB);
  const { subscription } = useSubscription(isSMB, smbProfile?.companyId);

  const { id, assignee, createdAt, updatedAt, pricingPackage } = shooting;

  const type = _.get(shooting, 'pricingPackage.photoType.type');

  const userData = useSelector((state) => state.user.data);

  const { state, code, title, startDate, canBeRescheduled, referenceCode } = shooting;

  const mappedShootingState = mapOrderStatus(isBoom, isPhotographer, state);
  const shootingStateLabel = t(`shootingStatuses.${mappedShootingState}`).toUpperCase();

  const canEdit = _.includes(
    [
      SHOOTINGS_STATUSES.UNSCHEDULED,
      SHOOTINGS_STATUSES.NEW,
      SHOOTINGS_STATUSES.MATCHED,
      SHOOTINGS_STATUSES.PENDING,
      SHOOTINGS_STATUSES.ASSIGNED,
      SHOOTINGS_STATUSES.ACCEPTED,
      SHOOTINGS_STATUSES.AUTO_ASSIGNMENT,
    ],
    mappedShootingState
  );

  const rescheduleAllowedState = _.includes(
    [
      SHOOTINGS_STATUSES.NEW,
      SHOOTINGS_STATUSES.MATCHED,
      SHOOTINGS_STATUSES.PENDING,
      SHOOTINGS_STATUSES.ASSIGNED,
      SHOOTINGS_STATUSES.ACCEPTED,
      SHOOTINGS_STATUSES.AUTO_ASSIGNMENT,
    ],
    mappedShootingState
  );

  const canEditShootingOrganizationPermission = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
    [PERMISSIONS.UPDATE],
    PERMISSION_ENTITIES.SHOOTING
  );

  const canEditShootingCompanyPermission = AbilityProvider.getCompanyAbilityHelper().hasPermission(
    [PERMISSIONS.UPDATE],
    PERMISSION_ENTITIES.SHOOTING
  );

  const canCancelShootingOrganizationPermission = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
    [PERMISSIONS.CANCEL],
    PERMISSION_ENTITIES.SHOOTING
  );

  const canCancelShootingCompanyPermission = AbilityProvider.getCompanyAbilityHelper().hasPermission(
    [PERMISSIONS.CANCEL],
    PERMISSION_ENTITIES.SHOOTING
  );

  const canReschedule = canOrderBeRescheduled(
    startDate,
    rescheduleAllowedState,
    canBeRescheduled,
    canEditShootingOrganizationPermission,
    canEditShootingCompanyPermission
  );

  const canDelete = canOrderBeDeleted(
    isPhotographer,
    mappedShootingState,
    canCancelShootingOrganizationPermission,
    canCancelShootingCompanyPermission,
    isCcUser,
    state
  );

  const canEditTitle = !isPhotographer && !isCcUser && canEditShootingOrganizationPermission && canEdit;

  const canEditShootingInfo =
    state !== SHOOTINGS_STATUSES.DONE && (canEditShootingOrganizationPermission || canEditShootingCompanyPermission);

  const isUnscheduledView = shooting.state === SHOOTINGS_STATUSES.UNSCHEDULED;

  const isUnsubscribed = subscription?.subscriptionStatus === SubscriptionStatus.UNSUBSCRIBED;
  const isUnsubscribedGrace = subscription?.subscriptionStatus === SubscriptionStatus.UNSUBSCRIBED_GRACE;
  const isUnsubscribedOrGrace = isUnsubscribed || isUnsubscribedGrace;

  const [unsubscribedTooltipVisible, setUnsubscribedTooltipVisible] = useState(false);
  const rescheduleWrapperRef = useRef(null);

  // trick to trigger events on disabled html element
  const [rescheduleButtonWidth, setRescheduleButtonWidth] = useState();

  const [cloneLoading, setCloneLoading] = useState();

  const openNewOrderForm = async () => {
    const {
      title,
      company,
      pricingPackage,
      mainContact,
      place,
      deliveryMethods,
      refund,
      description,
      logisticInformation,
      editingOption,
    } = shooting;

    setCloneLoading(true);
    const organization = await getOrganization(company.organization);
    setCloneLoading(false);

    const { id: organizationId, name: organizationName, deliverToMainContact } = organization.data;
    const deliveryMails = deliveryMethods.filter((dm) => dm.type === DELIVERY_METHOD_TYPE.EMAIL).map((dm) => dm.contact);
    const deliveryDrive = deliveryMethods.find((dm) => dm.type === DELIVERY_METHOD_TYPE.DRIVE);

    dispatch(
      showModal('NewOrderDrawer', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: (
            <div style={{ padding: '20px 40px' }} id="create-order-drawer">
              <NewOrderForm
                initialValues={{
                  orderName: title,
                  organization: {
                    value: organizationId,
                    label: organizationName,
                    deliverToMainContact,
                  },
                  company: {
                    value: company.id,
                    label: company.name,
                  },
                  pricingPackage,
                  contactName: mainContact.fullName,
                  contactPhoneNumber: mainContact.phoneNumber,
                  contactEmail: mainContact.email,
                  fullAddress: {
                    value: place.placeId,
                    label: place.formattedAddress,
                  },
                  place,
                  businessName: mainContact.businessName,
                  knowDateAndTime: null,
                  date: null,
                  startTime: null,
                  deliveryMethodsEmails: deliveryMails,
                  deliveryMethodsIsDriveSelected: Boolean(deliveryDrive),
                  orderRefund: refund || 0,
                  description,
                  logisticInformation,
                  editingOption,
                  driveFolderId: deliveryDrive?.contact,
                  driveFolderName: deliveryDrive?.alias,
                }}
                referenceCode={shooting.code}
                onCancel={() => dispatch(hideModal('NewOrderDrawer'))}
                onCreateOrderCompleted={(organizationId, orderId, refund) => {
                  updateOrders();

                  if (isBoom && refund) {
                    createShootingRefund(organizationId, orderId, { amount: refund });
                  }
                }}
              />
            </div>
          ),
        },
      })
    );
  };

  useEffect(() => {
    setRescheduleButtonWidth(rescheduleWrapperRef.current?.getBoundingClientRect().width);
  }, [rescheduleWrapperRef]);

  const ActionButtons = ({ marginTop }) => (
    <div style={{ display: 'flex', position: 'absolute', right: 20, zIndex: 1, marginTop }} data-testid="action-buttons">
      {state === OrderStatus.Reshoot && isBoom && (
        <Button
          data-testid="reschedule-btn"
          size="small"
          backgroundColor="#ffffff"
          textColor={statusColor}
          spinnerColor={statusColor}
          onClick={openNewOrderForm}
          loading={cloneLoading}
        >
          {t('shootings.cloneOrder')}
        </Button>
      )}
      {canReschedule && (
        <>
          <Tooltip
            message={t('smb.unsubscribedCannotReschedule')}
            placement="top"
            targetRef={rescheduleWrapperRef}
            isArrowVisible={false}
            isVisible={unsubscribedTooltipVisible}
            textColor="#000000"
          />
          <div ref={rescheduleWrapperRef}>
            {isUnsubscribedOrGrace && (
              <TransparentButtonOverlay
                rescheduleButtonWidth={rescheduleButtonWidth}
                onMouseEnter={() => isUnsubscribedOrGrace && setUnsubscribedTooltipVisible(true)}
                onMouseLeave={() => setUnsubscribedTooltipVisible(false)}
              />
            )}
            <Button
              data-testid="reschedule-btn"
              size="small"
              backgroundColor="#ffffff"
              textColor={statusColor}
              style={{ minWidth: 104 }}
              onClick={onShowShootingRescheduleForm}
              disabled={isUnsubscribedOrGrace}
            >
              <Icon name="calendar_today" color={statusColor} size="13" style={{ position: 'relative', top: -1 }} />
              {t('shootings.reschedule')}
            </Button>
          </div>
        </>
      )}
      {canDelete && (
        <Button
          size="small"
          backgroundColor="#ffffff"
          textColor={statusColor}
          style={{ minWidth: 104, marginLeft: 11 }}
          onClick={onCancelShooting}
        >
          <Icon name="delete_outline" color={statusColor} size="13" style={{ position: 'relative', top: -1 }} />
          {t('shootings.cancelShooting')}
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <ColouredBox
        isMatched={mappedShootingState === SHOOTINGS_STATUSES.MATCHED}
        isPhotographer={isPhotographer}
        isUnscheduled={isUnscheduledView}
        style={{ ...backgroundStyle }}
      ></ColouredBox>
      <div style={{ marginTop: 42 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography variantName="title1" textColor="#FFFFFF">
              {code}
            </Typography>
            {canEditTitle && (
              <IconButton onClick={onModifyTitleRequest}>
                <Icon name="create" color="#ffffff" size={18} />
              </IconButton>
            )}
            {referenceCode && !isPhotographer && (
              <Typography variantName="caption2" textColor="#FFFFFF" style={{ marginLeft: 12 }}>
                {t('order.fromOrder', { referenceCode })}
              </Typography>
            )}
          </div>
          <Typography variantName="body1" textColor="#FFFFFF">
            {shootingStateLabel}
          </Typography>
        </div>
        <Typography variantName="body1" textColor="#FFFFFF">
          {title}
        </Typography>
        {isUnscheduledView && (isBoom || isCcUser) ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variantName="body1" textColor="#FFFFFF" style={{ marginRight: 12 }}>
                  {t('shootings.assignee')}:
                </Typography>
                <div style={{ width: 160 }} data-testid="assignee-dropdown">
                  <ShootingInfoDetailsAssigneeDropdown
                    assignee={assignee}
                    shootingId={id}
                    userData={userData}
                    organizationId={pricingPackage?.organizationId}
                    onChange={onChangeAssignee}
                  />
                </div>
              </div>
              <ActionButtons marginTop={0} />
            </div>
            <SummaryPanel type={type} createdAt={createdAt} updatedAt={updatedAt} />
          </>
        ) : (
          <ActionButtons marginTop={10} />
        )}
        {!isUnscheduledView &&
          (isBoom || isPhotographer ? (
            <AdminPhotographerShootingInfoDetails
              isBoom={isBoom}
              isPhotographer={isPhotographer}
              statusColor={statusColor}
              shooting={shooting}
              onShowSalesInfo={onShowSalesInfo}
              onShowShootingInfoForm={onShowShootingInfoForm}
            />
          ) : (
            <div style={{ marginTop: 40 }}>
              <ClientShootingInfoDetails
                shooting={shooting}
                statusColor={statusColor}
                onShowShootingInfoForm={onShowShootingInfoForm}
                canEdit={canEditShootingInfo}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export { ShootingInfoDetails };
