import { take, all, select, put, actionChannel } from 'redux-saga/effects';
import { buffers } from 'redux-saga';
import { cancellable, evaluate } from './sagaUtils';
import { processCollection, acquireFromDate } from '../procedures/acquisition';
import { login } from '../actions/user';
import * as Acquisition from '../actions/acquisition';
import * as Imagery from '../actions/imagery';

const ee = window.ee;

const calculateCloudRatio = (image, geometry, bands) => {
  // Grab the two confidence bits. The pixel will be 1 when the confidence is average or high.
  const cloudExpression = `((b("${bands.qa}") >> 6) & 3) > 1`;
  //const totalExpression = '(b("qa") * 0) + 3';

  image = ee.Image(image);

  const scale = 300;
  const cloud = image.expression(cloudExpression).divide(geometry.area().divide(scale * scale)).reduceRegion({
    scale,
    geometry,
    reducer: ee.Reducer.sum(),
    maxPixels: 1e9,
  });

  return cloud.get(bands.qa);
}

function* computeCloudScoreWatcher() {
  const channel = yield actionChannel("COMPUTE_CLOUD_SCORE", buffers.expanding(10));

  while (true) {
    let { count, offset, collection } = yield take(channel);

    console.log("Taken", offset);

    const { bands, geometry } = yield select(state => ({
      bands: state.acquisition.satellite.bands,
      geometry: state.acquisition.geometry,
    }));

    const image = acquireFromDate(count, collection, geometry);
    const cloudRatio = calculateCloudRatio(image, geometry, bands);

    const result = image.set({ cloudRatio });

    const start = Date.now();
    console.log(yield evaluate(result));
    console.log(Date.now() - start);
  }
}


function* loadAvailableImagesWatcher() {
  while (true) {
    yield take("LOAD_AVAILABLE_IMAGES");

    const { geometry, satellite } = yield select(state => ({
      geometry: state.acquisition.geometry,
      satellite: state.acquisition.satellite,
    }));

    const query = processCollection(satellite, geometry);

    const datesQuery = query.map(date => ee.Date(date).format("YYYY-MM-dd"));
    const dates = yield cancellable(evaluate(datesQuery));

    console.log(dates);
    if (dates !== undefined) {
      yield put(Acquisition.setDates(dates));
    }
  }
}

function* loadTestStateWatcher() {
  while (true) {
    yield take("LOAD_TEST_STATE");

    const coordinates = [
      [-48.775177001953125, -26.708813412005927],
      [-48.497772216796875, -26.708813412005927],
      [-48.497772216796875, -26.907375462719227],
      [-48.775177001953125, -26.907375462719227]
    ];

    yield put(login())
    yield take("LOAD_USER");
    yield put(Acquisition.setSatellite(1));
    yield put(Acquisition.setAOI(null, coordinates, ee.Geometry.Polygon([coordinates])));
    yield put(Acquisition.loadAvailableImages());
    yield take("SET_DATES");
    yield put(Acquisition.setPeriod("1984-06-04", "2011-11-06"));
    yield put(Imagery.loadImage("1986-07-12"));
  }
}

export default function* rootSaga() {
  yield all([
    loadAvailableImagesWatcher(),
    computeCloudScoreWatcher(),
    loadTestStateWatcher(),
  ]);
}
