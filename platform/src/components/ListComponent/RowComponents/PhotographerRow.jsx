import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Chip from '@material-ui/core/Chip';
import CameraIcon from '@material-ui/icons/CameraEnhance';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router-dom';
import translations from '../../../translations/i18next';
import StarRatingView from '../../StarRatingView/StarRatingView';

const styles = (theme) => ({
  outerContainer: {
    height: '100%',
    marginBottom: 15,
    position: 'relative',
    borderTop: '3px solid #75bdb1',
  },
  eventContainer: {
    padding: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 18,
    color: '#3f3f3f',
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
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#cc0033' },
    seconday: '#cc0033',
  },
  typography: {
    useNextVariants: true,
  },
});

const PhotographerRow = ({
  photographer: {
    user: { firstName, lastName, phoneNumber, email, enabled },
    photoTypes,
    picture,
    score,
  },
  onClick,
  showPhoneNumber,
  classes,
  containerstyle,
  showPhotoTypes,
}) => {
  const contentElement = (
    <div className={classes.body}>
      <div>
        <h3 className={classes.title}>{`${firstName} ${lastName}`}</h3>
        <h4 className={classes.descriptionText} style={{ margin: 0 }}>
          {`${email} ${showPhoneNumber && phoneNumber ? `- ${phoneNumber}` : ''}`}
        </h4>
        {!enabled && <h4 className={classes.disabledText}>{translations.t('users.disabled').toUpperCase()}</h4>}
        {score > 0 && (
          <StarRatingView
            value={score}
            totalValues={5}
            starStyle={{ width: 12 }}
            unselectedStarStyle={{ width: 8 }}
            titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
            starContainerStyle={{ marginTop: 10, marginRight: 10 }}
          />
        )}
      </div>
      {!_.isEmpty(photoTypes) && showPhotoTypes && (
        <div style={{ marginTop: 10 }}>
          {_.map(photoTypes, (photoType) => (
            <Chip
              key={photoType.id}
              className={classes.photoTypeTag}
              color="primary"
              label={translations.t(`photoTypes.${photoType.type}`)}
              icon={<CameraIcon />}
            />
          ))}
        </div>
      )}
    </div>
  );
  return (
    <div>
      {!onClick ? (
        <MuiThemeProvider theme={theme}>
          <Card style={{ ...containerstyle, opacity: enabled ? 1 : 0.6 }} className={classes.outerContainer}>
            <div className={classes.eventContainer}>{contentElement}</div>
          </Card>
        </MuiThemeProvider>
      ) : (
        <MuiThemeProvider theme={theme}>
          <Card style={{ ...containerstyle, opacity: enabled ? 1 : 0.6 }} className={classes.outerContainer}>
            <CardActionArea className={classes.eventContainer} onClick={() => onClick()}>
              {contentElement}
            </CardActionArea>
          </Card>
        </MuiThemeProvider>
      )}
    </div>
  );
};

export default withStyles(styles)(withRouter(PhotographerRow));
