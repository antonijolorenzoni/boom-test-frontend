//
// ──────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   B O O M   M A N A G E M E N T   R O W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { CardActionArea, Paper, withStyles } from '@material-ui/core';
import CameraIcon from '@material-ui/icons/CameraEnhanceOutlined';
import moment from 'moment';
import React from 'react';
import CompaniesIcon from '../../assets/header/companies.svg';
import CalendarGrayIcon from '../../assets/icons/calendar-gray.svg';
import ClockIcon from '../../assets/icons/clock-gray.svg';
import LocationIcon from '../../assets/icons/location.svg';
import { SHOOTING_STATUSES_UI_ELEMENTS, DELIVERY_STATUS_UI } from '../../config/consts';
import translations from '../../translations/i18next';
import StarRatingView from '../StarRatingView/StarRatingView';
import _ from 'lodash';

const styles = (theme) => ({
  actionContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
  },
  leftIcon: {
    width: '30px',
    marginTop: 2,
  },
  placeIcon: {
    width: 15,
    marginRight: 10,
  },
  calendarIcon: {
    marginRight: 10,
    width: '15px',
  },
  shootingName: {
    fontWeight: 'bold',
    color: '#80888d',
    textAlign: 'left',
    margin: 0,
    fontSize: 20,
    marginBottom: 10,
  },
  dateText: {
    fontWeight: 100,
    color: '#80888d',
    margin: 0,
    fontSize: 16,
  },
  rewardText: {
    fontWeight: 100,
    color: '#80888d',
    margin: 0,
    fontSize: 15,
  },
  codeTitle: {
    color: '#b2bac2',
    fontWeight: 100,
    fontSize: 15,
    margin: 0,
    textAlign: 'left',
    marginTop: 10,
  },
  codeText: {
    color: '#80888d',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'left',
    fontSize: 18,
    marginTop: 5,
  },
  textWithLeftIcon: {
    display: 'inline-flex',
    alignItems: 'center',
  },
});

const ShootingManagementRow = (props) => {
  const { classes, shooting, onShowShootingDetails } = props;

  const statusColor =
    shooting && shooting.state && SHOOTING_STATUSES_UI_ELEMENTS[shooting.state] && SHOOTING_STATUSES_UI_ELEMENTS[shooting.state].color
      ? SHOOTING_STATUSES_UI_ELEMENTS[shooting.state].color
      : '#66c0b0';

  const existDeliveryStatus = _.get(shooting, 'deliveryStatus');
  const deliveryStatus = existDeliveryStatus ? DELIVERY_STATUS_UI[existDeliveryStatus] : { label: 'N/A' };

  return (
    <Paper style={{ borderTop: '3px #bdbdbd solid' }}>
      <CardActionArea onClick={() => onShowShootingDetails()} className={classes.actionContainer}>
        <h4 className={classes.shootingName}>{`Shooting ${shooting.title}`}</h4>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          {shooting.company && (
            <div className={classes.textWithLeftIcon} style={{ marginTop: 10 }}>
              <img src={CompaniesIcon} alt="address" className={classes.placeIcon} style={{ marginLeft: -2, width: 20 }} />
              <h4 className={classes.dateText}>{shooting.company.name}</h4>
            </div>
          )}
          {shooting.photographer && shooting.photographer.user && (
            <div className={classes.textWithLeftIcon} style={{ marginTop: 10, width: 730 }}>
              <CameraIcon className={classes.placeIcon} style={{ width: 20, color: '#80888d', marginLeft: -2 }} />
              <h4
                className={classes.dateText}
              >{`${shooting.photographer.user.firstName} ${shooting.photographer.user.lastName} - ${shooting.photographer.user.username} `}</h4>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {shooting.place && shooting.place.formattedAddress && (
              <div className={classes.textWithLeftIcon} style={{ marginTop: 10 }}>
                <img src={LocationIcon} alt="address" className={classes.placeIcon} />
                <h4 className={classes.dateText}>{shooting.place.formattedAddress}</h4>
              </div>
            )}
            {shooting.startDate !== null && shooting.endDate !== null && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 7 }}>
                <img src={CalendarGrayIcon} alt="upload" className={classes.calendarIcon} />
                <h4 className={classes.dateText}>{moment(shooting.startDate).format('LL')}</h4>
                <img src={ClockIcon} alt="upload" className={classes.leftIcon} />
                <h4 className={classes.dateText}>
                  {`${moment(shooting.startDate).format('HH:mm')} - ${moment(shooting.endDate).format('HH:mm')}`}
                </h4>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', marginTop: 8, marginLeft: 0 }}>
            <div>
              <h4 className={classes.codeTitle} style={{ width: 230 }}>
                {translations.t('shootings.shootingCode')}
              </h4>
              <h4 className={classes.codeText}>{shooting.code}</h4>
            </div>
            <div style={{ marginLeft: 20 }}>
              <h4 className={classes.codeTitle}>{translations.t('shootings.deliveryStatus')}</h4>
              <h4 className={classes.codeText} style={{ color: deliveryStatus.color, width: 230 }}>
                {deliveryStatus.label}
              </h4>
            </div>
            <div style={{ marginLeft: 20 }}>
              <h4 className={classes.codeTitle}>{translations.t('shootings.shotingStatus')}</h4>
              <h4 className={classes.codeText} style={{ color: statusColor, width: 230 }}>
                {translations.t(`shootingStatuses.${shooting.state}`)}
              </h4>
            </div>
          </div>
        </div>
        {shooting && shooting.score && (
          <div style={{ display: 'flex', marginTop: 12, alignItems: 'center' }}>
            <StarRatingView
              title={translations.t('shootings.boomAverageScore')}
              value={shooting.score.boomAverageScore}
              totalValues={5}
              starStyle={{ width: 12 }}
              unselectedStarStyle={{ width: 8 }}
              titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
              starContainerStyle={{ marginTop: 0, marginRight: 20 }}
            />
            <StarRatingView
              title={translations.t('shootings.companyScore')}
              value={shooting.score.companyScore}
              totalValues={5}
              starStyle={{ width: 12 }}
              unselectedStarStyle={{ width: 8 }}
              titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
              starContainerStyle={{ marginTop: 0, marginRight: 0, marginLeft: 20 }}
            />
          </div>
        )}
      </CardActionArea>
    </Paper>
  );
};

export default withStyles(styles)(ShootingManagementRow);
