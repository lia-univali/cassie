import { race, put, take, takeEvery, actionChannel, call } from 'redux-saga/effects';
import { buffers } from 'redux-saga'
import { open, close } from '../store/ducks/modal';
import { evaluate as evaluateQuery } from '../algorithms/utils';
import { asPromise } from './utils';

export function* createConcurrentHandler(action, handler) {
  yield takeEvery(action, handler);
}

export function* createBufferedHandler(action, handler, buffer = buffers.expanding()) {
  const channel = yield actionChannel(action, buffer);

  while (true) {
    const content = yield take(channel);
    yield call(handler, content);
  }
}

export function* cancellable(effect) {
  const { result, cancellation } = yield race({
    result: effect,
    cancellation: take("ABORT_REQUEST")
  });

  if (cancellation === undefined) {
    return result;
  } else {
    return undefined;
  }
}

export function* evaluate(query) {
  const promise = asPromise(evaluateQuery(query));

  yield put({ type: "BEGIN_EVALUATION" });
  const result = yield promise;
  yield put({ type: "END_EVALUATION" });
  return result;
}

export function* dialog(name, params) {
  yield put(open(name, params));

  const { result } = yield race({
    result: take("COMPLETE_MODAL"),
    cancellation: take("CLOSE_MODAL")
  });

  if (result) {
    yield put(close());
    return result;
  } else {
    return {};
  }
}
