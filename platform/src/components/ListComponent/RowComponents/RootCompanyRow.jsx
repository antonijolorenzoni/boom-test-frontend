import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { withStyles } from '@material-ui/core/styles';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import React from 'react';
import CompaniesIcon from '../../../assets/header/companies.svg';

const styles = (theme) => ({
  row: {
    height: '100%',
    marginBottom: 15,
  },
  outerContainer: {
    padding: 20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 20,
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 18,
    color: '#3f3f3f',
  },
});

const RootCompanyRow = ({ rootCompany: { name }, onClick, classes, containerstyle }) => (
  <Card style={{ ...containerstyle }} className={classes.row}>
    <CardActionArea className={classes.outerContainer} onClick={() => onClick()}>
      <div className={classes.innerContainer}>
        <img alt="rootCompany" src={CompaniesIcon} className={classes.icon} />
        <h3 className={classes.title}>{name}</h3>
      </div>
      <div>
        <ArrowRight />
      </div>
    </CardActionArea>
  </Card>
);

export default withStyles(styles)(RootCompanyRow);
