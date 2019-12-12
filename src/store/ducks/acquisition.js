import { get as getSatellite } from '../common/satellites';

/**
 * Types
 */
const acquisitionType = (name) => `cassie.acquisition.${name}`

export const Types = {
  SET_SATELLITE: acquisitionType('SET_SATELLITE'),
  SET_AOI: acquisitionType('SET_AOI'),
  SET_PERIOD: acquisitionType('SET_PERIOD'),
  SET_AVAILABLE_DATES: acquisitionType('SET_AVAILABLE_DATES'),
  LOAD_AVAILABLE_IMAGES: acquisitionType('LOAD_AVAILABLE_IMAGES'),
  ACQUIRE_IMAGE: acquisitionType('ACQUIRE_IMAGE'),
  REQUEST_AOI: acquisitionType('REQUEST_AOI'),
  LOAD_TEST_STATE: acquisitionType('LOAD_TEST_STATE'),
  LOAD_THUMBNAILS: acquisitionType('LOAD_THUMBNAILS'),
  INSERT_METADATA: acquisitionType('INSERT_METADATA')
}

/**
 * Actions
 */
export const Creators = {
  // Defines the satellite to be used for this session.
  setSatellite: satelliteIndex => {
    const satellite = getSatellite(satelliteIndex);
    return { type: SET_SATELLITE, satellite, satelliteIndex };
  },

  // Defines the Area Of Interest to be used for this session.
  setAOI: (overlay, coordinates, geometry) => {
    return { type: SET_AOI, overlay, coordinates, geometry };
  },

  // Retrieves a list of available images based on the current session's parameters.
  loadAvailableImages: () => {
    return { type: LOAD_AVAILABLE_IMAGES };
  },

  // Sets the list of available acquisition dates for the current satellite.
  setAvailableDates: (dates, missions) => {
    return { type: SET_AVAILABLE_DATES, dates, missions };
  },

  // Defines the time period to be used in the image acquisition step
  setPeriod: (start, end) => {
    return { type: SET_PERIOD, start, end };
  },

  // Loads an image from the orbital cycle started at the specified date.
  acquireImage: (missionName, date, ...extras) => {
    return { type: ACQUIRE_IMAGE, missionName, date, extras };
  },

  loadTestState: () => {
    return { type: LOAD_TEST_STATE };
  },

  requestAOI: () => {
    return { type: REQUEST_AOI };
  },

  loadThumbnails: () => {
    return { type: LOAD_THUMBNAILS };
  },

  insertMetadata: (missionName, date, metadata) => {
    return { type: INSERT_METADATA, missionName, date, metadata };
  }
}

/**
 * Reducer
 */

const initialState = {
  metadata: [],
  missions: []
};

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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SATELLITE:
      const { satellite, satelliteIndex } = action;
      return { ...state, satellite, satelliteIndex };

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

      return { ...state, metadata };
    }

    case LOAD_THUMBNAILS: {
      return { ...state, metadata: [] };
    }

    default:
      return state;
  }
}