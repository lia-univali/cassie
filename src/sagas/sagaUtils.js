import { race, put, take, } from 'redux-saga/effects'
import { open, close } from '../actions/modal';
import { evaluate as evaluateQuery } from '../common/eeUtils';
import { asPromise } from '../common/utils';

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
