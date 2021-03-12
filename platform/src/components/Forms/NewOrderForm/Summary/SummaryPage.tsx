import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ImportantSpacedWrapper } from '../../styles';
import { Typography } from 'ui-boom-components';
import { join } from 'utils/array';
import { PLACE_HOLDER } from 'config/consts';
import { NewOrderFields } from '..';
import { SummaryHeader } from './SummaryHeader';
import { SummaryCompanyAndPackage } from './SummaryCompanyAndPackage';
import { SummaryContactAndAddress } from './SummaryContactAndAddress';
import { SummaryDateAndTime } from './SummaryDateAndTime';
import { SummaryRefund } from './SummaryRefund';
import { SummaryDelivery } from './SummaryDelivery';
import { SummaryNotes } from './SummaryNotes';
import { SummaryEditing } from './SummaryEditing';
import { LineBreak } from 'components/common/LineBreak';

interface Props {
  isBoom: boolean;
  isEditingEnable: boolean;
}

export const SummaryPage: React.FC<Props> = ({ isBoom, isEditingEnable }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<NewOrderFields>();

  useEffect(() => {
    document.getElementById('create-order-drawer')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <Typography variantName="title2">{t('forms.newOrder.summary.title')}</Typography>
      {join(
        [
          <SummaryHeader orderName={values.orderName ?? PLACE_HOLDER} />,
          <SummaryCompanyAndPackage
            organization={values.organization?.label ?? PLACE_HOLDER}
            company={values.company?.label ?? PLACE_HOLDER}
            pricingPackage={values.pricingPackage}
          />,
          <SummaryContactAndAddress
            contactName={values.contactName ?? PLACE_HOLDER}
            contactPhoneNumber={values.contactPhoneNumber ?? PLACE_HOLDER}
            additionalContactPhoneNumber={values.additionalContactPhoneNumber}
            contactEmail={!!values.contactEmail ? values.contactEmail : PLACE_HOLDER}
            fullAddress={values.fullAddress?.label ?? PLACE_HOLDER}
            businessName={!!values.businessName ? values.businessName : PLACE_HOLDER}
          />,
          <SummaryDateAndTime
            date={values.date}
            knowDateAndTime={values.knowDateAndTime}
            startTime={values.startTime}
            pricingPackage={values.pricingPackage}
            place={values.place}
          />,
          ...(isBoom
            ? [<SummaryRefund currency={values.pricingPackage?.currency?.symbol ?? ''} orderRefund={values.orderRefund || 0} />]
            : []),
          <SummaryDelivery
            deliveryMethodsEmails={values?.deliveryMethodsEmails?.length ? values.deliveryMethodsEmails.join(', ') : PLACE_HOLDER}
            deliveryMethodsIsDriveSelected={values.deliveryMethodsIsDriveSelected}
            driveFolderName={values.driveFolderName}
            company={
              values.company && values.organization ? { id: values.company?.value, organization: values.organization?.value } : undefined
            }
          />,
          <SummaryNotes
            description={!!values.description ? values.description : PLACE_HOLDER}
            logisticInformation={!!values.logisticInformation ? values.logisticInformation : PLACE_HOLDER}
          />,
          ...(isBoom && isEditingEnable ? [<SummaryEditing editingOption={values.editingOption ?? PLACE_HOLDER} />] : []),
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
