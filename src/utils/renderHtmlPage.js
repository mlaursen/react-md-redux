import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

export default function renderHtmlPage(store, html = '') {
  const head = Helmet.rewind();
  const assets = global.webpackIsomorphicTools.assets();

  let page = `<!DOCTYPE html><html ${head.htmlAttributes.toString()}>`;

  page += '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
  page += '<meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">';
  page += head.base.toString() + head.title.toString() + head.meta.toString() + head.link.toString();
  page += Object.keys(assets.styles).map(style =>
    `<link href="${assets.styles[style]}" rel="stylesheet" type="text/css">`
  ).join('');

  page += `</head><body><div id="app"><div>${html}</div></div>`;
  if (store) {
    page += `<script type="text/javascript">window.__INITIAL_STATE__=${serialize(store.getState())}</script>`;
  }

  page += Object.keys(assets.javascript).reverse().map(script =>
    `<script src="${assets.javascript[script]}"></script>`
  ).join('');
  page += head.script.toString();
  page += '</body></html>';

  return page;
}
