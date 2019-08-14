import { take, takeEvery, all, select, put, actionChannel } from 'redux-saga/effects';
// import update from 'immutability-helper';
import { get as getSatellite } from 'common/satellites';
import { generateLayer } from 'procedures/imagery';
import { createConcurrentHandler, createBufferedHandler, cancellable, evaluate } from 'common/sagaUtils';
import { applyExpression } from 'common/eeUtils';
import { formatDate } from 'common/utils';
import { loadLayer, pushImage } from './imagery';
import { getAcquisitionParameters, getImageryIdentifiers } from 'selectors';
import { login } from 'actions/user';

const PUSH_RESULT = 'cassie/results/PUSH_RESULT';

export const pushResult = (identifier, payload) => {
  return {type: PUSH_RESULT, identifier, payload};
}


export default function reducer(state = {}, action) {
  switch (action.type) {
  case PUSH_RESULT:
    return {...state, [action.identifier]: action.payload};

  default:
    return state;
  }
};


const ee = window.ee;

function* handleAcquireImage({date}) {

}

export function* saga() {
  yield all([
    //createBufferedHandler(ACQUIRE_IMAGE, handleAcquireImage),
  ]);
}
