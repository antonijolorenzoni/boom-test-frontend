import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import translations from '../../translations/i18next';
import { UNDELETABLE_INVOICE_ITEMS_TYPES } from '../../config/consts';

const styles = (theme) => ({
  row: {
    height: '100%',
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    borderTop: '3px solid',
    padding: 10,
    paddingLeft: 20,
    display: 'flex',
    justifyContent: 'space-between',
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
  subtitle: {
    margin: 0,
    textAlign: 'left',
    fontWeight: 100,
    fontSize: 15,
    color: '#3f3f3f',
  },
  cardContent: {
    alignItems: 'center',
  },
});

class InvoiceItemRow extends React.Component {
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
      item: { amount, description, type, currency },
      onDelete,
      classes,
      containerstyle,
    } = this.props;
    const currencySymbol = currency && currency.symbol ? currency.symbol : '';
    const canBeDeleted = !(type in UNDELETABLE_INVOICE_ITEMS_TYPES);
    return (
      <div>
        <Paper style={{ ...containerstyle }} className={classes.row}>
          <div className={classes.innerContainer}>
            <div className={classes.cardContent}>
              <h2 className={classes.title}>{`${translations.t(`invoiceTypes.${type}`)}`}</h2>
              <h3 className={classes.subtitle}>{`${description}`}</h3>
              <h3 className={classes.subtitle}>{`${translations.t('forms.invoiceItemValue')}: ${amount} ${currencySymbol}`}</h3>
            </div>
          </div>
          {onDelete && canBeDeleted && (
            <IconButton style={{ margin: 5 }} onClick={() => onDelete()}>
              <DeleteIcon style={{ color: '#3f3f3f' }} />
            </IconButton>
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceItemRow);
