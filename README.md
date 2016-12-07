# react-md-redux
A boilerplate repo for setting up an isomorphic React project with react-md and redux. This boilerplate
is basically the [react-cool-starter](https://github.com/wellyshen/react-cool-starter) with react-md
as the UI framework and changing a few things to be more to my general setup. There is no testing
included by default and I can't figure out how to use CSSModules without using CDNs for the react-md styles.

## Getting Started

```bash
$ yarn                       # or npm i
$ npm run start:production   # Builds prod bundle and starts server
```

For development:

```bash
$ npm start          # starts the dev server with hot reloading
$ npm run lint       # any linting for JS and scss
```

## Configuration

By default, the project is using CSS Modules even though I personally don't use them much. This can be changed
in the [webpack config](configs/wepback.config.js) by setting `const CSSModules = false;` on line 11.

Since this project uses [react-helmet](/nfl/react-helmet), the CDN files are being set from
[the configuration file](src/config/default.js). The default theme is a teal and pink combo.
