import React from 'react';
import { get } from 'lodash';
import { Wrapper, IdNameWrapper, InfoWrapper, InfoTitle, OthersInfoWrapper, PhoneAndMailWrapper } from './styles';
import { Icon, Typography } from 'ui-boom-components';
import { useSelector } from 'react-redux';
import { NOT_AVAILABLE } from 'config/consts';
import { ShowForPermissions, useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';
import { featureFlag } from 'config/featureFlags';

const Info: React.FC<{ title: string; value: number | string | JSX.Element }> = ({ title, value }) => (
  <InfoWrapper>
    <InfoTitle>{title}</InfoTitle>
    <Typography variantName="body2">{value}</Typography>
  </InfoWrapper>
);

const AssignedPhotographerPanel: React.FC = () => {
  const selectedShooting = useSelector((state: any) => state.shootings.selectedShooting);
  const photographer = selectedShooting.photographer;

  const { id, completedShootings, abandonedShootings, user, score } = photographer;
  const { distance, travelExpenses, pricingPackage } = selectedShooting;
  const { firstName, lastName, phoneNumber, email } = user;

  const currencySymbol = get(pricingPackage, 'currency.symbol', '');

  const name = `${firstName} ${lastName}`;
  const travelExpensesWithCurrency = travelExpenses ? `${travelExpenses} ${currencySymbol}` : NOT_AVAILABLE;
  const distanceWithMeasureUnit = distance ? `${distance} km` : NOT_AVAILABLE;
  const rating = score;

  const ratingElement = (
    <>
      {rating ? rating.toFixed(1) : '-'} <Icon name="star" size={12} />
    </>
  );

  const isC1Enabled = featureFlag.isFeatureEnabled('c1-compliance');
  const canReadPhoneAndMail = useIsUserEnabled([Permission.PhotographerPhoneRead, Permission.PhotographerMailRead], 'some');
  const canReadPhoneAndMailFF = isC1Enabled ? canReadPhoneAndMail : true;

  return (
    <Wrapper data-testid="assigned-ph-wrapper">
      <IdNameWrapper>
        <Typography variantName="title2">{`ID-${`00000${id}`.slice(-6)}`}</Typography>
        <Typography variantName="overline" style={{ textTransform: 'uppercase' }}>
          {name}
        </Typography>
      </IdNameWrapper>
      <OthersInfoWrapper>
        <div>
          <Info title="travel exp" value={travelExpensesWithCurrency} />
          <Info title="distance" value={distanceWithMeasureUnit} />
          <div style={{ minHeight: '100%', borderRight: '0.5px solid #a3abb1' }} />
          <Info title="rating" value={ratingElement} />
          <Info title="revoked" value={abandonedShootings || NOT_AVAILABLE} />
          <Info title="done" value={completedShootings || NOT_AVAILABLE} />
        </div>
        {canReadPhoneAndMailFF && (
          <PhoneAndMailWrapper>
            <ShowForPermissions permissions={[Permission.PhotographerPhoneRead]}>
              <div>
                <Icon name="call" color="#A3ABB1" size={16} style={{ marginRight: 12 }} />
                <Typography variantName="body2">{phoneNumber}</Typography>
              </div>
            </ShowForPermissions>
            <ShowForPermissions permissions={[Permission.PhotographerMailRead]}>
              <div>
                <Icon name="local_post_office" color="#A3ABB1" size={16} style={{ marginRight: 12 }} />
                <Typography variantName="body2">{email}</Typography>
              </div>
            </ShowForPermissions>
          </PhoneAndMailWrapper>
        )}
      </OthersInfoWrapper>
    </Wrapper>
  );
};

export { AssignedPhotographerPanel };
