import Divider from '@material-ui/core/Divider';
import _ from 'lodash';
import React from 'react';
import translations from '../../translations/i18next';
import StarRatingView from './StarRatingView';

const BoomScoreDecriptionView = ({ scores }) => (
  <div>
    <h5 style={{ margin: 0, marginBottom: 20, fontWeight: 100 }}>{translations.t('shootingBoomEvaluations.boomScoresDescription')}</h5>
    {_.map(scores, (score) => (
      <div>
        <h5 style={{ marginBottom: 0 }}>{translations.t(`shootingBoomEvaluations.${score.type}`)}</h5>
        <h5 style={{ fontWeight: 100, marginTop: 5, marginBottom: 5 }}>
          {translations.t(`shootingBoomEvaluationsDescription.${score.type.toLowerCase()}`)}
        </h5>
        <StarRatingView
          value={score.score}
          totalValues={5}
          starStyle={{ width: 12 }}
          unselectedStarStyle={{ width: 8 }}
          starContainerStyle={{ marginBottom: 15 }}
          titleContainerStyle={{ marginBottom: 0 }}
          titleStyle={{ fontWeight: 100, color: '#b2bac2', fontSize: 12, margin: 0 }}
        />
        <Divider />
      </div>
    ))}
  </div>
);

export default BoomScoreDecriptionView;
