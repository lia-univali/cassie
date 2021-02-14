import update from 'immutability-helper';
import { put, take, race } from 'redux-saga/effects';

const OPEN = 'cassie/dialog/OPEN';
const CLOSE = 'cassie/dialog/CLOSE';
const PUBLISH = 'cassie/dialog/PUBLISH';

const defaultState = {
  dialogs: new Set()
};

export const openDialog = (name) => {
  return { type: OPEN, name };
}

export const closeDialog = (name) => {
  return { type: CLOSE, name };
}

export const publishOutcome = (name, payload) => dispatch => {
  dispatch({ type: PUBLISH, name, payload });
  dispatch(closeDialog(name));
}

export function* openAndWait(name) {
  yield put(openDialog(name));
  const { completion } = yield race({
    completion: take(action => action.type === PUBLISH && action.name === name),
    cancellation: take(CLOSE),
  });

  if (completion) {
    return completion.payload;
  }

  return {};
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN: {
      const dialogs = update(state.dialogs, { $add: [action.name] });

      return { ...state, dialogs };
    }
    case CLOSE: {
      const dialogs = update(state.dialogs, { $remove: [action.name] });

      return { ...state, dialogs };
    }
    default:
      return state;
  }
}

export default reducer
