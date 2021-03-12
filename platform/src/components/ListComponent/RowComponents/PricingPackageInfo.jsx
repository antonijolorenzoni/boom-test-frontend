import { Chip, createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import CompanyIcon from '@material-ui/icons/Domain';
import CameraIcon from '@material-ui/icons/CameraEnhance';
import _ from 'lodash';
import React from 'react';
import translations from '../../../translations/i18next';
import cn from 'classnames';
import { getDurationInfoString } from '../../../utils/timeHelpers';

const styles = (theme) => ({
  row: {
    marginBottom: 15,
    borderTop: '3px solid #cc3300',
    padding: 20,
  },
  outerContainer: {
    width: '100%',
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
  subTitle: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 100,
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
    alignItems: 'center',
  },
  chip: {
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  photoTypeChip: {
    backgroundColor: '#cc0033',
    color: '#ffffff',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#bdbdbd' },
    seconday: '#bdbdbd',
  },
  typography: {
    useNextVariants: true,
  },
});

class PricingPackageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  async onOpenExpandable() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const {
      package: { name, photosQuantity, shootingDuration, companyPrice, photographerEarning, currency, authorizedCompanies, photoType },
      onDelete,
      classes,
      containerstyle,
      showAuthorizedCompanies,
    } = this.props;

    const currencySymbol = currency && currency.symbol ? currency.symbol : '';
    const durationInfo = getDurationInfoString(shootingDuration);

    return (
      <MuiThemeProvider theme={theme}>
        <Paper style={{ ...containerstyle }} square className={classes.row}>
          <div className={classes.innerContainer}>
            <div className={classes.cardContent}>
              <h3 className={classes.title}>{`${name} (${photosQuantity} ${translations.t('organization.photos')} - ${durationInfo})`}</h3>
              <h3 className={classes.subTitle}>{`${translations.t('forms.companyPrice')}: ${companyPrice} ${currencySymbol}`}</h3>
              <h3 className={classes.subTitle}>
                {`${translations.t('forms.photographerEarning')}: ${photographerEarning} ${currencySymbol}`}
              </h3>
              <div style={{ marginRight: 60 }}>
                {photoType && (
                  <Chip
                    className={cn(classes.chip, classes.photoTypeChip)}
                    color="primary"
                    label={translations.t(`photoTypes.${photoType.type}`)}
                    icon={<CameraIcon />}
                  />
                )}
                {showAuthorizedCompanies &&
                  _.map(authorizedCompanies, (company) => (
                    <Chip key={company.id} className={classes.chip} color="primary" label={company.name} icon={<CompanyIcon />} />
                  ))}
              </div>
            </div>
            {onDelete && (
              <IconButton style={{ margin: 5, position: 'absolute', right: 50 }} onClick={() => onDelete()}>
                <DeleteIcon style={{ color: '#3f3f3f' }} />
              </IconButton>
            )}
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(PricingPackageInfo);
