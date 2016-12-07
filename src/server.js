import path from 'path';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import config from './config';
import createRoutes from './routes';
import configureStore from './configureStore';
import renderHtmlPage from './utils/renderHtmlPage';

const DIST = path.resolve(process.cwd(), 'dist');
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * milliseconds

const app = express();

app.use(helmet({
  noCache: false, // Allow the browser to cache
}));
app.use(hpp());
app.use(compression());
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }));
app.use(favicon(path.join(DIST, 'favicon.ico')));
app.use(express.static(DIST, {
  maxAge: CACHE_DURATION,
}));

if (__DEV__) {
  const webpack = require('webpack');
  const config = require('../configs/webpack.config');

  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    stats: { colors: true },
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

app.get('*', (req, res) => {
  if (__DEV__) {
    global.webpackIsomorphicTools.refresh();
  }

  const userAgent = req.header('user-agent');
  const mobile = !!userAgent.match(/mobile/i);
  const tablet = !!userAgent.match(/ipad/i);
  const desktop = !mobile && !tablet;

  let defaultMedia = 'desktop';
  if (tablet) {
    defaultMedia = 'tablet';
  } else if (mobile) {
    defaultMedia = 'mobile';
  }

  const store = configureStore({
    media: { mobile, tablet, desktop, defaultMedia },
  });

  if (__DISABLE_SSR__) {
    res.send(renderHtmlPage(store));
    return;
  }

  const memoryHistory = createMemoryHistory(req.url);
  const routes = createRoutes(store);
  const history = syncHistoryWithStore(memoryHistory, store);

  match({ history, routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (!renderProps) {
      res.sendStatus(404);
    } else {
      const { components, params } = renderProps;
      Promise.all(components.filter(c => c && c.fetch).map(({ fetch }) => fetch(store.dispatch, params)))
        .then(() => {
          const html = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>
          );

          res.status(200).send(renderHtmlPage(store, html));
        })
        .catch(err => {
          console.error(`Error Rendering routes: ${err}`);
        });
    }
  });
});

if (config.port) {
  app.listen(config.port, config.host, err => {
    if (err) {
      throw err;
    }

    console.log(`Listening at http://${config.host}:${config.port}`);
  });
} else {
  console.error('No PORT environment variable has been specified');
}
