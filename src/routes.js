import App from './containers/App';

function errorLoading(err) {
  console.error(`Dynamic page loading failed: ${err}`);
}

const loadModule = cb => Component => {
  cb(null, Component.default);
};

export default function createRoutes(/* store */) {
  return {
    component: App,
    childRoutes: [{
      path: '/',
      getComponent(nextState, cb) {
        const renderRoute = loadModule(cb);
        System.import('./containers/Home').then(Component => {
          renderRoute(Component);
        }).catch(errorLoading);
      },
    }, {
      path: '*',
      getComponent(state, cb) {
        System.import('./components/NotFound').then(loadModule(cb)).catch(errorLoading);
      },
    }],
  };
}
