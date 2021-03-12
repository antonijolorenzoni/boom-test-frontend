import _ from 'lodash';
import { fetchFeatures } from '../api/featuresAPI';

const INTERVAL = 600000;

const featureFlag = {
  features: [],
  jobId: null,

  updateFeatures: async () => {
    const result = await fetchFeatures();
    featureFlag.features = result.data;
  },
  schedule: () => {
    featureFlag.jobId = window.setInterval(featureFlag.updateFeatures, INTERVAL);
  },
  unschedule: () => {
    window.clearInterval(featureFlag.jobId);
  },
  isFeatureEnabled: (name) => {
    const feature = featureFlag.features.find((f) => f.name === name);
    return _.get(feature, 'enabled', false);
  },
};

export { featureFlag };
