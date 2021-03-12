//
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S H O O T I N G   R O W   F O R   P H S   A N D   C O M P A N I E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Grid, IconButton, withStyles } from '@material-ui/core';
import CloudDownload from '@material-ui/icons/CloudDownload';
import moment from 'moment';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import CalendarGrayIcon from '../../assets/icons/calendar-gray.svg';
import ClockIcon from '../../assets/icons/clock-gray.svg';
import LocationIcon from '../../assets/icons/location.svg';
import { PERMISSIONS, PERMISSION_ENTITIES, SHOOTING_STATUSES_UI_ELEMENTS } from '../../config/consts';
import { mapOrderStatus, isMobileBrowser } from '../../config/utils';
import translations from '../../translations/i18next';
import AbilityProvider from '../../utils/AbilityProvider';
import MDButton from '../MDButton/MDButton';
import * as ModalsActions from '../../redux/actions/modals.actions';
import Permission from '../Permission/Permission';
import BoomScoreDecriptionView from '../StarRatingView/BoomScoreDescriptionView';
import StarRatingView from '../StarRatingView/StarRatingView';

const styles = (theme) => ({
  container: {
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 0,
    borderRadius: 0,
    borderBottom: '1px solid #e1e1e1',
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
    fontSize: 15,
    marginBottom: 10,
  },
  dateText: {
    fontWeight: 100,
    color: '#80888d',
    margin: 0,
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
    fontSize: 12,
    margin: 0,
    textAlign: 'left',
    marginTop: 10,
  },
  codeText: {
    color: '#80888d',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'left',
    fontSize: 15,
    marginTop: 5,
  },
  textWithLeftIcon: {
    display: 'inline-flex',
    alignItems: 'center',
  },
});

class ShootingCompletedRow extends React.Component {
  onShowBoomInfo(scores) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('BOOM_EVALUATION_LEGEND', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('shootings.boomAverageScore'),
          titleStyle: { marginBottom: 0 },
          content: <BoomScoreDecriptionView scores={_.filter(scores, (score) => score.type !== 'COMPANY')} />,
          cancelText: translations.t('forms.close'),
        },
      })
    );
  }

  render() {
    const {
      classes,
      shooting,
      onSelectItem,
      style,
      onEvaluatePhotographer,
      onShowShootingDetails,
      isPhotographer,
      isBoom,
      onDownloadShootingFile,
    } = this.props;
    const { score } = shooting;
    let statusColor = shooting && shooting.state ? SHOOTING_STATUSES_UI_ELEMENTS[shooting.state].color : '#5AC0B1';
    if (!isBoom)
      statusColor =
        shooting && shooting.state
          ? SHOOTING_STATUSES_UI_ELEMENTS[mapOrderStatus(isBoom, isPhotographer, shooting.state)].color
          : '#66c0b0';
    return (
      <div className={classes.container} onClick={onSelectItem && (() => onSelectItem(shooting))} style={{ ...style }}>
        <h4 className={classes.shootingName}>{`Shooting:  ${shooting.title}`}</h4>
        <Grid container spacing={40} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Grid item xs={12} md={5}>
            <div
              style={{
                display: 'flex',
                flexDirection: isMobileBrowser() ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {shooting.place && shooting.place.formattedAddress && (
                  <div className={classes.textWithLeftIcon} style={{ marginTop: 10 }}>
                    <img src={LocationIcon} alt="address" className={classes.placeIcon} />
                    <h5 className={classes.dateText}>{shooting.place.formattedAddress}</h5>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: 10 }}>
                  <img src={CalendarGrayIcon} alt="upload" className={classes.calendarIcon} />
                  <h5 className={classes.dateText}>{moment(shooting.startDate).format('LL')}</h5>
                  <img src={ClockIcon} alt="upload" className={classes.leftIcon} />
                  <h5 className={classes.dateText}>
                    {`${moment(shooting.startDate).format('HH:mm')} - ${moment(shooting.endDate).format('HH:mm')}`}
                  </h5>
                </div>
              </div>
              <div style={{ display: 'flex', marginTop: 8, marginLeft: isMobileBrowser() ? 0 : 70 }}>
                <div>
                  <h4 className={classes.codeTitle} style={{ width: 120 }}>
                    {translations.t('shootings.shootingCode')}
                  </h4>
                  <h4 className={classes.codeText}>{shooting.code}</h4>
                </div>
                <div style={{ marginLeft: 20 }}>
                  <h4 className={classes.codeTitle}>{translations.t('shootings.shootingState')}</h4>
                  <h4 className={classes.codeText} style={{ color: statusColor, width: 100 }}>
                    {translations.t(`shootingStatuses.${mapOrderStatus(isBoom, isPhotographer, shooting.state)}`).toUpperCase()}
                  </h4>
                </div>
              </div>
            </div>
          </Grid>
          {!isPhotographer && (
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: isMobileBrowser() ? 'column' : 'row',
                }}
              >
                {!score || !score.companyScore ? (
                  <div>
                    <MDButton
                      title={translations.t('shootings.evaluatePhotographer')}
                      backgroundColor="#80858a"
                      containerstyle={{ width: '100%', marginTop: 0 }}
                      onClick={() => onEvaluatePhotographer()}
                    />
                  </div>
                ) : (
                  <StarRatingView
                    value={shooting.score.companyScore}
                    totalValues={5}
                    starStyle={{ width: 15 }}
                    starContainerStyle={{ marginTop: 0, marginRight: 0 }}
                  />
                )}
                <Permission
                  do={[PERMISSIONS.DOWNLOAD]}
                  on={PERMISSION_ENTITIES.SHOOTING}
                  abilityHelper={AbilityProvider.getOrganizationAbilityHelper()}
                >
                  <IconButton onClick={() => onDownloadShootingFile()}>
                    <CloudDownload />
                  </IconButton>
                </Permission>
                <MDButton
                  title={translations.t('shootings.showDetails')}
                  containerstyle={{ width: isMobileBrowser() ? '100%' : '20%', marginTop: isMobileBrowser() ? 20 : 0 }}
                  onClick={() => onShowShootingDetails()}
                />
              </div>
            </Grid>
          )}
          {isPhotographer && shooting && shooting.score && (
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexDirection: isMobileBrowser() ? 'column' : 'row',
                }}
              >
                <StarRatingView
                  title={translations.t('shootings.boomAverageScore')}
                  value={shooting.score.boomAverageScore}
                  totalValues={5}
                  onShowInfo={() => this.onShowBoomInfo(shooting.score.scores)}
                  starStyle={{ width: 12 }}
                  unselectedStarStyle={{ width: 8 }}
                  titleContainerStyle={{ marginBottom: 0, marginTop: -10 }}
                  titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
                />
                <StarRatingView
                  title={translations.t('shootings.companyScore')}
                  value={shooting.score.companyScore}
                  totalValues={5}
                  starStyle={{ width: 12 }}
                  unselectedStarStyle={{ width: 8 }}
                  titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
                />
                <MDButton
                  title={translations.t('shootings.showDetails')}
                  containerstyle={{ width: isMobileBrowser() ? '100%' : '20%', marginTop: isMobileBrowser() ? 20 : 0 }}
                  onClick={() => onShowShootingDetails()}
                />
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}
export default connect()(withStyles(styles)(ShootingCompletedRow));
