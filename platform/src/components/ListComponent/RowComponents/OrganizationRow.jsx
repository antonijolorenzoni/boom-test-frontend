import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import React from 'react';
import { withRouter } from 'react-router-dom';
import translations from '../../../translations/i18next';

const styles = (theme) => ({
  outerContainer: {
    height: '100%',
    marginBottom: 10,
  },
  eventContainer: {
    padding: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typography: {
    useNextVariants: true,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 18,
    color: '#3f3f3f',
  },
  dateText: {
    margin: 0,
    color: '#979da1',
    fontSize: 15,
  },
  body: {
    margin: 0,
    marginTop: 10,
    color: '#979da1',
    textAlign: 'left',
    fontSize: 12,
  },
});

class OrganizationRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  render() {
    const {
      organization: { name, createdAt },
      onEdit,
      classes,
      containerstyle,
    } = this.props;
    return (
      <Card style={{ ...containerstyle }} className={classes.outerContainer}>
        <div className={classes.eventContainer}>
          <div>
            <h3 className={classes.title}>{name}</h3>
            <h5 className={classes.dateText}>{`${translations.t('organization.creationDate')}: ${moment(createdAt).format('LLL')}`}</h5>
          </div>
          <div>
            {/* {onDelete && (
              <IconButton onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <DeleteIcon />
              </IconButton>
            )} */}
            {onEdit && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(withRouter(OrganizationRow));
