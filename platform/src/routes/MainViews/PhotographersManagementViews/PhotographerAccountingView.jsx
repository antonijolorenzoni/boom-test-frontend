//
// ────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   I N V O I C I N G   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as BalanceActions from '../../../redux/actions/balance.actions';
import BalanceView from '../BalanceManagementView/BalanceView';

const styles = (theme) => ({
  container: {
    paddingLeft: 20,
    height: '100vh',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class PhotographerAccountingView extends React.Component {
  async onFetchBalance() {
    const { dispatch } = this.props;
    await dispatch(BalanceActions.fetchPhotographerAccountingBalance());
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        <BalanceView onFetchBalance={() => this.onFetchBalance()} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  balance: state.balance,
});

export default connect(mapStateToProps)(withStyles(styles)(withRouter(PhotographerAccountingView)));
