import {
  take,
  takeEvery,
  call,
  all,
  select,
  put,
  actionChannel
} from "redux-saga/effects";
import update from "immutability-helper";
import { get as getSatellite } from "common/satellites";
import { generateLayer, createThumbnail } from "procedures/imagery";
import {
  createConcurrentHandler,
  createBufferedHandler,
  cancellable,
  evaluate
} from "common/sagaUtils";
import {
  applyExpression,
  getSatelliteCollection,
  generateVisualizationParams
} from "common/eeUtils";
import { formatDate, datesBetween } from "common/utils";
import { loadLayer, pushImage } from "./imagery";
import { getAcquisitionParameters, getImageryIdentifiers } from "selectors";
import {
  processCollection,
  acquireFromDate,
  generateCloudMap
} from "procedures/acquisition";
import { login } from "actions/user";

const SET_SATELLITE = "cassie/acquisition/SET_SATELLITE";
const SET_AOI = "cassie/acquisition/SET_AOI";
const SET_PERIOD = "cassie/acquisition/SET_PERIOD";
const SET_AVAILABLE_DATES = "cassie/acquisition/SET_AVAILABLE_DATES";
const LOAD_AVAILABLE_IMAGES = "cassie/acquisition/LOAD_AVAILABLE_IMAGES";
const ACQUIRE_IMAGE = "cassie/acquisition/ACQUIRE_IMAGE";
const REQUEST_AOI = "cassie/acquisition/REQUEST_AOI";
const LOAD_TEST_STATE = "cassie/acquisition/LOAD_TEST_STATE";
const LOAD_THUMBNAILS = "cassie/acquisition/LOAD_THUMBNAILS";
const INSERT_METADATA = "cassie/acquisition/INSERT_METADATA";

// Defines the satellite to be used for this session.
export const setSatellite = satelliteIndex => {
  const satellite = getSatellite(satelliteIndex);
  return { type: SET_SATELLITE, satellite, satelliteIndex };
};

// Defines the Area Of Interest to be used for this session.
export const setAOI = (overlay, coordinates, geometry) => {
  return { type: SET_AOI, overlay, coordinates, geometry };
};

// Retrieves a list of available images based on the current session's parameters.
export const loadAvailableImages = () => {
  return { type: LOAD_AVAILABLE_IMAGES };
};

// Sets the list of available acquisition dates for the current satellite.
export const setAvailableDates = dates => {
  return { type: SET_AVAILABLE_DATES, dates };
};

// Defines the time period to be used in the image acquisition step
export const setPeriod = (start, end) => {
  return { type: SET_PERIOD, start, end };
};

// Loads an image from the orbital cycle started at the specified date.
export const acquireImage = (date, ...extras) => {
  return { type: ACQUIRE_IMAGE, date, extras };
};

export const loadTestState = () => {
  return { type: LOAD_TEST_STATE };
};

export const requestAOI = () => {
  return { type: REQUEST_AOI };
};

export const loadThumbnails = () => {
  return { type: LOAD_THUMBNAILS };
};

export const insertMetadata = (date, metadata) => {
  return { type: INSERT_METADATA, date, metadata };
};

const initialState = { metadata: {} };
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SATELLITE:
      const { satellite, satelliteIndex } = action;
      return { ...state, satellite, satelliteIndex };

    case SET_AOI:
      const { overlay, geometry, coordinates } = action;
      return { ...state, overlay, geometry, coordinates };

    case SET_AVAILABLE_DATES:
      return { ...state, availableDates: action.dates };

    case SET_PERIOD:
      return { ...state, start: action.start, end: action.end };

    case INSERT_METADATA: {
      const metadata = update(state.metadata, {
        [action.date]: { $set: action.metadata }
      });

      return { ...state, metadata };
    }

    case LOAD_THUMBNAILS: {
      return { ...state, metadata: {} };
    }

    // case "SET_SELECTED_IMAGES":
    //   const filtered = state.dates.filter((el, i) => action.selectedImages[i] === true);
    //   const dates = update(state.dates, {
    //     $set: filtered
    //   });
    //
    //   return {...state, dates, done: true};

    default:
      return state;
  }
}

const ee = window.ee;

function* handleLoadAvailableImages() {
  const { geometry, satellite } = yield select(getAcquisitionParameters);

  const query = processCollection(satellite, geometry);
  const datesQuery = query.map(date => ee.Date(date).format("YYYY-MM-dd"));
  const cloudQuery = generateCloudMap(
    datesQuery,
    getSatelliteCollection(satellite),
    geometry
  );

  const dict = yield evaluate(ee.Dictionary.fromLists(datesQuery, cloudQuery));

  //console.log(dict);

  if (dict !== undefined) {
    yield put(setAvailableDates(dict));
  }
}

function* handleLoadTestState() {
  const coordinates = [
    // [-43.00069465717752, -2.476781843108196],
    // [-42.99337867419922, -2.453904096237699],
    // [-43.01764029791991, -2.4457031030432868],
    // [-43.02713808572787, -2.4670518647787776]
    //
    // [-43.037772857421885, -2.4383642187357606],
    // [-42.851005279296885, -2.4383642187357606],
    // [-42.851005279296885, -2.545379612731001],
    // [-43.037772857421885, -2.545379612731001],
    // [-48.7803786035156, -26.243269789752397],
    // [-48.7364332910156, -26.243269789752397],
    // [-48.7364332910156, -26.296838062451535],
    // [-48.7803786035156, -26.296838062451535],
    // [-48.899211457692445, -26.213937564493794],
    // [-48.701457551442445, -26.213937564493794],
    // [-48.701457551442445, -26.378914890884978],
    // [-48.899211457692445, -26.378914890884978],
    // [-118.9928048465307, 34.140326636589094],
    // [-118.4434884402807, 34.140326636589094],
    // [-118.4434884402807, 33.9514363072154],
    // [-118.9928048465307, 33.9514363072154],
    [-43.258445233436476, -2.349135346090692],
    [-42.983787030311476, -2.349135346090692],
    [-42.983787030311476, -2.4986900926034226],
    [-43.258445233436476, -2.4986900926034226]
  ];

  yield put(login());
  yield take("LOAD_USER");
  yield put(setSatellite(1));
  yield put(setAOI(null, coordinates, ee.Geometry.Polygon([coordinates])));
  yield put(loadAvailableImages());
  yield take(SET_AVAILABLE_DATES);
  yield put(setPeriod("1984-04-27", "2011-10-05"));

  const dates = [
    "1986-06-10",
    "1989-08-21",
    "1994-07-02",
    "1995-06-03",
    "1996-09-09",
    "1999-08-01",
    "2006-06-01",
    "2007-06-20",
    "2008-06-22"
  ];
  const dict = {};

  dates.forEach(date => (dict[date] = 0));

  yield put(setAvailableDates(dict));
  // const dates = ["07/08/1984", "21/02/1987", "21/08/1989", "25/05/1992", "03/06/1995", "11/06/1998", "21/07/2001", "27/07/2003", "01/08/2005", "22/06/2008", "05/10/2011"];
  // const dates = ["13/10/1985"];
  // for (const date of dates) {
  //   yield put(acquireImage(date));
  // }
}

function* handleAcquireImage({ date }) {
  const { geometry, satellite } = yield select(getAcquisitionParameters);
  const { imageId } = yield select(getImageryIdentifiers);

  const image = acquireFromDate(
    date,
    getSatelliteCollection(satellite),
    geometry
  );

  const cloudExpression = `b("pixel_qa")`;
  const layer = generateLayer(image, satellite, "Principal");
  const layer2 = generateLayer(
    applyExpression(image, "NDWI", satellite.bands),
    satellite,
    "Secundaria",
    { min: -1, max: 1 }
  );
  //const layer3 = generateLayer(image.expression(cloudExpression).randomVisualizer().rename("B3", "B2", "B1", "x"), satellite, "Nuvens", {gain: "1,1,1"});

  // const url = yield call(createThumbnail, image, geometry, generateVisualizationParams(satellite));
  // console.log(url);

  console.log("2nd: ", imageId);
  yield put(pushImage(date, date));
  yield put(loadLayer(layer, imageId));
  //yield put(loadLayer(layer2, imageId));
}

function* handleRequestAOI() {}

function* handleLoadThumbnails() {
  const { geometry, satellite, availableDates } = yield select(
    getAcquisitionParameters
  );

  for (const date of Object.keys(availableDates)) {
    const image = acquireFromDate(
      date,
      getSatelliteCollection(satellite),
      geometry
    );
    const url = yield call(
      createThumbnail,
      image,
      geometry,
      generateVisualizationParams(satellite)
    );
    const clouds = yield evaluate(image.get("CLOUDS"));

    yield put(insertMetadata(date, { thumbnail: url, clouds: clouds }));
  }
}

export function* saga() {
  yield all([
    createConcurrentHandler(LOAD_TEST_STATE, handleLoadTestState),
    createConcurrentHandler(LOAD_AVAILABLE_IMAGES, handleLoadAvailableImages),
    createBufferedHandler(ACQUIRE_IMAGE, handleAcquireImage),
    createBufferedHandler(REQUEST_AOI, handleRequestAOI),
    createConcurrentHandler(LOAD_THUMBNAILS, handleLoadThumbnails)
  ]);
}
