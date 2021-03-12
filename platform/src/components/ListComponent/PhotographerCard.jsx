import React from 'react';
import Card from '@material-ui/core/Card';
import PlaceIcon from '@material-ui/icons/Place';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import translations from '../../translations/i18next';
import CurrencyField from '../Forms/FormComponents/CurrencyField';
import { cutAndAppendSuffix } from '../../utils/string';
import { ShowForPermissions, useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';
import { featureFlag } from 'config/featureFlags';

const styles = {
  title: {
    margin: 0,
    fontSize: '13px',
    fontWeight: 'medium',
    color: '#3f3f3f',
  },
  subTitle: {
    color: '#BBBBBB',
    fontSize: 10,
    margin: 0,
  },
  address: {
    color: '#BBBBBB',
    fontSize: 11,
    margin: 0,
  },
  secondaryTitleGrey: {
    color: '#BBBBBB',
    fontSize: 12,
    fontWeight: 500,
    margin: 0,
  },
  secondaryTitleBlack: {
    color: '#000000',
    fontSize: 15,
    margin: 0,
  },
  outerContainer: {
    height: '100%',
    position: 'relative',
  },
  eventContainer: {},
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  descriptionText: {
    margin: 0,
    color: '#3f3f3f',
    fontSize: 15,
    marginTop: 5,
  },
  disabledText: {
    margin: 0,
    marginTop: 5,
    fontSize: 12,
    color: 'red',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  image: {
    objectFit: 'cover',
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoTypeTag: {
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textWithLeftIcon: {
    marginTop: 2,
    position: 'relative',
    left: -6,
    display: 'inline-flex',
    height: 34,
  },
  divWithLeftIcon: {
    display: 'inline-flex',
  },
  leftIcon: {
    color: '#BBBBBB',
    height: '0.7em',
  },
  circleNumber: {
    color: 'white',
    padding: 0,
    width: 30,
    height: 30,
    marginRight: 20,
    fontSize: '1.2em',
    '&:disabled': {
      color: 'white',
    },
  },
  labelNew: {
    fontSize: '0.7em',
    margin: '2px 10px',
  },
};

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#cc0033' },
    seconday: '#cc0033',
  },
  typography: {
    useNextVariants: true,
  },
});

const PhotographerCard = ({
  shooting,
  photographer,
  classes,
  containerstyle,
  statusColor,
  position,
  onClickCloseIcon,
  onChangeTravelExpenses,
  onToggle,
  circleBackgroundColor,
}) => {
  const currencySymbol = _.get(shooting, 'pricingPackage.currency.symbol', '');
  const distance = photographer.distance + photographer.unit;

  const canAssignOrder = useIsUserEnabled([Permission.ShootingAssign]);
  const isC1Enabled = featureFlag.isFeatureEnabled('c1-compliance');
  const canAssignOrderWithFF = isC1Enabled ? canAssignOrder : true;

  return (
    <MuiThemeProvider theme={theme}>
      <Card style={{ ...containerstyle }} className={classes.outerContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
            <IconButton
              style={{ border: `2px solid ${statusColor}`, background: circleBackgroundColor }}
              className={classes.circleNumber}
              onClick={() => onToggle(photographer.photographerId)}
              disabled={!canAssignOrderWithFF}
            >
              {position >= 0 ? position + 1 : ''}
            </IconButton>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex' }}>
                <h3 className={classes.title} style={{ width: '80px' }}>
                  {`ID-${`00000${photographer.photographerId}`.slice(-6)}`}
                </h3>
              </div>
              <span className={classes.subTitle}>{`${photographer.firstName} ${photographer.lastName}`.toUpperCase()}</span>
              <ShowForPermissions permissions={[Permission.PhotographerAddressRead]}>
                <div className={classes.textWithLeftIcon}>
                  <PlaceIcon className={classes.leftIcon} />
                  <span className={classes.address}>{cutAndAppendSuffix(photographer.address, 75)}</span>
                </div>
              </ShowForPermissions>
            </div>
            <div
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                display: 'flex',
                flexGrow: 1,
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}
            >
              {photographer.isNew && (
                <div style={{ border: `2px solid ${statusColor}`, borderRadius: 20, position: 'relative', top: 2 }}>
                  <h3 className={classes.labelNew} style={{ color: statusColor }}>
                    {'new'.toUpperCase()}
                  </h3>
                </div>
              )}
              <ShowForPermissions permissions={[Permission.ShootingAssign]}>
                <IconButton
                  style={{ padding: 5, right: 0, top: -2, color: '#000000' }}
                  onClick={() => onClickCloseIcon(photographer.photographerId)}
                >
                  <CloseIcon />
                </IconButton>
              </ShowForPermissions>
            </div>
          </div>
          <Divider style={{ marginTop: 5 }} />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexBasis: '45%', flexDirection: 'column', paddingTop: 10 }}>
              <span className={classes.secondaryTitleGrey}>{translations.t('photographers.travelExpenses')}</span>
              <CurrencyField
                value={photographer.estimatedTravelExpenses}
                min={0}
                step={5}
                label={currencySymbol}
                shootingStatus={shooting.state}
                onChange={onChangeTravelExpenses}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: 10, paddingBottom: 0 }}>
                  <span className={classes.secondaryTitleGrey}>{translations.t('photographers.distance')}</span>
                  <span className={classes.secondaryTitleBlack}>{distance ? distance : '-'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: 10, paddingBottom: 0 }}>
                  <span className={classes.secondaryTitleGrey}>{translations.t('photographers.rating')}</span>
                  <span className={classes.secondaryTitleBlack} style={{ display: 'flex', alignItems: 'center' }}>
                    {photographer.rating ? photographer.rating.toFixed(1) : '-'} <StarIcon style={{ width: 17, height: 17 }} />
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: 10, paddingBottom: 0 }}>
                  <span className={classes.secondaryTitleGrey}>{translations.t('photographers.revoked')}</span>
                  <span className={classes.secondaryTitleBlack}>{`${photographer.revokedPercentage} %`}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: 10, paddingBottom: 0 }}>
                  <span className={classes.secondaryTitleGrey}>{translations.t('photographers.done')}</span>
                  <span className={classes.secondaryTitleBlack}>{photographer.numShootingDone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </MuiThemeProvider>
  );
};

export default _.flow([withStyles(styles), connect()])(PhotographerCard);
