import { combineReducers } from 'redux';
import userReducer from './user';
import langReducer from '../store/ducks/language'
import dataReducer from './data';
import modalReducer from './modal';
import dialogReducer from './dialog';
import commonReducer from './common';
import filterReducer from './filter';
import mapReducer from './map';
import imageryReducer from './imagery';
import resultsReducer from './results';
import acquisitionReducer from './acquisition';
import notificationReducer from './notification';
import { routerReducer } from 'react-router-redux';

const reducer = combineReducers({
  map: mapReducer,
  user: userReducer,
  lang: langReducer,
  data: dataReducer,
  modal: modalReducer,
  dialog: dialogReducer,
  router: routerReducer,
  common: commonReducer,
  filters: filterReducer,
  imagery: imageryReducer,
  results: resultsReducer,
  acquisition: acquisitionReducer,
  notification: notificationReducer,
});

export default reducer;
