import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import translations from '../../../translations/i18next';
import MDDatePickerField from '../FormComponents/MDDatePicker/MDDatePickerField';
import MDSelectMultipleField from '../FormComponents/MDSelectMultipleField/MDSelectMultipleField';

const CSVShootingFiltersForm = ({ shootingStatesOptions }) => (
  <div style={{ marginRight: 20 }}>
    <Field
      name="dateFrom"
      component={MDDatePickerField}
      containerstyle={{ marginLeft: 20 }}
      label={translations.t('shootings.startDate')}
    />
    <Field name="dateTo" component={MDDatePickerField} containerstyle={{ marginLeft: 20 }} label={translations.t('shootings.endDate')} />
    <Field
      name="states"
      title={translations.t('shootings.shotingStatus')}
      component={MDSelectMultipleField}
      options={shootingStatesOptions}
      InputProps={{
        containerstyle: {
          width: '100%',
        },
      }}
      containerstyle={{ width: '90%%', marginLeft: 20 }}
    />
  </div>
);

export default connect()(
  reduxForm({
    form: 'CSVShootingFiltersForm',
  })(CSVShootingFiltersForm)
);
