import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import React from 'react';
import translations from '../../../translations/i18next';
import { getDurationInfoString } from '../../../utils/timeHelpers';

const styles = (theme) => ({
  row: {
    height: '100%',
    marginBottom: 15,
    borderTop: '3px solid #75bdb1',
    padding: 20,
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
    fontSize: 20,
    color: '#3f3f3f',
  },
  subtitle: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 100,
    fontSize: 18,
    color: '#3f3f3f',
  },
  cardContent: {
    alignItems: 'center',
  },
});

class PricingPackageRow extends React.Component {
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
      package: {
        name,
        photosQuantity,
        shootingDuration,
        companyPrice,
        currency: { symbol },
      },
      classes,
      containerstyle,
    } = this.props;
    const durationInfo = getDurationInfoString(shootingDuration);
    return (
      <Card style={{ ...containerstyle }} className={classes.row}>
        <div className={classes.innerContainer}>
          <div className={classes.cardContent}>
            <h2 className={classes.title}>{name}</h2>
            <h3 className={classes.subtitle}>{`${photosQuantity} ${translations.t('organization.photos')} - ${durationInfo}`}</h3>
            <h3 className={classes.subtitle}>{`${translations.t('forms.price')}: ${companyPrice} ${symbol}`}</h3>
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(PricingPackageRow);
