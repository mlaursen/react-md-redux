const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const DEV = NODE_ENV !== 'production';

const CLIENT = path.resolve(process.cwd(), 'src', 'client.js');

const CSSModules = true; // Don't know how to get it working without CDN though

const VENDORS = [
  'react', 'react-dom', 'react-addons-css-transition-group', 'react-addons-transition-group',
  'redux', 'react-redux', 'redux-thunk', 'react-router-redux',
];

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./WIT.config')).development(DEV);

const getPlugins = () => {
  const plugins = [];

  plugins.push(
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          failOnError: true,
        },
        context: '/',
        debug: DEV,
        minimize: !DEV,
      },
    }),
    new StyleLintPlugin({
      syntax: 'scss',
      failOnError: true,
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: DEV,
    }),
    new webpack.NoErrorsPlugin(),
    webpackIsomorphicToolsPlugin
  );

  if (DEV) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/webpack-stats\.json$/)
    );
  } else {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name].[chunkhash].min.js',
        minChunks: Infinity,
      }),
      new ExtractTextPlugin({
        filename: '[name].[contenthash].min.css',
        allChunks: true,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: { screw_ie8: true, warnings: false },
        output: { comments: false },
        sourceMap: false,
      })
    );
  }

  return plugins;
};

const getEntry = () => {
  if (DEV) {
    return [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      CLIENT,
    ];
  }

  return {
    main: CLIENT,
    vendors: VENDORS,
  };
};

module.exports = {
  target: 'web',
  cache: DEV,
  devtool: DEV ? 'source-map' : 'hidden-source-map',
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    filename: DEV ? '[name].js' : '[name].[chunkhash].min.js',
    chunkFilename: DEV ? '[name].chunk.js' : '[name].[chunkhash].chunk.min.js',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: DEV,
        babelrc: false,
        presets: [['es2015', { modules: false }], 'react', 'stage-0'],
        plugins: ['react-hot-loader/babel', 'transform-runtime', 'transform-decorators-legacy'],
      },
    }, {
      test: /\.json$/,
      exclude: /node_modules/,
      loader: 'json-loader',
    }, {
      test: /\.css$/,
      loader: DEV
        ? `style-loader!css-loader?localIdentName=[name]__[local].[hash:base64:5]${CSSModules ? '&modules' : ''}&sourceMap&-minimize&importLoaders=1&postcss-loader`
        : ExtractTextPlugin({
            fallbackLoader: 'style-loader',
            loader: `css-loader?sourceMap${CSSModules ? '&modules' : ''}&importLoaders=1!postcss-loader`,
          }),
    }, {
      test: /\.scss$/,
      loader: DEV
        ? `style-loader!css-loader?localIdentName=[name]__[local].[hash:base64:5]${CSSModules ? '&modules' : ''}&sourceMap&-minimize&importLoaders=2!postcss-loader!sass-loader?outputStyle=expanded&sourceMap`
        : ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: `css-loader${CSSModules ? '?modules' : ''}?sourceMap&importLoaders=2!postcss-loader!sass-loader?outputStyle=expanded&sourceMap&sourceMapContents`,
        }),
    }, {
      test: /\.(woff2?|ttf|eot|svg)$/,
      loader: 'url-loader?limit=10000',
    }, {
      test: webpackIsomorphicToolsPlugin.regular_expression('images'),
      loader: 'url-loader?limit=10240!image-webpack?bypassOnDebug',
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
    ],
  },
  plugins: getPlugins(),
};
