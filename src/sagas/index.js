import { all } from 'redux-saga/effects';
import userSaga from './user';
import applicationSaga from './application';
import { saga as mapSaga } from '../ducks/map';
import { saga as acquisitionSaga } from '../ducks/acquisition';
import { saga as imagerySaga } from '../ducks/imagery';

export default function* rootSaga() {
  while (true) {
    try {
      yield all([
        mapSaga(),
        userSaga(),
        applicationSaga(),
        acquisitionSaga(),
        imagerySaga(),
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}
