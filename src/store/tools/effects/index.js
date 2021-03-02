import { buffers } from 'redux-saga'
import { actionChannel, call, put, race, take, takeEvery } from 'redux-saga/effects'

/**
 * Creates a saga effect that takes every *action*
 * @param {String} action
 * @param {Function*} handler
 */
 export const concurrentHandler = function*(action, handler) {
  yield takeEvery(action, handler)
}

/**
 * Creates a saga effect that takes *action* on
 * an action channel
 * @param {String} action
 * @param {Function*} handler
 * @param {Buffer} buffer
 */
export const bufferedHandler = function*(action, handler, buffer = buffers.expanding()) {
  const channel = yield actionChannel(action, buffer)

  while (true) {
    const content = yield take(channel)
    yield call(handler, content)
  }
}

/**
 * Helper function to make asynchronous requests to
 * GEE and other APIs that use the callback passing
 * style with signature (success, error) instead of
 * the other way around (which can be performed
 * using *cps* from redux-saga/effects)
 * @param {[Object, Function]|Function} request the full
 * specification of a callable (either free function or 
 * a [ context, member ])
 * @param {...any} params Parameters to pass to the request
 */
export const callback = async (request, ...params) => {
  const [context, fn] = (() => {
    if (Array.isArray(request)) return [request[0], request[1]]
    return [request, request]
  })()

  return new Promise((resolve, reject) => {
    fn.apply(context, [...params, (success, error) => {
      if (error) reject(error)
      resolve(success)
    }])
  })
}

/**
 * Performs *action*(*...params*) inside a promise
 * @param {Function} action
 * @param  {...any} params
 */
 export const promise = (action, ...params) => {
  return new Promise((resolve, reject) => {
    action(...params, (success, error) => {
      if (error) reject(error)
      resolve(success)
    })
  })
}

// @TODO unused?
export const cancellable = function*(effect) {
  const { result } = yield race({
    result: effect,
    cancellation: take('ABORT_REQUEST')
  })

  return result || null
}

// @TODO remove
export const evaluate = function*(query) {
  yield put({ type: 'EVALUATE' })
  const result = yield callback([query, query.evaluate])
  yield put({ type: 'DONE' })

  return result
}