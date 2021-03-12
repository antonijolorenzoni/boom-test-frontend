import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import { datadogLogs } from '@datadog/browser-logs';

import App from './App';

import * as serviceWorker from './serviceWorker';

import './i18n';
import { IsLanguageSelectorToggledProvider } from 'contexts/IsLanguageSelectorToggledContext';

const profile = process.env.REACT_APP_PROFILE;

if (profile && profile !== 'local') {
  datadogLogs.init({
    env: process.env.REACT_APP_PROFILE,
    clientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN!,
    site: 'datadoghq.eu',
    forwardErrorsToLogs: true,
    sampleRate: 100,
  });
}

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <IsLanguageSelectorToggledProvider>
      <App />
    </IsLanguageSelectorToggledProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
