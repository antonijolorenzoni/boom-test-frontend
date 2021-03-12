import React, { useEffect, useState } from 'react';
import { CompleteSubscription } from './CompleteSubscription';
import { useHistory } from 'react-router-dom';
import { useSmbProfile } from 'hook/useSmbProfile';
import { useSubscription } from 'hook/useSubscription';
import { fetchGoogleAddressDetails } from 'api/instances/googlePlacesInstance';
import { AddressDto } from 'types/AddressDto';
import { StripeAddCreditCardPanel } from 'components/AddCreditCardPanel';
import { SubscriptionPriceNoTrail } from './SubscriptionInfoPanel/SubscriptionPriceNoTrail';

export const ReactivateSubscriptionPage: React.FC<{ AddCreditCardPanelComponent?: React.FC<any> }> = ({
  AddCreditCardPanelComponent = StripeAddCreditCardPanel,
}) => {
  const history = useHistory();

  const { smbProfile, error: userInfoError } = useSmbProfile(true);

  const { subscription, isUnsubscribed } = useSubscription(true, smbProfile?.companyId);

  useEffect(() => {
    if (!subscription || !isUnsubscribed || userInfoError) {
      history.push('/');
    }
  }, [history, subscription, isUnsubscribed, userInfoError]);

  const { address } = subscription?.billingInfoDto || {};

  const [initialFullAddress, setInitialFullAddress] = useState<{ value: AddressDto; label: string }>();

  useEffect(() => {
    // to be complaint to the current fetchGoogleAddressDetails implementation we need to pass the object :|
    fetchGoogleAddressDetails({ label: address }).then((result) => {
      if (result) {
        const street = result.street ?? '';
        const streetNumber = result.street_number ?? '';
        setInitialFullAddress({ value: result, label: `${street} ${streetNumber}`.trim() });
      }
    });
  }, [address]);

  const billingInfo = {
    corporateName: subscription?.billingInfoDto?.corporateName || '',
    vatNumber: subscription?.billingInfoDto?.vatNumber || '',
    country: subscription?.billingInfoDto?.country || null,
    address: initialFullAddress,
    city: subscription?.billingInfoDto?.city || '',
    zipCode: subscription?.billingInfoDto?.zipCode || '',
    sdiCode: subscription?.billingInfoDto?.sdiCode || '',
  };

  return (
    <CompleteSubscription
      AddCreditCardPanelComponent={AddCreditCardPanelComponent}
      PriceComponent={SubscriptionPriceNoTrail}
      billingInfo={billingInfo}
    />
  );
};
