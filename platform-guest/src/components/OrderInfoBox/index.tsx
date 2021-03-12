import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import i18n from 'i18n';
import { Button, Icon, Typography } from 'ui-boom-components';
import { OrderType } from 'types/OrderType';
import { OrderStatus } from 'types/OrderStatus';
import moment from 'moment-timezone';

import { LineBreak, GridRow, DownloadButton, StatusTip, StatusTipAndDownload } from './styles';
import { getDurationString } from 'utils/time';
import { Overlay } from 'components/OrderPanel/styles';
import { Path } from 'types/Path';
import { useHistory } from 'react-router-dom';

export const OrderInfoBox: React.FC<{
  type: OrderType;
  status: OrderStatus;
  photos: number;
  duration: number;
  companyName: string;
  startDate: string;
  timezone: string;
  downloadLink: string | null;
  yetRescheduled?: boolean;
  scheduleLoading: boolean;
  onScheduleOrder: () => void;
}> = ({
  type,
  status,
  photos,
  duration,
  companyName,
  startDate,
  timezone,
  downloadLink,
  yetRescheduled,
  scheduleLoading,
  onScheduleOrder,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const durationString: string = useMemo(() => getDurationString(duration), [duration]);
  const startDateTimezoned = moment(startDate).utc().tz(timezone);

  const date: string = startDateTimezoned.format('DD/MM');
  const hour: string = startDateTimezoned.format('HH:mm');

  const dayOfWeek: number = startDateTimezoned.isoWeekday();
  const dayOfWeekShort = t(`daysOfWeek.${dayOfWeek - 1}`).substr(0, 3);

  const isFoodOrderType = type === 'FOOD';
  const isDisabled = status === OrderStatus.Canceled || status === OrderStatus.Reshoot;
  const showDownloadButton = status === OrderStatus.Completed && downloadLink !== null && false;
  const showConfirmButton = status === OrderStatus.Unscheduled;
  const showDateTip = status === OrderStatus.Booked && startDateTimezoned.isAfter(moment().tz(timezone));

  const almostStart = moment(startDate).diff(moment(), 'hour') <= 24;

  const dateTipKey = useMemo(() => {
    if (almostStart) {
      return `orderInfo.almostStart`;
    }

    return `orderInfo.${!yetRescheduled ? 'rescheduleTip' : 'cannotRescheduleTip'}`;
  }, [almostStart, yetRescheduled]);

  const actionLabelKey: string | null = useMemo(() => {
    if (status === OrderStatus.Unscheduled) {
      return 'orderInfo.chooseAnotherDate';
    }

    if (status === OrderStatus.Booked && !yetRescheduled && !almostStart) {
      if (!yetRescheduled) {
        return 'orderInfo.reschedule';
      }
      return 'orderInfo.chooseAnotherDate';
    }

    if (status === OrderStatus.Canceled || status === OrderStatus.Reshoot || (status === OrderStatus.Booked && almostStart)) {
      return 'orderInfo.needHelp';
    }

    return null;
  }, [status, yetRescheduled, almostStart]);

  const onClickAction = () => {
    if (status === OrderStatus.Unscheduled || (status === OrderStatus.Booked && !yetRescheduled)) {
      history.push(Path.Schedule);
    }

    return null;
  };

  return (
    <>
      <Typography variantName="overline" style={{ marginBottom: 4 }}>
        {t('orderInfo.shootingStatus').toUpperCase()}
      </Typography>
      <StatusTipAndDownload>
        <StatusTip showDownload={showDownloadButton}>
          <Typography variantName="title2" style={{ textTransform: 'uppercase' }}>
            {t(`orderStatus.${status}`)}
          </Typography>
          <Typography variantName="caption">
            {t(isFoodOrderType ? `orderInfo.foodTip.${status}` : `orderInfo.realEstateTip.${status}`, { companyName })}
          </Typography>
        </StatusTip>
        {showDownloadButton && (
          <DownloadButton>
            <a href={downloadLink!} download="photoshoot.zip" style={{ all: 'unset' }}>
              {t('orderInfo.download')}
            </a>
          </DownloadButton>
        )}
      </StatusTipAndDownload>
      <GridRow style={{ position: 'relative' }}>
        {isDisabled && <Overlay />}
        <div>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('orderInfo.photosNumber').toUpperCase()}
          </Typography>
          <Typography variantName="title2">{photos}</Typography>
        </div>
        <div>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('orderInfo.duration').toUpperCase()}
          </Typography>
          <Typography variantName="title2">{durationString}</Typography>
        </div>
        <div>
          <div style={{ display: 'flex' }}>
            <Typography variantName="overline" style={{ marginBottom: 4 }}>
              {t('orderInfo.guidelines').toUpperCase()}
            </Typography>
          </div>
          <a href={i18n.t(`guidelines.${type}`)} target="_blank" rel="noopener noreferrer" style={{ textDecorationColor: '#5AC0B1' }}>
            <Typography variantName="kpi1" textColor="#5AC0B1">
              {t('general.read')}
            </Typography>
          </a>
        </div>
      </GridRow>
      <LineBreak />
      <GridRow style={{ position: 'relative' }}>
        {isDisabled && <Overlay />}
        <div>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('general.date').toUpperCase()}
          </Typography>
          <div style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
            <Icon name="calendar_today" color="#A3ABB1" size={18} style={{ marginRight: 12 }} />
            <Typography variantName="title2" style={{ marginTop: 2 }}>
              {`${dayOfWeekShort} ${date}`}
            </Typography>
          </div>
        </div>
        <div>
          <Typography variantName="overline" style={{ marginBottom: 4 }}>
            {t('general.time').toUpperCase()}
          </Typography>
          <div style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
            <Icon name="access_time" color="#A3ABB1" size={18} style={{ marginRight: 12 }} />
            <Typography variantName="title2" style={{ marginTop: 2 }}>
              {hour}
            </Typography>
          </div>
        </div>
        <Button
          style={{ padding: '9px 16px', alignSelf: 'end', maxWidth: 100, visibility: showConfirmButton ? 'visible' : 'hidden' }}
          loading={scheduleLoading}
          onClick={onScheduleOrder}
        >
          {t('general.confirm').toUpperCase()}
        </Button>
        {showDateTip && (
          <div style={{ gridColumn: '1 / span 3' }}>
            <Typography variantName="caption" style={{ whiteSpace: 'break-spaces' }}>
              {t(dateTipKey)}
            </Typography>
          </div>
        )}
      </GridRow>
      {actionLabelKey && (
        <Typography
          variantName="body1"
          textColor="#5AC0B1"
          style={{ textAlign: 'right', textDecoration: 'underline', marginBottom: 13, opacity: isDisabled ? 0.5 : 1, cursor: 'pointer' }}
          onClick={onClickAction}
        >
          {t(actionLabelKey)}
        </Typography>
      )}
      <LineBreak />
    </>
  );
};
