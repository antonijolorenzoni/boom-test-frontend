import React, { useEffect } from 'react';
import { useSmbProfile } from 'hook/useSmbProfile';
import { useSubscription } from 'hook/useSubscription';
import { useHistory } from 'react-router-dom';
import { CompleteSubscription } from './CompleteSubscription';
import { StripeAddCreditCardPanel } from 'components/AddCreditCardPanel';

export const CompleteSubscriptionPage: React.FC<{ AddCreditCardPanelComponent?: React.FC<any> }> = ({
  AddCreditCardPanelComponent = StripeAddCreditCardPanel,
}) => {
  const history = useHistory();

  const { smbProfile, error: userInfoError } = useSmbProfile(true);

  const { subscription } = useSubscription(true, smbProfile?.companyId);

  useEffect(() => {
    if (subscription || userInfoError) {
      history.push('/');
    }
  }, [history, subscription, userInfoError]);

  const billingInfo = {
    corporateName: '',
    vatNumber: '',
    country: null,
    address: null,
    city: '',
    zipCode: '',
    sdiCode: '',
  };

  return <CompleteSubscription AddCreditCardPanelComponent={AddCreditCardPanelComponent} billingInfo={billingInfo} showLogout />;
};
