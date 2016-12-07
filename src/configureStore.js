import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createReducer from './reducers';


export default function configureStore(initialState) {
  const middlewares = [thunk];
  const enhancers = [
    applyMiddleware(...middlewares),
    __DEV__ && typeof window !== 'undefined' && typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f,
  ];

  const store = createStore(createReducer(), initialState, compose(...enhancers));
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      try {
        const reducers = require('./reducers').default;
        store.replaceReducer(reducers(store.asyncReducers));
      } catch (error) {
        console.error(`Reducer hot reloading error: ${error}`);
      }
    });
  }

  return store;
}
