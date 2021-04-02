import { Types, Actions } from "./header";
import { all, put, race, take, takeEvery } from "redux-saga/effects";

export const openAndWait = function* (name) {
  yield put(Actions.open(name));

  const { completion } = yield race({
    completion: take(
      (action) => action.type === Types.PUBLISH && action.payload.name === name
    ),
    cancellation: take(Types.CLOSE),
  });

  return (completion && completion.payload.data) || {};
};

const publish = function* ({ payload }) {
  yield put(Actions.close(payload.name));
};

const root = function* () {
  yield all([takeEvery(Types.PUBLISH, publish)]);
};

export default root;
