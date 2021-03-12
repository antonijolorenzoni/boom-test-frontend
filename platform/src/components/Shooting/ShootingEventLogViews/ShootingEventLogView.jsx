import Divider from '@material-ui/core/Divider';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import ShootingEventBaseLogRow from './ShootingEventBaseLogRow';
import translations from '../../../translations/i18next';

class ShootingEventLogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLimited: true,
    };
  }

  render() {
    const { shooting, isBoom } = this.props;
    const { isLimited } = this.state;
    const shouldLimitList = _.size(shooting.events) >= 5;
    const shootingEvents = isLimited && shouldLimitList ? _.slice(shooting.events, 0, 4) : shooting.events;
    return (
      <React.Fragment>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Divider />
          {_.map(shootingEvents, (event) => (
            <ShootingEventBaseLogRow key={event.id} shooting={shooting} event={event} isBoom={isBoom} />
          ))}
          {shouldLimitList && (
            <h4
              className="link-label"
              style={{ fontSize: 15, margin: 0, color: '#98c8f8', fontWeight: 100 }}
              onClick={() => this.setState({ isLimited: !isLimited })}
            >
              {isLimited ? translations.t('shootings.showMore') : translations.t('shootings.showLess')}
            </h4>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default _.flow([connect()])(ShootingEventLogView);
