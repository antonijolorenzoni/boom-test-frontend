//
// ────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P H O T O G R A P H E R   D E T A I L S   V I E W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────
//

import { Paper, Tab, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import UsersIcon from '@material-ui/icons/AssignmentInd';
import FaceIcon from '@material-ui/icons/Face';
import AccountingIcon from '@material-ui/icons/CardTravel';
import React from 'react';
import { connect } from 'react-redux';
import PhotographerForm from '../../../components/Forms/ReduxForms/Photographers/PhotographerForm';
import translations from '../../../translations/i18next';
import BalanceView from '../BalanceManagementView/BalanceView';
import * as BalanceActions from '../../../redux/actions/balance.actions';
import AbilityProvider from '../../../utils/AbilityProvider';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import PhotographerPublicDataView from './PhotographerPublicDataView';

const styles = (theme) => ({
  formContainer: {
    margin: 20,
    marginTop: 40,
    paddingTop: 20,
  },
  innerContainer: {
    padding: 20,
    marginTop: 7,
  },
  title: {
    marginTop: 0,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#5AC0B1' },
    secondary: { main: '#CC0033' },
  },
});

class PhotographerDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: 0,
    };
  }

  onTabChange(value) {
    this.setState({ activeTabIndex: value });
  }

  async onFetchBalance() {
    const { dispatch } = this.props;
    await dispatch(BalanceActions.fetchPhotographerBalance());
  }

  render() {
    const {
      classes,
      photographer,
      onPhotographerFormSubmit,
      onDeletePhotographer,
      photoTypes,
      canDelete,
      canEdit,
      onResendConfirmationEmail,
    } = this.props;
    const { activeTabIndex } = this.state;
    const canReadInvoicesItems = AbilityProvider.getOrganizationAbilityHelper().hasPermission(
      [PERMISSIONS.BALANCE],
      PERMISSION_ENTITIES.PHOTOGRAPHER
    );
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.formContainer}>
          <AppBar position="static" color="default" style={{ backgroundColor: 'white' }}>
            <Tabs
              value={activeTabIndex}
              onChange={(event, index) => this.onTabChange(index)}
              scrollable
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={translations.t('forms.photographerData')} icon={<UsersIcon />} />
              {photographer && photographer.user && photographer.user.enabled && (
                <Tab label={translations.t('forms.photographerPublicData')} icon={<FaceIcon />} />
              )}
              {photographer && photographer.user && photographer.user.enabled && canReadInvoicesItems && (
                <Tab label={translations.t('profile.accounting')} icon={<AccountingIcon />} />
              )}
            </Tabs>
          </AppBar>
          <Paper square className={classes.innerContainer}>
            {activeTabIndex === 0 && (
              <PhotographerForm
                photographer={photographer}
                photoTypes={photoTypes}
                canDelete={canDelete}
                canEdit={canEdit}
                onSubmit={(photographerData) => onPhotographerFormSubmit(photographerData)}
                onDeletePhotographer={() => onDeletePhotographer()}
                onResendConfirmationEmail={() => onResendConfirmationEmail()}
              />
            )}
            {activeTabIndex === 1 && <PhotographerPublicDataView photographer={photographer} photoTypes={photoTypes} />}
            {activeTabIndex === 2 && <BalanceView onFetchBalance={() => this.onFetchBalance()} />}
          </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  form: state.form.UserForm,
  users: state.users,
});

export default connect(mapStateToProps)(withStyles(styles)(PhotographerDetailsView));
