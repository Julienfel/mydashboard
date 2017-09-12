/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import thunkMiddleware from 'redux-thunk';
import callAPIMiddleware from './middlewares/callAPI';

import LibraryReducer from './modules/library/reducers';

const history = createHistory();

const reducers = combineReducers({
  Library: LibraryReducer,
  router: routerReducer,
});
const middlewares = [
  routerMiddleware(history),
  thunkMiddleware,
  callAPIMiddleware,
];

const enhancer = (process.env.NODE_ENV === 'production')
  ? applyMiddleware(...middlewares)
  : compose(
    applyMiddleware(...middlewares),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );

function configureStore(preloadedState) {
  return createStore(
    reducers,
    preloadedState,
    enhancer,
  );
}

export {
  history,
  configureStore,
};
