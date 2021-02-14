import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { createRootReducer, saga } from './ducks'

export const history = createBrowserHistory()

export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  
  const middleware = applyMiddleware(
                      routerMiddleware(history),
                      sagaMiddleware,
                      thunk,
                      createLogger({ collapsed: true }))

  const store = createStore(
                  createRootReducer(history),
                  composeWithDevTools(middleware))

  sagaMiddleware.run(saga)

  return store
}

export default configureStore