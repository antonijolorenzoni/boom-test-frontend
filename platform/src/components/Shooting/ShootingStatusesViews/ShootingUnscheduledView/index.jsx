import React, { useState, useEffect } from 'react';
import * as ModalActions from 'redux/actions/modals.actions';
import * as ShootingActions from 'redux/actions/shootings.actions';
import { UpdateUnscheduledPhotoshootForm } from 'components/Forms/UpdateUnscheduledPhotoshootForm';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';

import translations from 'translations/i18next';
import { updateShooting, scheduleShooting } from 'api/shootingsAPI';
import { DELIVERY_METHOD_TYPE, USER_ROLES } from 'config/consts';
import { fetchCompanyDetails } from 'api/companiesAPI';

export const ShootingUnscheduledView = ({ shooting, onUpdateOrders, onClose }) => {
  const shootingId = shooting.id;

  const [isDriveAuthorized, setIsDriveAuthorized] = useState(false);

  const isBoom = useSelector((state) => state.user.data.isBoom);
  const isContactCenter = useSelector((state) => state.user.data.roles.some((role) => role.name === USER_ROLES.ROLE_CONTACT_CENTER));
  const dispatch = useDispatch();

  const company = shooting.company;
  const organizationId = company.organization;

  const driveMethod = shooting.deliveryMethods.find((method) => method.type === DELIVERY_METHOD_TYPE.DRIVE);
  const driveFolderId = driveMethod ? driveMethod.contact : null;
  const driveFolderName = driveMethod ? driveMethod.alias : null;

  const onResponseError = () => {
    dispatch(
      ModalActions.showModal('EDIT_SHOOTING_ERROR', {
        modalType: 'ERROR_ALERT',
        modalProps: {
          message: translations.t('shootings.shootingModifyError'),
        },
      })
    );
  };

  const onResponseOk = () => {
    dispatch(
      ModalActions.showModal('EDIT_SHOOTING_OK', {
        modalType: 'SUCCESS_ALERT',
        modalProps: {
          message: translations.t('shootings.shootingModifySuccess'),
        },
      })
    );
  };

  const onUpdateShooting = async (shootingId) => {
    const updatedShooting = await dispatch(ShootingActions.fetchShootingDetails(shootingId));

    dispatch(ShootingActions.updateShootingInState(updatedShooting));
  };

  const setCompanyGoogleAuthorized = async (organizationId, companyId) => {
    const companyDetails = await fetchCompanyDetails(organizationId, companyId);
    const { googleAuthorized } = companyDetails.data;
    setIsDriveAuthorized(googleAuthorized);
  };

  const onSubmitForm = async (values) => {
    const date = moment(values.date).utc(true);
    const timeStart = moment(values.startTime).utc(true);
    const timezone = _.get(values.shootingAddress, 'timezone', moment.tz.guess());

    const utcDate = moment
      .utc(date)
      .set('hours', timeStart.get('hours'))
      .set('minutes', timeStart.get('minutes'))
      .set('seconds', 0)
      .set('milliseconds', 0);
    const orderLocalStartDate = utcDate.tz(timezone, true);
    const startDate = orderLocalStartDate.isValid() ? orderLocalStartDate.valueOf() : null;

    try {
      await updateShooting(organizationId, shootingId, {
        description: values.description,
        logisticInformation: values.logisticInformation,
        deliveryEmails: values.deliveryMethodsEmails,
        driveDelivery: values.deliveryMethodsIsDriveSelected,
        driveFolderId: _.get(driveMethod, 'contact'),
        driveFolderName: _.get(driveMethod, 'alias'),
        mainContact: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          businessName: values.businessName,
        },
        place: values.shootingAddress,
        editingOption: values.editingOption,
        pricingPackage: values.pricingPackage,
      });
      if (startDate) {
        await scheduleShooting(organizationId, shootingId, {
          startDate,
        });
      }
      onUpdateShooting(shootingId);
      onUpdateOrders();
      onResponseOk();
      onClose();
    } catch (error) {
      onResponseError();
    }
  };

  useEffect(() => {
    setCompanyGoogleAuthorized(shooting.company.organization, shooting.company.id);
  }, [shooting]);

  return (
    (isBoom || isContactCenter) && (
      <UpdateUnscheduledPhotoshootForm
        shooting={shooting}
        isDriveAuthorized={isDriveAuthorized}
        isContactCenter={isContactCenter}
        customFolderInfo={driveFolderId && driveFolderName ? { id: driveFolderId, name: driveFolderName } : null}
        onSubmit={onSubmitForm}
        onClose={onClose}
        onUpdateOrders={onUpdateOrders}
      />
    )
  );
};
