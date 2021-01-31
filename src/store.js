import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import rootSaga from './sagas';
import reducer from './ducks/reducerConfig';
const createHistory = require("history").createBrowserHistory;


export const history = createHistory();
export default function configureStore() {
  const saga = createSagaMiddleware();
  const middleware = applyMiddleware(saga, thunk, createLogger({collapsed: true}), routerMiddleware(history));

  const store = createStore(reducer, composeWithDevTools(middleware));

  if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept(() => {
        const nextReducer = require('./ducks/reducerConfig').default;
        store.replaceReducer(nextReducer);
      });
    }

  saga.run(rootSaga);
  return store;
}

//export default store;
