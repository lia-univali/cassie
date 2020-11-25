import { call, all, select, put } from "redux-saga/effects";
import { get as getSatellite } from "../common/satellites";
import { generateLayer, createThumbnail } from "../procedures/imagery";
import {
  createConcurrentHandler,
  createBufferedHandler,
  evaluate
} from "../common/sagaUtils";
import { generateVisualizationParams } from "../common/eeUtils";
import { loadLayer, pushImage } from "./imagery";
import { getAcquisitionParameters, getImageryIdentifiers } from "../selectors";
import { aggregateMissionsDates } from '../common/algorithms'
import i18next from 'i18next'

const SET_SATELLITE = "cassie/acquisition/SET_SATELLITE";
const SET_MISSION_FALLBACK = "cassie/acquisition/SET_MISSION_FALLBACK";
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

// Defines that the main mission cannot be used and use a secondary collection instead
export const setMissionFallback = mission => {
  return { type: SET_MISSION_FALLBACK, mission }
}

// Defines the Area Of Interest to be used for this session.
export const setAOI = (overlay, coordinates, geometry) => {
  return { type: SET_AOI, overlay, coordinates, geometry };
};

// Retrieves a list of available images based on the current session's parameters.
export const loadAvailableImages = () => {
  return { type: LOAD_AVAILABLE_IMAGES };
};

// Sets the list of available acquisition dates for the current satellite.
export const setAvailableDates = (dates, missions) => {
  return { type: SET_AVAILABLE_DATES, dates, missions };
};

// Defines the time period to be used in the image acquisition step
export const setPeriod = (start, end) => {
  return { type: SET_PERIOD, start, end };
};

// Loads an image from the orbital cycle started at the specified date.
export const acquireImage = (missionName, date, ...extras) => {
  return { type: ACQUIRE_IMAGE, missionName, date, extras };
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

export const insertMetadata = (missionName, date, metadata) => {
  return { type: INSERT_METADATA, missionName, date, metadata };
};

const initialState = { metadata: [], missions: [] };

const reduceAvailableDates = (state, action) => {
  if (action.missions !== undefined) {
    return { ...state, availableDates: action.dates, missions: action.missions };
  }
  if (state.missions !== undefined) {
    const available = action.dates;
    let missions = [];

    state.missions.forEach(mission => {
      const dates = mission.dates;
      let filteredDates = {};

      Object.keys(dates).forEach(date => {
        const cur = available.find(value => value.date === date);
        if (cur) {
          filteredDates[date] = dates[date];
        }
      });

      missions.push({
        name: mission.name,
        shortname: mission.shortname,
        dates: filteredDates
      });
    });

    const metadata = state.metadata.filter(meta => {
      return available.find(value => value.date === meta.date && value.name === meta.missionName)
    })

    return { ...state, metadata, availableDates: action.dates, missions };
  }
  return { ...state, availableDates: action.dates };
}

const reduceMissionFallback = (state, action) => {
  if (state.satellite) {
    const { mission } = action;

    const updated = state.satellite.missions.map(m => m.name === mission.name ? mission.fallbackMission : m)
    const satellite = { // revisar
      ...state.satellite, missions: updated, get: (name) => {
        const [first] = updated.filter(mission => mission.name === name)
        return first;
      }
    }

    return { ...state, satellite }
  }
  return state;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SATELLITE:
      const { satellite, satelliteIndex } = action;
      return { ...state, satellite, satelliteIndex };

    case SET_MISSION_FALLBACK:
      return reduceMissionFallback(state, action);

    case SET_AOI:
      const { overlay, geometry, coordinates } = action;
      return { ...state, overlay, geometry, coordinates };

    case SET_AVAILABLE_DATES:
      return reduceAvailableDates(state, action);

    case SET_PERIOD:
      return { ...state, start: action.start, end: action.end };

    case INSERT_METADATA: {
      const metadata = [...state.metadata, {
        ...action.metadata,
        missionName: action.missionName,
        date: action.date
      }]
      /*update(state.metadata, {
        [action.date]: { $set: action.metadata }
      });*/

      return { ...state, metadata };
    }

    case LOAD_THUMBNAILS: {
      return { ...state, metadata: [] };
    }

    default:
      return state;
  }
}

function* handleLoadAvailableImages() {
  const { satellite, geometry } = yield select(getAcquisitionParameters);

  const missions = satellite.missions;

  let availableByMission = [];

  for (let mission of missions) {
    let regionData = {
      name: mission.name,
      shortname: mission.shortname,
      dates: yield evaluate(mission.algorithms.queryAvailable(geometry))
    }

    if (Object.keys(regionData.dates).length === 0 && mission.fallbackMission) {
      yield put(setMissionFallback(mission))

      const fallback = mission.fallbackMission;

      regionData = {
        name: fallback.name,
        shortname: fallback.shortname,
        dates: yield evaluate(fallback.algorithms.queryAvailable(geometry))
      }
    }

    availableByMission.push(regionData);
  }

  const availableDates = aggregateMissionsDates(availableByMission);

  if (availableDates !== undefined) {
    yield put(setAvailableDates(availableDates, availableByMission));
  }
}

function* handleAcquireImage({ missionName, date }) {
  const { geometry, satellite } = yield select(getAcquisitionParameters);
  const { imageId } = yield select(getImageryIdentifiers);

  const mission = satellite.get(missionName);
  const image = mission.algorithms.acquire(date, geometry);

  const layer = generateLayer(image, mission, i18next.t('forms.imageryOverlay.base'));

  yield put(pushImage(mission.shortname + "/" + date, date, mission.name));
  yield put(loadLayer(layer, imageId));
}

function* handleRequestAOI() { }

function* handleLoadThumbnails() {
  const { geometry, satellite, availableDates } = yield select(
    getAcquisitionParameters
  );

  let id = 0;

  for (const entry of availableDates) {
    const mission = satellite.get(entry.name);
    const image = mission.algorithms.acquire(entry.date, geometry);
    const url = yield call(
      createThumbnail,
      image,
      geometry,
      generateVisualizationParams(mission)
    );
    const clouds = yield evaluate(image.get("CLOUDS"));

    yield put(insertMetadata(entry.name, entry.date, { id: id++, thumbnail: url, clouds: clouds }));
  }
}

export function* saga() {
  yield all([
    createConcurrentHandler(LOAD_AVAILABLE_IMAGES, handleLoadAvailableImages),
    createBufferedHandler(ACQUIRE_IMAGE, handleAcquireImage),
    createBufferedHandler(REQUEST_AOI, handleRequestAOI),
    createConcurrentHandler(LOAD_THUMBNAILS, handleLoadThumbnails)
  ]);
}
