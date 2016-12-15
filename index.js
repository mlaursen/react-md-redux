require('babel-core/register'); // Enable runtime transpilation to use ES6/7 in node

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEV__ = process.env.NODE_ENV !== 'production';

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

const ROOT_DIR = require('path').resolve(process.cwd());
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./configs/WIT.config'))
  .server(ROOT_DIR, () => {
    require('./src/server');
  });
