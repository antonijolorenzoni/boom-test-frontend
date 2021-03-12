import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SadIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MDButton from '../../../components/MDButton/MDButton';
import { isMobileBrowser } from '../../../config/utils';
import translations from '../../../translations/i18next';

const ShootingsEmptyView = ({ history }) => (
  <div style={{ padding: isMobileBrowser() ? 20 : 70, paddingTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
      <SadIcon style={{ fontSize: 40 }} />
    </div>
    <h4 style={{ margin: 5, textAlign: 'center' }}>{translations.t('shootings.shootingNotFoundFotographer')}</h4>
    <MDButton
      title={translations.t('shootings.backToCalendar')}
      titleStyle={{ marginRight: 10 }}
      backgroundColor="#5AC0B1"
      icon={<CalendarTodayIcon style={{ color: 'white' }} />}
      onClick={() => history.push('/calendar')}
    />
  </div>
);

export default connect()(withRouter(ShootingsEmptyView));
