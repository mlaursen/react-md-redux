import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { match, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import configureStore from './configureStore';

const store = configureStore(window.__INITIAL_STATE__);
const history = syncHistoryWithStore(browserHistory, store);

const root = document.getElementById('app');

function renderApp() {
  const routes = require('./routes').default(store);

  match({ history, routes }, (error, redirectLocation, renderProps) => {
    render(
      <AppContainer>
        <Provider store={store}>
          <Router {...renderProps} />
        </Provider>
      </AppContainer>,
      root
    );
  });
}

if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {
      const RedBox = require('redbox-react').default;

      render(<RedBox error={error} />, root);
    }
  };

  module.hot.accept('./routes', () => {
    setImmediate(() => {
      unmountComponentAtNode(root);
      reRenderApp();
    });
  });
}

renderApp();
