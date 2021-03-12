import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { datadogLogs } from '@datadog/browser-logs';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';
import countries from 'i18n-iso-countries';
import './styles/index.css';
import './styles/spinner.css';
import './styles/dropzone.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-phone-number-input/style.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementLocale } from '@stripe/stripe-js';

import reducers from './redux/reducers';
import * as serviceWorker from './serviceWorker';
import App from './routes/NavigationComponents/App';

/* eslint-disable no-unused-vars */
import translations from './translations/i18next';
import { SWRConfig } from 'swr';
import { setRequestInterceptor } from 'api/instances/boomInstance';
import { ModalProvider } from 'hook/useModal';
/* eslint-enable */

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

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
countries.registerLocale(require('i18n-iso-countries/langs/it.json'));

const middlewares = [thunk];

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (window as any)['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
/* eslint-enable */

localStorage.token && setRequestInterceptor(localStorage.token);

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!, {
  locale: translations.language as StripeElementLocale,
});

// application entry point
ReactDOM.render(
  <SWRConfig value={{ revalidateOnFocus: false }}>
    <ModalProvider>
      <Provider store={store}>
        <Router>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </Router>
      </Provider>
    </ModalProvider>
  </SWRConfig>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
