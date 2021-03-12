import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';
import React from 'react';
import { withRouter } from 'react-router-dom';

const styles = (theme) => ({
  row: {
    height: '100%',
    marginBottom: 15,
    borderTop: '3px solid #75bdb1',
  },
  outerContainer: {
    padding: 20,
    width: '100%',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 18,
    color: '#3f3f3f',
  },
  image: {
    objectFit: 'contain',
    height: 50,
    borderRadius: 10,
    marginRight: 20,
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
  },
});

class CompanyRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  async onOpenExpandable() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const {
      company: { name, logo },
      onClick,
      classes,
      containerstyle,
    } = this.props;
    return (
      <Card style={{ ...containerstyle }} className={classes.row}>
        <CardActionArea className={classes.outerContainer} onClick={() => onClick()}>
          <div className={classes.innerContainer}>
            <div className={classes.cardContent}>
              {logo && <img alt="logo" className={classes.image} src={logo} />}
              <h3 className={classes.title}>{name}</h3>
            </div>
            <div>
              <ArrowRight />
            </div>
          </div>
        </CardActionArea>
      </Card>
    );
  }
}

export default withStyles(styles)(withRouter(CompanyRow));
