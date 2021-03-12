import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import translations from '../../../translations/i18next';

const styles = (theme) => ({
  outerContainer: {
    height: '100%',
    marginBottom: 25,
    borderTop: '4px solid #cc0033',
  },
  eventContainer: {
    padding: 15,
    paddingBottom: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 22,
    color: '#3f3f3f',
    marginLeft: 10,
  },
  subTitle: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 100,
    fontSize: 20,
    color: '#80888F',
    marginLeft: 10,
  },
  icon: {
    color: '#80888F',
  },
  roleTag: {
    marginRight: 10,
    marginTop: 10,
    color: 'white',
  },
  detailContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 15,
  },
  headerInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const AuthServiceRow = ({ service: { clientId, createdAt, name }, canDeleteService, classes, onDelete }) => (
  <Paper square className={classes.outerContainer}>
    <div>
      <div style={{ padding: 10 }}>
        <div className={classes.headerInfoContainer}>
          <div>
            <h3 className={classes.title}>{name}</h3>
            <h3 className={classes.subTitle} style={{ marginTop: 5, marginBottom: 5, fontSize: 15 }}>
              {`${translations.t('company.clientId')}: ${clientId}`}
            </h3>
            <h3 className={classes.subTitle} style={{ marginBottom: 5, fontSize: 15 }}>
              {`${translations.t('organization.creationDate')} ${moment(createdAt).format('LL')}`}
            </h3>
          </div>
          <div>
            {canDeleteService && (
              <IconButton
                style={{ margin: 5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <DeleteIcon style={{ color: '#3f3f3f' }} />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </div>
  </Paper>
);

export default connect()(withStyles(styles)(withRouter(AuthServiceRow)));
