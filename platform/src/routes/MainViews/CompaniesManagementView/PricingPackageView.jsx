//
// ──────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: P R I C I N G   P A C K A G E   V I E W : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────
//

import { withStyles } from '@material-ui/core';
import PricingPackagesIcon from '@material-ui/icons/PhotoFilter';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import PricingPackageForm from '../../../components/Forms/ReduxForms/Organizations/PricingPackageForm';
import PricingPackageInfo from '../../../components/ListComponent/RowComponents/PricingPackageInfo';
import Spinner from '../../../components/Spinner/Spinner';
import * as CompaniesActions from '../../../redux/actions/companies.actions';
import * as OrganizationsActions from '../../../redux/actions/organizations.actions';
import * as UtilsActions from '../../../redux/actions/utils.actions';
import * as ModalsActions from '../../../redux/actions/modals.actions';
import translations from '../../../translations/i18next';
import MDButton from '../../../components/MDButton/MDButton';
import Permission from '../../../components/Permission/Permission';
import { PERMISSIONS, PERMISSION_ENTITIES } from '../../../config/consts';
import AbilityProvider from '../../../utils/AbilityProvider';
import PricingPackageRow from '../../../components/ListComponent/RowComponents/PricingPackageRow';
import { getErrorMessageOnDeletePackagePriceInUse } from '../../../config/utils';

const styles = (theme) => ({
  container: {
    padding: 20,
  },
  noUserContainer: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  noUserText: {
    margin: 0,
    color: '#7F888F',
  },
  noUserIcon: {
    fontSize: 40,
    color: '#7F888F',
    marginRight: 20,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
    paddingTop: 25,
    marginTop: 7,
  },
});
class PricingPackageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async componentWillMount() {
    this.onFetchPricingPackages();
  }

  async onFetchPricingPackages() {
    const {
      dispatch,
      companies: { selectedRootCompany },
    } = this.props;
    try {
      this.setState({ isLoading: true });
      dispatch(OrganizationsActions.resetPricingPackagesData());
      dispatch(CompaniesActions.resetCompanyPricingPackages());
      await dispatch(CompaniesActions.fetchCompanyPricingPackages(selectedRootCompany.id));
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  async onAppendPackages(page) {
    const { dispatch } = this.props;
    try {
      this.setState({ isLoading: true });
      await dispatch(OrganizationsActions.appendPricingPackages(page));
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  onPackageFormSubmit(packageData) {
    if (packageData && packageData.id) {
      this.onEditPricingPackageRequest(packageData);
    } else {
      this.onCreateNewPackage(packageData);
    }
  }

  onNewPricingPackageClick() {
    const {
      dispatch,
      currencies: { content: currenciesData },
    } = this.props;
    dispatch(
      ModalsActions.showModal('PRICING_PACKAGE_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: <PricingPackageForm currencies={currenciesData} onSubmit={(packageData) => this.onPackageFormSubmit(packageData)} />,
        },
      })
    );
  }

  async onEditPricingPackageClick(pricingPackage) {
    const { dispatch } = this.props;
    let packageSelected = pricingPackage;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      packageSelected = await dispatch(OrganizationsActions.fetchPricingPackageDetails(pricingPackage.id));
      dispatch(UtilsActions.setSpinnerVisibile(false));
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
    }
    dispatch(initialize('PricingPackageForm', packageSelected));
    dispatch(
      ModalsActions.showModal('PRICING_PACKAGE_FORM', {
        modalType: 'OPERATIONAL_VIEW',
        modalProps: {
          content: <PricingPackageForm onSubmit={(packageData) => this.onPackageFormSubmit(packageData)} />,
        },
      })
    );
  }

  async onCreateNewPackage(packageData) {
    const { dispatch } = this.props;
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(OrganizationsActions.createPricingPackage(packageData));
      dispatch(ModalsActions.hideModal('PRICING_PACKAGE_FORM'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('organization.packageCreationSuccess'),
          },
        })
      );
      this.onFetchPricingPackages();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('organization.packageCreationError'),
          },
        })
      );
    }
  }

  async onEditPricingPackageRequest(packageData) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('MODIFY_PACKAGE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('shootings.modifyPackageConfirm'),
          onConfirm: () => this.onEditPricingPackage(packageData),
        },
      })
    );
  }

  async onEditPricingPackage(packageData) {
    const { dispatch } = this.props;
    dispatch(ModalsActions.hideModal('MODIFY_PACKAGE_MODAL'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(OrganizationsActions.editPricingPackage(packageData));
      dispatch(ModalsActions.hideModal('PRICING_PACKAGE_FORM'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('organization.packageEditSuccess'),
          },
        })
      );
      this.onFetchPricingPackages();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: translations.t('organization.packageEditError'),
          },
        })
      );
    }
  }

  async onDeletePricingPackageRequest(pricingPackage) {
    const { dispatch } = this.props;
    dispatch(
      ModalsActions.showModal('DELETE_PACKAGE_MODAL', {
        modalType: 'MODAL_DIALOG',
        modalProps: {
          title: translations.t('forms.warning'),
          bodyText: translations.t('organization.deletePackageConfirm'),
          onConfirm: () => this.onDeletePricingPackageConfirm(pricingPackage),
        },
      })
    );
  }

  async onDeletePricingPackageConfirm(pricingPackage) {
    const { dispatch } = this.props;
    dispatch(ModalsActions.hideModal('DELETE_PACKAGE_MODAL'));
    try {
      dispatch(UtilsActions.setSpinnerVisibile(true));
      await dispatch(OrganizationsActions.deletePricingPackage(pricingPackage.id));
      dispatch(ModalsActions.hideModal('PRICING_PACKAGE_FORM'));
      dispatch(UtilsActions.setSpinnerVisibile(false));
      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'SUCCESS_ALERT',
          modalProps: {
            message: translations.t('organization.deletePackageSuccess'),
          },
        })
      );
      this.onFetchPricingPackages();
    } catch (error) {
      dispatch(UtilsActions.setSpinnerVisibile(false));
      const errorCode = _.get(error, 'response.data.code');
      const message = _.get(error, 'response.data.message');

      const errorMessage =
        errorCode && message
          ? getErrorMessageOnDeletePackagePriceInUse(message, errorCode, translations.t('organization.deletePackageError'))
          : translations.t('organization.deletePackageError');

      dispatch(
        ModalsActions.showModal('PACKAGE_CREATION_ERROR', {
          modalType: 'ERROR_ALERT',
          modalProps: {
            message: errorMessage,
          },
        })
      );
    }
  }

  render() {
    const { isLoading } = this.state;
    const {
      classes,
      companies: { pricingPackages: packagesData },
      user: {
        data: { isBoom },
      },
    } = this.props;
    const canDeletePricingPackages = AbilityProvider.getCompanyAbilityHelper().hasPermission(
      [PERMISSIONS.DELETE],
      PERMISSION_ENTITIES.PRICINGPACKAGE
    );
    return (
      <div>
        <Permission
          do={[PERMISSIONS.CREATE]}
          on={PERMISSION_ENTITIES.PRICINGPACKAGE}
          abilityHelper={AbilityProvider.getCompanyAbilityHelper()}
        >
          <MDButton
            title={translations.t('organization.newPricingPackage')}
            className="gradient-button"
            titleStyle={{ fontSize: 15 }}
            containerstyle={{ width: '50%', marginTop: 20, marginBottom: 20 }}
            backgroundColor="#5AC0B1"
            onClick={() => this.onNewPricingPackageClick()}
          />
        </Permission>
        {_.map(packagesData, (pricingPackage) => (
          <div key={pricingPackage.id}>
            {isBoom ? (
              <PricingPackageInfo
                package={pricingPackage}
                showAuthorizedCompanies
                onClick={() => this.onEditPricingPackageClick(pricingPackage)}
                onDelete={canDeletePricingPackages ? () => this.onDeletePricingPackageRequest(pricingPackage) : null}
              />
            ) : (
              <PricingPackageRow package={pricingPackage} />
            )}
          </div>
        ))}
        {(!packagesData || _.isEmpty(packagesData)) && !isLoading && (
          <div className={classes.noUserContainer}>
            <PricingPackagesIcon className={classes.noUserIcon} />
            <h4 className={classes.noUserText}>{translations.t('organization.noPricingPackagesFound')}</h4>
          </div>
        )}
        {isLoading && _.isEmpty(packagesData) && (
          <Spinner
            title={translations.t('general.loading')}
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#3f3f3f', marginTop: 5 }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  organizations: state.organizations,
  companies: state.companies,
  user: state.user,
  currencies: state.utils.currencies,
});

export default connect(mapStateToProps)(withStyles(styles)(PricingPackageView));
