import { all, call, put, select, takeLeading } from 'redux-saga/effects'
import i18n from 'i18next'
import { loadScript } from '../../../services/dynamic-script'
import { ee, initializeEEConnection } from '../../../services/earth-engine'
import * as Auth from './header'
import { Actions as Snack } from '../snacks'

const AUTH_PARAMS = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/earthengine'/*ee.apiclient.AUTH_SCOPE + ${ee.apiclient.STORAGE_SCOPE} */
}

/**
 * Asynchronously loads and initiates auth2 client.
 * @returns {Promise}
 */
const gapiLoadAuth2 = async () => {
    return new Promise((resolve, reject) => {
        loadScript(
            'gapi-client-auth',
            '//apis.google.com/js/api:client.js',
            () => {
                window.gapi.load('client:auth2', () => {
                    window.gapi.auth2.init(AUTH_PARAMS).then((e) => resolve(e))
                })
            },
            error => reject(error)
        )
    })
}

const loadClientAuth = function* ({ payload: { onSuccess } }) {
    try {
        yield call(gapiLoadAuth2)
        yield put(Auth.Actions.loadClientAuthSuccess())
        onSuccess()
    }
    catch (e) {
        yield put(Auth.Actions.loadClientAuthFailure(e))
    }
}

const loadClientAuthSuccess = function* () {
    console.info('[ducks/auth] LOAD SUCCESS')
}

const loadClientAuthFailure = function* () {
    // Display notification
    // NotificationActions.display(...)
    console.error('[ducks/auth] LOAD ERROR: Not able to load client:auth2')
}

const begin = function* ({ payload: { callback } }) {
    if (window.gapi && window.gapi.auth2) {
        const signedUser = yield select(state => state.auth.user)

        if (!signedUser) {
            yield put(Snack.task('signin-task', i18n.t('auth.loading')));

            const instance = window.gapi.auth2.getAuthInstance()

            try {
                if (!instance.isSignedIn.get()) {
                    yield call([instance, instance.signIn])
                }

                yield call(initializeEEConnection, process.env.REACT_APP_CLIENT_ID)

                const user = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
                yield put(Auth.Actions.authorize(user.getName(), user.getImageUrl()))

                yield put(Snack.dismiss('signin-task'))

                callback()
            }
            catch (e) {
                yield put(Auth.Actions.authorizeFailure(e))
            }
        } else {
            yield put(Auth.Actions.authorize(signedUser.name, signedUser.imageUrl))
        }
    } else {
        console.error('[ducks/auth] LOGIC ERROR: begin called before auth lib load')
    }
}

const authorizeFailure = function* ({ payload: { error: { error } } }) {
    console.error(`[ducks/auth] AUTH ERROR: Not able to sign in due to ${error}`)

    yield put(Snack.error('signin-task-error', `Error: ${error}`))
    yield put(Snack.dismiss('signin-task'))
}

const revoke = function* ({ payload: { callback } }) {
    if (window.gapi && window.gapi.auth2) {
        window.gapi.auth2.getAuthInstance().disconnect()
        ee.data.clearAuthToken()
        callback()
    }
}

const root = function* () {
    yield all([
        takeLeading(Auth.Types.LOAD_CLIENT_AUTH, loadClientAuth),
        takeLeading(Auth.Types.LOAD_CLIENT_AUTH_SUCCESS, loadClientAuthSuccess),
        takeLeading(Auth.Types.LOAD_CLIENT_AUTH_FAILURE, loadClientAuthFailure),
        takeLeading(Auth.Types.BEGIN, begin),
        takeLeading(Auth.Types.AUTHORIZE_FAILURE, authorizeFailure),
        takeLeading(Auth.Types.REVOKE, revoke),
    ])
}

export default root;