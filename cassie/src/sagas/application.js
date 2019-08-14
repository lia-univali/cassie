import { take, all, put } from 'redux-saga/effects';
import { dialog } from './sagaUtils';
import * as Imagery from 'actions/imagery';

function* onNewCustomLayer() {
  while (true) {
    const { parent } = yield take("BEGIN_LAYER_CREATION");
    const { expression, name } = yield dialog("NEW_LAYER");

    if (expression !== undefined) {
      yield put(Imagery.addCustomLayer(expression, parent, name));
    }
  }
}

export default function* rootSaga() {
  while (true) {
    try {
      yield all([
        onNewCustomLayer(),
      ]);
    } catch (e) {
      console.log(e);
    }
  }
}
