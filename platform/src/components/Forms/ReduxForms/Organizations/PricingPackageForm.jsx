import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, submit } from 'redux-form';
import * as CompaniesActions from '../../../../redux/actions/companies.actions';
import translations from '../../../../translations/i18next';
import MDButton from '../../../MDButton/MDButton';
import MDTextInputField from '../../FormComponents/MDTextInput/MDTextInputField';
import SelectableField from '../../FormComponents/SelectableInput/SelectableField';
import MDSelectField from '../../FormComponents/MDSelectField/MDSelectField';
import { photoTypesWithoutOthers } from 'utils/orders';
import { featureFlag } from 'config/featureFlags';

const validate = (values) => {
  return ['name', 'companyPrice', 'photographerEarning', 'shootingDuration', 'photosQuantity', 'currencyId', 'photoTypeId'].reduce(
    (acc, field) => (!values[field] ? { ...acc, [field]: translations.t('forms.required') } : {}),
    {}
  );
};

class PricingPackageForm extends React.Component {
  async onFilterSubcompanies(name) {
    const {
      companies: { selectedRootCompany },
      organizations: { selectedOrganization: organization },
    } = this.props;
    const filteredOptions = await CompaniesActions.fetchSubCompaniesOptions(name, selectedRootCompany, organization);
    const newOptions = _.map(filteredOptions, (company) => ({
      value: String(company.id), // workaround for creatable component
      label: company.name,
    }));
    return newOptions;
  }

  render() {
    const { dispatch, onDeletePricingPackage, currencies, pricingPackageForm, user } = this.props;
    const selectedCurrency =
      pricingPackageForm && pricingPackageForm.values && pricingPackageForm.values.currencyId
        ? _.find(currencies, (currency) => currency.id === pricingPackageForm.values.currencyId)
        : null;
    const currencySymbol = selectedCurrency ? `(${selectedCurrency.symbol})` : '';
    const photoTypes = photoTypesWithoutOthers(user.photoTypes);

    const isB1Enabled = featureFlag.isFeatureEnabled('b1-new-company-structure');

    return (
      <div style={{ marginTop: 20, marginRight: 20, padding: 20 }}>
        <h4>{translations.t('calendar.package')}</h4>
        <Field name="name" component={MDTextInputField} label={translations.t('forms.pricingPackageName')} required />
        <Field
          name="shootingDuration"
          component={MDTextInputField}
          label={translations.t('forms.shootingDuration')}
          required
          type="number"
          min={1}
        />
        <Field
          name="photosQuantity"
          component={MDTextInputField}
          label={translations.t('forms.photosQuantity')}
          required
          type="number"
          min={1}
        />
        <Field
          name="photoTypeId"
          title={translations.t('forms.photoType')}
          containerstyle={{ marginBottom: 25 }}
          options={_.map(photoTypes, (photoType) => ({ id: photoType.id, value: translations.t(`photoTypes.${photoType.type}`) }))}
          component={MDSelectField}
          showErrorLabel
          required
          horizontal
        />
        <Field
          title={translations.t('forms.pricingPackageCurrency')}
          name="currencyId"
          component={MDSelectField}
          containerstyle={{ marginBottom: 25 }}
          options={_.map(currencies, (currency) => ({
            id: currency.id,
            value: `${translations.t(`currencies.${currency.alphabeticCode}`)} (${currency.symbol})`,
          }))}
        />
        <Field
          name="companyPrice"
          component={MDTextInputField}
          label={`${translations.t('forms.companyPrice')} ${currencySymbol}`}
          required
          disabled={!selectedCurrency}
          type="number"
          min={0}
        />
        <Field
          name="photographerEarning"
          component={MDTextInputField}
          label={`${translations.t('forms.photographerEarning')} ${currencySymbol}`}
          required
          disabled={!selectedCurrency}
          type="number"
          min={0}
        />
        <h4>{translations.t('forms.makePackageAvailableCompany')}</h4>
        <Field
          name="compainesSelected"
          component={SelectableField}
          placeholder={isB1Enabled ? translations.t('company.companies') : translations.t('company.companiesOld')}
          multi
          containerstyle={{ marginTop: 20 }}
          onLoadOptions={(name) => this.onFilterSubcompanies(name)}
        />
        <MDButton
          title={translations.t('forms.save')}
          className="gradient-button"
          titleStyle={{ fontSize: 15 }}
          containerstyle={{ marginTop: 40 }}
          backgroundColor="#5AC0B1"
          onClick={() => dispatch(submit('PricingPackageForm'))}
        />
        {onDeletePricingPackage && (
          <MDButton
            title={translations.t('forms.delete')}
            className="gradient-button"
            titleStyle={{ fontSize: 15 }}
            containerstyle={{ marginTop: 20 }}
            onClick={() => onDeletePricingPackage()}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  pricingPackageForm: state.form.PricingPackageForm,
  companies: state.companies,
  organizations: state.organizations,
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'PricingPackageForm',
    validate,
  })(PricingPackageForm)
);
