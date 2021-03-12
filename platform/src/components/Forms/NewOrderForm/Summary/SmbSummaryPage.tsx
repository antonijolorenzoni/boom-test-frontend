import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { LineBreak } from 'components/common/LineBreak';
import { ImportantSpacedWrapper } from '../../styles';
import { Typography } from 'ui-boom-components';
import { join } from 'utils/array';
import { PLACE_HOLDER } from 'config/consts';
import { SummaryHeader } from './SummaryHeader';
import { SummaryContactAndAddress } from './SummaryContactAndAddress';
import { SummaryDateAndTime } from './SummaryDateAndTime';
import { SummaryNotes } from './SummaryNotes';
import { SmbSummaryPackage } from './SmbSummaryPackage';
import { MyCreditCardSection } from '../MyCreditCardSection';
import { TotalPriceSection } from '../TotalPriceSection';
import { NewOrderForSubscribersFields } from '../NewOrderFormForSubscribers';

export const SmbSummaryPage: React.FC<{ totalAmount?: number }> = ({ totalAmount }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<NewOrderForSubscribersFields>();

  useEffect(() => {
    document.getElementById('create-order-drawer')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <Typography variantName="title2" style={{ marginBottom: 30 }}>
        {t('forms.newOrder.summary.title')}
      </Typography>
      {join(
        [
          <SummaryHeader orderName={values.orderName ?? PLACE_HOLDER} />,
          <SmbSummaryPackage pricingPackage={values.pricingPackage} />,
          <SummaryContactAndAddress
            contactName={values.contactName ?? PLACE_HOLDER}
            contactPhoneNumber={values.contactPhoneNumber ?? PLACE_HOLDER}
            additionalContactPhoneNumber={values.additionalContactPhoneNumber}
            contactEmail={!!values.contactEmail ? values.contactEmail : PLACE_HOLDER}
            fullAddress={values.fullAddress?.label ?? PLACE_HOLDER}
            businessName={!!values.businessName ? values.businessName : PLACE_HOLDER}
            businessNameLabelKey={'forms.newOrder.summary.smbBusinessName'}
          />,
          <SummaryDateAndTime
            date={values.date}
            knowDateAndTime={values.knowDateAndTime}
            startTime={values.startTime}
            pricingPackage={values.pricingPackage}
            place={values.place}
          />,
          <SummaryNotes
            description={!!values.description ? values.description : PLACE_HOLDER}
            logisticInformation={!!values.logisticInformation ? values.logisticInformation : PLACE_HOLDER}
          />,
          <MyCreditCardSection />,
          <TotalPriceSection price={totalAmount} currency={values.pricingPackage?.currency.symbol} />,
        ],
        <ImportantSpacedWrapper>
          <LineBreak />
        </ImportantSpacedWrapper>
      ).map((item: React.ReactNode, index: number) => (
        <div key={`summary-item-${index}`}>{item}</div>
      ))}
    </>
  );
};
