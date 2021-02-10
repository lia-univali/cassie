import { all } from 'redux-saga/effects';

const PUSH_RESULT = 'cassie/results/PUSH_RESULT';

export const pushResult = (identifier, payload) => {
  return { type: PUSH_RESULT, identifier, payload };
}

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case PUSH_RESULT:
      return { ...state, [action.identifier]: action.payload };

    default:
      return state;
  }
}

export default reducer

export const saga = function* () {
  yield all([]);
}
