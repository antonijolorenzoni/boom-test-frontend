import React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ShootingActionsView from '../../../components/Shooting/ShootingActionsView';
import * as ShootingsActions from '../../../redux/actions/shootings.actions';
import translations from '../../../translations/i18next';
import Spinner from '../../../components/Spinner/Spinner';
import { isMobileBrowser } from '../../../config/utils';

class ShootingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  async componentWillMount() {
    const {
      history,
      dispatch,
      user: {
        data: { isPhotographer },
      },
    } = this.props;
    const searchParameters = history && history.location && history.location.search;
    const parsedParameters = queryString.parse(searchParameters);
    this.setState({ isLoading: true });
    if (parsedParameters && parsedParameters.shootingId) {
      try {
        let shooting;
        if (isPhotographer) {
          shooting = await dispatch(ShootingsActions.fetchShootingDetailsAndPenalties({ id: parsedParameters.shootingId }));
        } else {
          shooting = await dispatch(ShootingsActions.fetchShootingDetailsAndItems({ id: parsedParameters.shootingId }));
        }
        dispatch(ShootingsActions.setSelectedShooting(shooting));
        if (_.isEmpty(shooting)) history.push('/shootingEmptyView');
        this.setState({ isLoading: false });
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response &&
          error.response.data &&
          error.response.data.code &&
          error.response.data.code === 17001
        ) {
          history.push('/shootingEmptyView');
        } else {
          history.push('/notifications');
        }
        this.setState({ isLoading: false });
      }
    } else {
      history.push('/notifications');
      this.setState({ isLoading: false });
    }
  }

  async onCompleteShootingAction(shooting) {
    const { history } = this.props;
    this.setState({ isLoading: true });
    try {
      history.push('/calendar');
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading } = this.state;

    return (
      <div style={{ padding: isMobileBrowser() ? 20 : 70, paddingTop: 0, overflow: 'scroll' }}>
        {isLoading ? (
          <Spinner
            title={translations.t('general.loading')}
            hideLogo
            spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
            titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
          />
        ) : (
          <ShootingActionsView onCompleteShootingAction={(shooting) => this.onCompleteShootingAction(shooting)} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  utils: state.utils,
  user: state.user,
  shootings: state.shootings,
});

export default connect(mapStateToProps)(withRouter(ShootingDetails));
