import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initialize } from 'redux-form';
import UserProfileForm from '../../components/Forms/ReduxForms/Users/UserProfileForm';
import { LANGUAGE_LOCAL_MAP, USER_ROLES } from 'config/consts';
import * as UserActions from '../../redux/actions/user.actions';
import * as UtilsActions from '../../redux/actions/utils.actions';
import * as ModalsActions from '../../redux/actions/modals.actions';
import translations from '../../translations/i18next';
import { Paper } from 'components/Paper';
import Logout from 'components/Logout';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { MediaQueryBreakpoint, Typography } from 'ui-boom-components/lib';
import ProfileInfo from './ProfileInfo';
import { Icon } from 'ui-boom-components/lib';
import { ShowForRoles } from 'components/Permission/ShowFor';
import { useScreen } from 'hook/useScreen';
import Billing from './Billing';
import CreditCard from './CreditCard';
import Version from './Version';
import SubscriptionSummary from './SubscriptionSummary';
import { useSmbProfile } from 'hook/useSmbProfile';
import { useSubscriptionWithRetry } from 'hook/useSubscriptionWithRetry';
import { useOrganization } from 'hook/useOrganization';
import { usePricingPackages } from 'hook/usePricingPackage';
import { usePaymentMethod } from 'hook/usePaymentMethod';
import { Currency } from 'types/Currency';
import { BillingInfoDto } from 'types/SubscriptionResponse';
import { CreditCardData } from 'types/CreditCardData';

import { SmbProfileForm } from 'components/Forms/SmbProfileForm';
import { SmbUserData } from 'types/SmbUserData';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { SubscriptionInvitation } from './SubscriptionInvitation';
import { primary } from 'utils/colors';

const PaperWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 15px 0;
  background-color: #f5f6f7;
  min-height: 100%;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    padding: 5px 0;
    flex-direction: column;
  }
`;

const ProfilePaper = styled(Paper)<{ isSMB: boolean }>`
  height: fit-content;
  width: ${(props) => (props.isSMB ? '60%' : '40%')};

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    width: auto;
  }

  ${(props) =>
    props.isSMB &&
    css`
      @media screen and (min-width: ${MediaQueryBreakpoint.Large}px) {
        width: 45%;
      }
    `}
`;

const subscriptionPath = '/subscription';

const UserProfileView = () => {
  const { t } = useTranslation();
  const [isModifying, setIsModifying] = useState(false);
  const { isMobile } = useScreen();

  const history = useHistory();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user?.data);
  const isSMB = (userData?.authorities ?? []).includes(USER_ROLES.ROLE_SMB);

  const { smbProfile, mutate: mutateSmbProfile } = useSmbProfile(isSMB);
  const {
    subscription,
    isUnsubscribed,
    isPaymentFailed,
    mutate: mutateSubscription,
    exponentialRetry: exponentialRetrySubscription,
  } = useSubscriptionWithRetry(isSMB, smbProfile?.companyId, 5, (left, right) => left?.subscriptionStatus !== right?.subscriptionStatus);
  const { paymentMethod, mutate: mutatePaymentMethod } = usePaymentMethod(isSMB, smbProfile?.companyId);
  const { organization } = useOrganization(isSMB, smbProfile?.organization);
  const { pricingPackages } = usePricingPackages(isSMB, smbProfile?.organization);

  useEffect(() => {
    if (userData) {
      const { email, jobTitle, firstName, lastName, language } = userData;
      dispatch(initialize('UserProfileForm', { email, jobTitle, firstName, lastName, language }));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    !isModifying && mutateSubscription();
  }, [mutateSubscription, isModifying]);

  const onUpdateUserInfo = async (userProfileData: any) => {
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(UserActions.updateUserInfo(userProfileData));
      dispatch(
        ModalsActions.showModal('UPDATE_PROFILE_SUCCESS', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('profile.userModifySuccess'),
          },
        })
      );

      setIsModifying(false);

      mutateSmbProfile();
      mutateSubscription();
      mutatePaymentMethod();

      dispatch(UtilsActions.setSpinnerVisibile(false));

      const newLanguage = LANGUAGE_LOCAL_MAP[userProfileData?.language as string];
      i18next.changeLanguage(newLanguage.translation);
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('UPDATE_PROFILE_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('profile.userModifyError'),
          },
        })
      );
    }
  };

  const onUpdateProfileForm = (userProfileData: any) => {
    const { email } = userData;

    const newEmail = userProfileData.email;

    if (newEmail !== email) {
      dispatch(
        ModalsActions.showModal('CONFIRM_CHANGE_EMAIL_MODAL', {
          modalType: 'MODAL_DIALOG',
          modalProps: {
            title: translations.t('forms.warning'),
            bodyText: translations.t('profile.changeEmailWarning', { newEmail, oldEmail: email }),
            onConfirm: () => {
              onUpdateUserInfo(userProfileData);
              dispatch(ModalsActions.hideModal('CONFIRM_CHANGE_EMAIL_MODAL'));
            },
          },
        })
      );
    } else {
      onUpdateUserInfo(userProfileData);
    }
  };

  const getProfileForm = () => {
    if (isSMB && smbProfile && paymentMethod && subscription && organization) {
      const organizationName = organization.name;
      const { firstName, lastName, languageIsoCode: language, phoneNumber, email, companyId } = smbProfile;

      const userData: SmbUserData = { firstName, lastName, language, phoneNumber, email, companyId };
      const creditCardData: CreditCardData = paymentMethod;
      const billingInfo: BillingInfoDto = subscription.billingInfoDto;
      const subscriptionId = subscription.subscriptionId;

      return (
        <SmbProfileForm
          organizationName={organizationName}
          userData={userData}
          creditCardData={creditCardData}
          billingInfo={billingInfo}
          subscriptionId={subscriptionId}
          isPaymentRefused={isPaymentFailed}
          onClose={() => {
            setIsModifying(!isModifying);
            mutatePaymentMethod();
          }}
          onSubmitComplete={() => {
            mutateSmbProfile();
            mutateSubscription();
          }}
        />
      );
    }

    return <UserProfileForm onSubmit={onUpdateProfileForm} />;
  };

  return userData ? (
    <PaperWrapper>
      <ProfilePaper isSMB={isSMB}>
        {isModifying ? (
          <div style={{ padding: 25 }}>
            {getProfileForm()}
            {!isSMB && (
              <IconButton onClick={() => setIsModifying(!isModifying)} style={{ position: 'absolute', top: 4, right: 10 }}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: isMobile ? '100%' : '34%',
                }}
              >
                <Typography variantName="title2">{t('profile.title')}</Typography>
                <Logout />
              </div>
              {(!isSMB || !isUnsubscribed) && (
                <Icon
                  onClick={() => setIsModifying(!isModifying)}
                  name="edit"
                  style={{ fontSize: 14, cursor: 'pointer', color: primary, top: 0, right: 0 }}
                />
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row' }}>
              <ShowForRoles roles={[USER_ROLES.ROLE_SMB]}>
                <SubscriptionSummary
                  organizationName={organization?.name || ''}
                  currency={(pricingPackages[0]?.currency?.symbol as Currency) ?? '€'}
                  subscription={subscription}
                  onSubscribe={isUnsubscribed ? () => history.push(subscriptionPath) : undefined}
                />
              </ShowForRoles>
              {isUnsubscribed ? (
                <SubscriptionInvitation path={subscriptionPath} />
              ) : (
                <div style={{ position: 'relative', width: isMobile ? '100%' : '500px' }}>
                  <ProfileInfo {...(isSMB ? smbProfile : userData)} />
                  {paymentMethod && (
                    <CreditCard
                      {...paymentMethod}
                      onPaymentSuccess={exponentialRetrySubscription.retry}
                      isPaymentRefused={isPaymentFailed}
                    />
                  )}
                  <Billing {...subscription?.billingInfoDto} />
                </div>
              )}
            </div>
          </>
        )}
      </ProfilePaper>
      <div style={{ position: 'absolute', right: 8, bottom: 8 }}>
        <Version />
      </div>
    </PaperWrapper>
  ) : null;
};

export default UserProfileView;
