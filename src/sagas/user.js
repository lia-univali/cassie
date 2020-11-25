import { push } from 'react-router-redux';
import { take, all, put, call } from 'redux-saga/effects';
import { loadUser, CLIENT_ID } from '../actions/user';
import { displayTask, hideNotification } from '../actions/notification';
import i18next from 'i18next'

const ee = window.ee;

function* completeAuthentication(destination) {
  // Promises for establishing a connection with Earth Engine
  const eePromise = new Promise((resolve, reject) => {
    ee.data.authenticateViaOauth(CLIENT_ID, resolve, reject, null, reject);
  });

  const initializationPromise = new Promise((resolve, reject) => {
    ee.initialize(null, null, resolve, reject);
  });

  try {
    yield put(displayTask(i18next.t('auth.loading')));

    // Must be sequential
    yield eePromise;
    yield initializationPromise;

    // Ready for takeoff
    // Grab user data
    const profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    const payload = {
      name: profile.getName(),
      image: profile.getImageUrl(),
    };

    yield put(loadUser(payload));
    yield put(hideNotification());

    if (destination !== null) {
      yield put(push(destination));
    }

  } catch (e) {
    console.log(e);
  }
}

function* loginWatcher() {
  while (true) {
    const { destination } = yield take("BEGIN_AUTHENTICATION");

    const authInterface = window.gapi.auth2.getAuthInstance();

    if (authInterface.currentUser.get().isSignedIn()) {
      yield call(completeAuthentication, destination);
    } else {

      try {
        const result = yield authInterface.signIn({ scope: "https://www.googleapis.com/auth/earthengine" });
        console.log(result);

        yield call(completeAuthentication, destination);
      } catch (e) {
        console.log('Auth Error: ', e);
      }
    }
  }
}

function* logoutWatcher() {
  while (true) {
    yield take("LOGOUT");

    window.gapi.auth2.getAuthInstance().disconnect();

    yield put(push('/'));

    document.location.reload();
  }
}

export default function* rootSaga() {
  yield all([
    logoutWatcher(),
    loginWatcher(),
  ]);
}
