//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: C O M P A N Y   D E T A I L S   A N D   E D I T   D A T A   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initialize } from 'redux-form';
import { Typography, Icon } from 'ui-boom-components';
import { CreditCardInfo } from 'components/CreditCardInfo';
import Billing from 'routes/ProfilesViews/Billing';
import { OrganizationTier, PERMISSIONS, PERMISSION_ENTITIES } from 'config/consts';
import * as CompaniesActions from 'redux/actions/companies.actions';
import * as OrganizationsActions from 'redux/actions/organizations.actions';
import * as UtilsActions from 'redux/actions/utils.actions';
import * as ModalsActions from 'redux/actions/modals.actions';
import { useTranslation } from 'react-i18next';
import AbilityProvider from 'utils/AbilityProvider';
import { getDriveAuthorizationUrl, revokeAuth } from 'api/googleAuthAPI';
import { deleteSubscription } from 'api/paymentsAPI';
import { updateContactCenter } from 'api/contactCentersAPI';
import { DriveAuthorizationPanel } from './DriveAuthorizationPanel';
import useSWR from 'swr';
import { getContactCenter } from 'api/paths/contact-center';
import { axiosBoomInstance } from 'api/instances/boomInstance';
import ContactCenterEditForm from 'components/Forms/ReduxForms/ContactCenterEditForm';
import { photoTypesWithoutOthers } from 'utils/orders';
import { SubscriptionInfoPanel } from 'routes/MainViews/CompleteSubscriptionPage/SubscriptionInfoPanel';
import { ConfirmUnsubscribeModal } from './ConfirmUnsubscribeModal';
import { SubscriptionStatus } from 'types/SubscriptionStatus';
import { useSubscription } from 'hook/useSubscription';
import { usePaymentMethod } from 'hook/usePaymentMethod';
import { usePricingPackages } from 'hook/usePricingPackage';
import { updateSubscription } from 'api/paymentsAPI';

import { LineBreak } from 'components/Forms/styles';
import { FormSectionHeader } from 'components/FormSectionHeader';

import { Details } from './Details';
import { CompanyForm } from 'components/Forms/CompanyForm';
import { CompanyFormSmb } from 'components/Forms/CompanyForm/CompanyFormSmb';
import { updateOrganization } from 'api/organizationsAPI';
import { featureFlag } from 'config/featureFlags';
import { Segment } from 'types/Segment';

export const CompanyDetailsView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { photoTypes, isBoom, selectedRootCompany, selectedOrganization } = useSelector((state) => ({
    photoTypes: state.user.photoTypes,
    isBoom: state.user.data.isBoom,
    selectedRootCompany: state.companies.selectedRootCompany,
    selectedOrganization: state.organizations.selectedOrganization,
  }));

  const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

  const isSmbCompany = isB1Enabled ? selectedOrganization.segment === Segment.SMB : selectedRootCompany?.tier === OrganizationTier.SMB;

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('backToCompanyUrl', window.location.pathname);
    return () => localStorage.removeItem('backToCompanyUrl');
  }, []);

  const { data: contactCenterDetailResponse, mutate } = useSWR(
    selectedRootCompany.contactCenter ? getContactCenter(selectedRootCompany.id) : null,
    axiosBoomInstance.get
  );

  const contactCenterDetails = _.get(contactCenterDetailResponse, 'data');

  const { pricingPackages } = usePricingPackages(isSmbCompany, selectedRootCompany.organization);
  const currency = pricingPackages[0]?.currency?.symbol ?? '€';

  const { paymentMethod } = usePaymentMethod(isSmbCompany, selectedRootCompany.id);

  const { subscription: subscriptionResponse, mutate: mutateSubscription } = useSubscription(isSmbCompany, selectedRootCompany.id);
  const subscriptionStatus = subscriptionResponse?.subscriptionStatus;
  const subscriptionEndDate = subscriptionResponse?.currentPeriodEnd;

  useEffect(() => {
    if (!selectedRootCompany.contactCenter) {
      dispatch(CompaniesActions.initializeModifyForm());
    } else {
      dispatch(initialize('ContactCenter', { ...contactCenterDetails }));
    }
  }, [dispatch, contactCenterDetails, selectedRootCompany.contactCenter]);

  const saveContactCenterDetails = async (contactCenter) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await updateContactCenter(contactCenter);
      await mutate();
      dispatch(OrganizationsActions.updateSelectedOrganization({ name: contactCenter.name }));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('CONTACT_CENTER_UPDATE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('company.updateContactCenterError'),
          },
        })
      );
    }
  };

  const onCompanyFormSubmit = async (companyData) => {
    if (companyData && !companyData.isNew) {
      await onModifyCompanyDetails(companyData);
    } else {
      await onCreateCompanyDetails(companyData);
    }
    setEditMode(false);

    dispatch(CompaniesActions.initializeModifyForm());
  };

  const onUpdateOrganization = async (deliverToMainContact) => {
    if (selectedOrganization.deliverToMainContact !== deliverToMainContact) {
      const organizationUpdated = await updateOrganization(selectedOrganization.id, {
        ...selectedOrganization,
        deliverToMainContact: deliverToMainContact,
      });
      dispatch(OrganizationsActions.updateSelectedOrganization(organizationUpdated.data));
    }
  };

  const onModifyBillingInfo = async (billingInfo) => {
    await updateSubscription(selectedRootCompany.id, subscriptionResponse.subscriptionId, { billingInfo: billingInfo });
    mutateSubscription();
  };

  const onToggleModify = async () => {
    setEditMode(!editMode);
  };

  const onModifyCompanyDetails = async (companyData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(CompaniesActions.updateCompany(companyData));
      await dispatch(CompaniesActions.updateCompanyDetails(companyData));
      if (companyData.logo && _.isArray(companyData.logo)) {
        await dispatch(CompaniesActions.deleteAndUpdateCompanyLogo(companyData.id, _.first(companyData.logo)));
      }
      dispatch(CompaniesActions.setSelectedRootCompany(companyData));
      dispatch(CompaniesActions.replaceNavigationLevel(companyData));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('COMPANY_MODIFY_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('company.modifyCompanyError'),
          },
        })
      );
    }
  };

  const onCreateCompanyDetails = async (companyData) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(CompaniesActions.updateCompany(companyData));
      await dispatch(CompaniesActions.createCompanyDetails(companyData, companyData.id));
      if (companyData.logo && _.isArray(companyData.logo)) {
        await dispatch(CompaniesActions.createCompanyLogo(companyData.id, _.first(companyData.logo)));
      }
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('COMPANY_MODIFY_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('company.modifyCompanyError'),
          },
        })
      );
    }
  };

  const showRevokeAuthConfirmDialog = (organizationId, companyId) =>
    dispatch(
      ModalsActions.showModal('CONFIRM_REVOKE_AUTH', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          content: (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 320 }}>
              <Typography variantName="body1" style={{ textAlign: 'center' }}>
                {t('company.revokeGoogleAuth')}
              </Typography>
              <Icon name="report_problem" color="#A3ABB1" style={{ marginTop: 7 }} />
              <Typography variantName="body2" style={{ textAlign: 'center' }}>
                {t('company.revokeGoogleAuthInfo')}
              </Typography>
            </div>
          ),
          onConfirm: async () => {
            try {
              await revokeAuth(organizationId, companyId);
              dispatch(CompaniesActions.updateSelectedRootCompany({ googleAuthorized: false }));
              dispatch(ModalsActions.hideModal('CONFIRM_REVOKE_AUTH'));
            } catch (error) {
              dispatch(ModalsActions.hideModal('CONFIRM_REVOKE_AUTH'));
              dispatch(
                ModalsActions.showModal('REVOKE_AUTH_ERROR', {
                  modalType: 'ERROR_ALERT',
                  modalProps: {
                    message: t('company.revokeGoogleAuthError'),
                  },
                })
              );
            }
          },
          confirmText: t('modals.confirm'),
        },
      })
    );

  const onUnsubscribe = () =>
    dispatch(
      ModalsActions.showModal('CONFIRM_UNSUBSCRIBE', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          hideCancel: true,
          content: (
            <ConfirmUnsubscribeModal
              onConfirm={onConfirmUnsubscribe}
              onCancel={() => dispatch(ModalsActions.hideModal('CONFIRM_UNSUBSCRIBE'))}
            />
          ),
        },
      })
    );

  const onConfirmUnsubscribe = async () => {
    try {
      await deleteSubscription(selectedRootCompany.id, subscriptionResponse?.subscriptionId);
      mutateSubscription();
      dispatch(ModalsActions.hideModal('CONFIRM_UNSUBSCRIBE'));
      dispatch(
        ModalsActions.showModal('CONFIRM_UNSUBSCRIBE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: t('smb.successOnUnsubscribe'),
          },
        })
      );
    } catch (error) {
      dispatch(ModalsActions.hideModal('CONFIRM_UNSUBSCRIBE'));
      dispatch(
        ModalsActions.showModal('CONFIRM_UNSUBSCRIBE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: t('smb.errorOnUnsubscribe'),
          },
        })
      );
    }
  };

  const canEdit = selectedRootCompany.contactCenter
    ? isBoom
    : AbilityProvider.getCompanyAbilityHelper().hasPermission([PERMISSIONS.UPDATE], PERMISSION_ENTITIES.COMPANY);

  const getEditForm = () => {
    if (selectedRootCompany.contactCenter) {
      return <ContactCenterEditForm name={contactCenterDetails.name} onSubmit={saveContactCenterDetails} />;
    }
    if (isSmbCompany) {
      return (
        <CompanyFormSmb
          company={selectedRootCompany}
          photoTypesList={photoTypesWithoutOthers(photoTypes)}
          onSubmit={(companyData, billingInfo) => {
            onCompanyFormSubmit(companyData);
            onModifyBillingInfo(billingInfo);
          }}
          onCancel={() => setEditMode(false)}
        />
      );
    }
    return (
      <CompanyForm
        company={selectedRootCompany}
        deliverToMainContact={selectedOrganization.deliverToMainContact}
        subCompany={selectedRootCompany.parentCompany !== 1}
        photoTypesList={photoTypesWithoutOthers(photoTypes)}
        onSubmit={(companyData, deliverToMainContact) => {
          onCompanyFormSubmit(companyData);
          onUpdateOrganization(deliverToMainContact);
        }}
        onCancel={() => setEditMode(false)}
      />
    );
  };

  const isGoogleAuthorized = selectedRootCompany.googleAuthorized;

  return (
    <div style={{ position: 'relative', padding: 20 }}>
      {editMode ? (
        getEditForm()
      ) : (
        <>
          {(contactCenterDetails || selectedRootCompany) && (
            <>
              <div style={{ width: '40%' }}>
                <Details
                  company={contactCenterDetails || selectedRootCompany}
                  deliverToMainContact={selectedOrganization.deliverToMainContact}
                />
                <Billing {...subscriptionResponse?.billingInfoDto} />
              </div>
              {canEdit && (
                <IconButton onClick={onToggleModify} style={{ position: 'absolute', top: editMode ? 0 : 20, right: 10 }}>
                  {!editMode ? <EditIcon /> : <CloseIcon />}
                </IconButton>
              )}
              {!selectedRootCompany.contactCenter && !isSmbCompany && (
                <>
                  <hr style={{ margin: '20px 0' }} />
                  <DriveAuthorizationPanel
                    isBoom={isBoom}
                    isGoogleAuthorized={isGoogleAuthorized}
                    onAuth={async () => {
                      const result = await getDriveAuthorizationUrl(selectedRootCompany.organization, selectedRootCompany.id);
                      const redirectUrl = result.data;
                      window.location = redirectUrl;
                    }}
                    onRevoke={() => showRevokeAuthConfirmDialog(selectedRootCompany.organization, selectedRootCompany.id)}
                  />
                </>
              )}
              {isSmbCompany && subscriptionResponse && (
                <>
                  <LineBreak style={{ marginTop: 12, marginBottom: 16 }} />
                  {paymentMethod && subscriptionStatus !== SubscriptionStatus.PAYMENT_FAILED && (
                    <>
                      <div style={{ marginBottom: 4 }}>
                        <FormSectionHeader iconName="credit_card" label={t('smb.creditCard')} />
                      </div>
                      <CreditCardInfo {...paymentMethod} />
                    </>
                  )}
                  {subscriptionStatus === SubscriptionStatus.PAYMENT_FAILED && (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <FormSectionHeader iconName="credit_card" label={t('smb.creditCard')} />
                      </div>
                      <div style={{ opacity: '50%' }}>
                        <CreditCardInfo {...paymentMethod} />
                      </div>
                      <Typography variantName="caption" textColor="#D84315">
                        {t('smb.creditCardRefused')}
                      </Typography>
                    </>
                  )}
                  <div style={{ width: '75%' }}>
                    <div style={{ marginTop: 28, marginBottom: 12 }}>
                      <FormSectionHeader iconName="view_carousel" label={t('smb.activeSubscriptions')} />
                    </div>
                    <SubscriptionInfoPanel
                      onUnsubscribe={onUnsubscribe}
                      subscriptionStatus={subscriptionStatus}
                      currency={currency}
                      subscriptionEndDate={subscriptionEndDate}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
