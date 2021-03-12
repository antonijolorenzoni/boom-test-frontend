import React, { useState } from 'react';
import { OutlinedButton, Button, Icon, Typography } from 'ui-boom-components';
import { DateAndTimeWrapperButtons, Wrapper, WrapperButtons } from './styles';
import { ProgressBar } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { orderSteps } from 'utils/const';
import { Order } from 'types/Order';
import { ContactPanel } from 'components/SchedulePanels/ContactPanel';
import { DateAndTimePanel } from 'components/SchedulePanels/DateAndTimePanel';
import { ReviewPanel } from 'components/SchedulePanels/ReviewPanel';

import { rescheduleShooting, scheduleShooting, updateShooting } from 'api/shootingAPI';
import { useHistory } from 'react-router-dom';
import { Path } from 'types/Path';
import { useMediaQuery } from 'react-responsive';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { OrderStatus } from 'types/OrderStatus';

const step_counter = 3;

const ScheduleWizard: React.FC<{ order: Order }> = ({ order }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [activePanel, setActivePanel] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const stepsTitle = orderSteps.map((step) => t(`confirmationPage.${step}`));

  const [updatedOrder, setUpdatedOrder] = useState<Order>(order);

  const isDesktop: boolean = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Desktop}px)` });

  const scheduleOrder = async () => {
    const startDate = moment(updatedOrder.startDate).second(0).tz(order.timezone).valueOf();
    const { company, orderId, businessName } = updatedOrder;

    try {
      setLoading(true);
      await updateShooting(order.company.organization.id, order.orderId, { mainContact: { businessName } });

      if (order.orderStatus === OrderStatus.Booked) {
        await rescheduleShooting(company.organization.id, orderId, startDate);
        history.push(`${Path.Confirmation}?rescheduled`);
      } else {
        await scheduleShooting(company.organization.id, orderId, startDate);
        history.push(Path.Confirmation);
      }
    } catch (e) {
      //TODO
    } finally {
      setLoading(false);
    }
  };

  const renderDateAndTimeButtons = (isDateAndTimeValid: boolean, selectedDate: string | null, selectedTime: string | null): JSX.Element => {
    return (
      <DateAndTimeWrapperButtons>
        <OutlinedButton
          color="#5AC0B1"
          backgroundColor="transparent"
          style={{ width: 93 }}
          disabled={activePanel === 0}
          onClick={() => setActivePanel(activePanel - 1)}
          data-testid="back-button"
        >
          <Typography variantName="title3" textColor="#5AC0B1">
            {t('general.back')}
          </Typography>
        </OutlinedButton>
        <Button
          style={{ width: 93 }}
          disabled={!isDateAndTimeValid}
          data-testid="next-button"
          onClick={() => {
            setUpdatedOrder((order) => {
              return {
                ...order,
                startDate: moment.tz(`${selectedDate}/${selectedTime}`, 'YYYY-MM-DD/HH:mm', order.timezone).format(),
              };
            });
            setActivePanel(activePanel + 1);
          }}
        >
          <Typography variantName="title3" textColor="#ffffff">
            {t('general.next')}
          </Typography>
        </Button>
      </DateAndTimeWrapperButtons>
    );
  };

  const renderNavigationButtons = (isFormValid: boolean): JSX.Element => {
    return (
      <WrapperButtons>
        <OutlinedButton
          color="#5AC0B1"
          backgroundColor="transparent"
          style={{ width: 93 }}
          disabled={activePanel === 0}
          onClick={() => setActivePanel(activePanel - 1)}
          data-testid="back-button"
        >
          <Typography variantName="title3" textColor="#5AC0B1">
            {t('general.back')}
          </Typography>
        </OutlinedButton>
        <Button type="submit" style={{ width: 93 }} disabled={!isFormValid} data-testid="next-button">
          <Typography variantName="title3" textColor="#ffffff">
            {t('general.next')}
          </Typography>
        </Button>
      </WrapperButtons>
    );
  };

  const reviewPanelButtons = (
    <WrapperButtons>
      <OutlinedButton
        color="#5AC0B1"
        backgroundColor="transparent"
        style={{ width: 93 }}
        onClick={() => setActivePanel(activePanel - 1)}
        data-testid="back-button"
      >
        <Typography variantName="title3" textColor="#5AC0B1">
          {t('general.back')}
        </Typography>
      </OutlinedButton>
      <Button onClick={scheduleOrder} data-testid="book-button" loading={loading}>
        <Typography variantName="title3" textColor="#ffffff">
          {t('form.bookYourPhotoshoot')}
        </Typography>
      </Button>
    </WrapperButtons>
  );

  const stepProps = {
    order: updatedOrder,
    setUpdatedOrder,
    onAddStep: () => activePanel < step_counter - 1 && setActivePanel(activePanel + 1),
    onClose: () => {},
  };

  const steps = [
    <DateAndTimePanel order={stepProps.order} renderDateAndTimeButtons={renderDateAndTimeButtons} />,
    <ContactPanel {...stepProps} renderNavigationButtons={renderNavigationButtons} />,
    <ReviewPanel {...stepProps} navigationButtons={reviewPanelButtons} />,
  ];

  const component = steps[activePanel];
  const isDateAndTimePanel = activePanel === 0;

  return (
    <Wrapper>
      <Icon
        name="close"
        color="#000000"
        size={25}
        style={{ position: 'absolute', right: 25, top: 25, cursor: 'pointer', zIndex: 10 }}
        onClick={() => history.push(Path.HomePage)}
      />
      <div>
        <ProgressBar
          steps={stepsTitle}
          currentIndex={activePanel}
          colorSettings={{
            activeColor: '#5ac0b1',
            inactiveColor: '#F5F6F7',
            lineColor: '#F5F6F7',
            borderColor: '#ffffff',
            labelColor: '#000000',
          }}
          style={{ marginBottom: isDateAndTimePanel ? 20 : 40, marginTop: isDesktop ? 40 : 20 }}
        />
        {component}
      </div>
    </Wrapper>
  );
};

export { ScheduleWizard };
