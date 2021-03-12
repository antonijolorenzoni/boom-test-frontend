import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Close from '@material-ui/icons/Close';
// import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import translations from '../../translations/i18next';
import RefundItemForm from '../Forms/ReduxForms/Invoice/RefundItemForm';

const styles = (theme) => ({
  row: {
    height: '100%',
    marginTop: 15,
    borderTop: '3px solid #75bdb1',
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

class RefundItemRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  onStartEditItem() {
    const { dispatch, amount } = this.props;
    dispatch(initialize('RefundItemForm', { amount }));
    this.onSetEditingItem(true);
  }

  onSetEditingItem(isEditing) {
    this.setState({ isEditing });
  }

  onConfirmEditItem(amount) {
    const { onEditRefund } = this.props;
    if (onEditRefund) onEditRefund(amount);
    this.onSetEditingItem(false);
  }

  render() {
    const { amount, currency, classes, containerstyle } = this.props;
    const currencySymbol = currency && currency.symbol ? currency.symbol : '';
    const { isEditing } = this.state;
    return (
      <div>
        {!amount || isEditing ? (
          <div>
            <h4 className={classes.subtitle} style={{ marginLeft: 20 }}>
              {translations.t('forms.photographerInitialRefundDeacription')}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <RefundItemForm currency={currencySymbol} onSubmit={(itemData) => this.onConfirmEditItem(itemData.amount)} />
              {isEditing && (
                <IconButton style={{ margin: 5 }} onClick={() => this.onSetEditingItem(false)}>
                  <Close style={{ color: '#3f3f3f' }} />
                </IconButton>
              )}
            </div>
          </div>
        ) : (
          <Paper style={{ ...containerstyle }} className={classes.row}>
            <div className={classes.innerContainer}>
              <div className={classes.cardContent}>
                <h2 className={classes.title}>{translations.t('invoiceTypes.SHOOTING_TRAVEL_EXPENSES')}</h2>
                <h3 className={classes.subtitle}>{`${translations.t('forms.invoiceItemValue')}: ${amount} ${currencySymbol}`}</h3>
              </div>
            </div>
            <div>
              <IconButton style={{ margin: 5 }} onClick={() => this.onStartEditItem()}>
                <EditIcon style={{ color: '#3f3f3f' }} />
              </IconButton>
              {/* {onDelete && (
                <IconButton style={{ margin: 5 }} onClick={() => onDelete()}>
                  <DeleteIcon style={{ color: '#3f3f3f' }} />
                </IconButton>
              )} */}
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

export default connect()(withStyles(styles)(RefundItemRow));
