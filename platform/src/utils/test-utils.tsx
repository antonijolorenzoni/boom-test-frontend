import React from 'react';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from 'redux/reducers';

const withStoreRender = (
  ui: React.ReactElement,
  options: { initialState?: any; store?: any } & Omit<RenderOptions, 'queries' | 'intoDocument'> = {}
): RenderResult => {
  const { initialState = {}, store = createStore(reducer, initialState) } = options;
  const Wrapper: React.FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { withStoreRender };
