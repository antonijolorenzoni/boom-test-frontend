import CardActionArea from '@material-ui/core/CardActionArea';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import React from 'react';
import CalendarIcon from '../../assets/header/calendar.svg';
import ClocIcon from '../../assets/icons/clock-gray.svg';

const styles = (theme) => ({
  outerContainer: {
    height: '100%',
    display: 'flex',
    borderBottom: '1px solid #F5F6F7',
  },
  eventContainer: {
    position: 'relative',
    width: '100%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  typography: {
    useNextVariants: true,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 600,
    fontSize: 15,
    color: '#3f3f3f',
  },
  dateText: {
    margin: 0,
    marginLeft: 2,
    color: '#979da1',
    fontWeight: 100,
    fontSize: 13,
  },
  body: {
    margin: 0,
    marginTop: 10,
    color: '#979da1',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 100,
  },
  icon: {
    width: 13,
    marginRight: 4,
    marginBottom: 2,
  },
  newIndicator: {
    minWidth: 10,
    minHeight: 10,
    borderRadius: 5,
    backgroundColor: '#5AC0B1',
    marginRight: 10,
  },
});

const NotificationRow = ({ classes, containerstyle, onClick, outerContainerstyle, notification }) => (
  <div
    style={{ cursor: 'pointer', maxHeight: '10%', backgroundColor: 'transparent', ...outerContainerstyle }}
    className={classes.outerContainer}
    onClick={() => onClick()}
  >
    {notification && (
      <CardActionArea className={classes.eventContainer}>
        <div style={{ ...containerstyle }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {notification.seen === false && <div className={classes.newIndicator} />}
            <h3 className={classes.title}>{notification.message}</h3>
          </div>
          {notification.event && (
            <div className={classes.titleContainer}>
              <img src={CalendarIcon} className={classes.icon} alt="clock" />
              <h5 className={classes.dateText}>{moment(notification.event.createdAt).format('LL')}</h5>
              <img src={ClocIcon} alt="clock" />
              <h5 className={classes.dateText}>{`${moment(notification.event.createdAt).format('HH:mm')}`}</h5>
            </div>
          )}
        </div>
      </CardActionArea>
    )}
  </div>
);

export default withStyles(styles)(NotificationRow);
