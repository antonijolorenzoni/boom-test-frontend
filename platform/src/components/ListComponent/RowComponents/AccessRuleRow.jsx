import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CompanyIcon from '@material-ui/icons/Domain';
import InfoIcon from '@material-ui/icons/Info';
import UserRoleIcon from '@material-ui/icons/VerifiedUser';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ACCESS_RULES_TYPES } from '../../../config/consts';
import { elaborateRolePermissionsString } from '../../../config/utils';
import translations from '../../../translations/i18next';
import * as ModalsActions from '../../../redux/actions/modals.actions';

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

class AccessRuleRow extends React.Component {
  openRoleExplanationModal(roleSelected, companyName) {
    const { dispatch, classes } = this.props;
    dispatch(
      ModalsActions.showModal('ROLE_MODAL', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          title: translations.t('permissions.permissionModalTitle'),
          content: (
            <div style={{ marginLeft: 20, marginRight: 70 }}>
              <h2 style={{ margin: 0, marginTop: 50 }}>{companyName}</h2>
              <h3 className={classes.permissionDescription} style={{ margin: 0, marginBottom: 5 }}>
                {`${translations.t('permissions.permissionOfRole')} ${translations.t(`roles.${roleSelected.name}`)}`}
              </h3>
              <Divider style={{ marginBottom: 10 }} />
              <h4 style={{ fontWeight: 100 }}>{translations.t(`rolesDescriptions.${roleSelected.name}`)}</h4>
              {elaborateRolePermissionsString(roleSelected.permission)}
            </div>
          ),
          cancelText: translations.t('forms.close'),
        },
      })
    );
  }

  render() {
    const {
      accessRule: { role, company, type },
      roleDetails,
      onDelete,
      classes,
      containerstyle,
    } = this.props;
    const isDefault = type === ACCESS_RULES_TYPES.DEFAULT;
    return (
      <Paper square style={{ ...containerstyle }} className={classes.outerContainer}>
        <div>
          <div style={{ padding: 10 }}>
            <div className={classes.headerInfoContainer}>
              <div>
                <h3 className={classes.title}>{translations.t('forms.userAccessRule')}</h3>
                <h3 className={classes.subTitle} style={{ marginBottom: 5, fontSize: 15 }}>
                  {translations.t(`accessRulesTypes.${ACCESS_RULES_TYPES[type]}`)}
                </h3>
              </div>
              <div>
                {roleDetails && !_.isEmpty(roleDetails) && (
                  <IconButton style={{ margin: 5 }} onClick={() => this.openRoleExplanationModal(roleDetails, company.name)}>
                    <InfoIcon style={{ color: '#3f3f3f' }} />
                  </IconButton>
                )}
                {!isDefault && (
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
            <Divider />
          </div>
        </div>
        <div className={classes.eventContainer}>
          <div>
            <div className={classes.detailContainer}>
              <UserRoleIcon className={classes.icon} />
              <h3 className={classes.subTitle}>{translations.t(`roles.${role && role.name}`)}</h3>
            </div>
            <div className={classes.detailContainer} style={{ marginTop: 15 }}>
              <CompanyIcon className={classes.icon} />
              <h3 className={classes.subTitle}>{company && company.name}</h3>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

export default connect()(withStyles(styles)(withRouter(AccessRuleRow)));
