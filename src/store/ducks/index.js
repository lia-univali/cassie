import { combineReducers } from 'redux'
import { all } from 'redux-saga/effects'
import { connectRouter } from 'connected-react-router'
import * as auth from './auth'
import * as imagery from './imagery'
import * as snacks from './snacks'
import * as map from './map'
import * as acquisition from './acquisition'
import * as i18n from './i18n'
import * as dialog from './dialog'
import * as common from './common'
import * as results from './results'

export const createRootReducer = (history) => combineReducers({
  [auth.store]: auth.reducer,
  [snacks.store]: snacks.reducer,
  [i18n.store]: i18n.reducer,
  [common.store]: common.reducer,
  [dialog.store]: dialog.reducer,
  [map.store]: map.reducer,
  [acquisition.store]: acquisition.reducer,
  [imagery.store]: imagery.reducer,
  [results.store]: results.reducer,
  router: connectRouter(history),
})

export const saga = function* () {
  while (true) {
    try {
      yield all([
        auth.saga(),
        map.saga(),
        dialog.saga(),
        acquisition.saga(),
        imagery.saga(),
      ])
    } catch (e) {
      console.log(e)
    }
  }
}