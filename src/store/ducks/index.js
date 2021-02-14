import { combineReducers } from 'redux'
import { all } from 'redux-saga/effects'
import { connectRouter } from 'connected-react-router'
import * as auth from './auth'
import * as imagery from './imagery'
import * as snacks from './snacks'
import * as map from './map'
import * as acquisition from './acquisition'
import * as i18n from './i18n'
import * as modal from './modal'
import * as dialog from './dialog'
import * as common from './common'
import * as results from './results'

export const createRootReducer = (history) => combineReducers({
  map: map.reducer,
  [auth.store]: auth.reducer,
  i18n: i18n.reducer,
  modal: modal.reducer,
  dialog: dialog.reducer,
  router: connectRouter(history),
  common: common.reducer,
  [imagery.store]: imagery.reducer,
  results: results.reducer,
  acquisition: acquisition.reducer,
  [snacks.store]: snacks.reducer,
});

export const saga = function* () {
  while (true) {
    try {
      yield all([
        map.saga(),
        auth.saga(),
        acquisition.saga(),
        imagery.saga(),
      ])
    } catch (e) {
      console.log(e)
    }
  }
}