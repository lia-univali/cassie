import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { createRootReducer, saga } from './store/ducks'

export const history = createBrowserHistory();

export default function configureStore() {
  const sagas = createSagaMiddleware();
  const middleware = applyMiddleware(routerMiddleware(history), sagas, thunk, createLogger({ collapsed: true }));

  const store = createStore(createRootReducer(history), composeWithDevTools(middleware));

  sagas.run(saga);

  return store;
}