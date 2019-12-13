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

export default function acquisition(state = initialState, action) {
  switch (action.type) {
    case Types.SET_SATELLITE:
      const { satellite, satelliteIndex } = action;
      return { ...state, satellite, satelliteIndex };

    case Types.SET_AOI:
      const { overlay, geometry, coordinates } = action;
      return { ...state, overlay, geometry, coordinates };

    case Types.SET_AVAILABLE_DATES:
      return reduceAvailableDates(state, action);

    case Types.SET_PERIOD:
      return { ...state, start: action.start, end: action.end };

    case Types.INSERT_METADATA: {
      const metadata = [...state.metadata, {
        ...action.metadata,
        missionName: action.missionName,
        date: action.date
      }]

      return { ...state, metadata };
    }

    case Types.LOAD_THUMBNAILS: {
      return { ...state, metadata: [] };
    }

    default:
      return state;
  }
}

/**
 * Actions
 */
export const Actions = {
  // Defines the satellite to be used for this session.
  setSatellite: satelliteIndex => {
    const satellite = getSatellite(satelliteIndex);
    return { type: Types.SET_SATELLITE, satellite, satelliteIndex };
  },

  // Defines the Area Of Interest to be used for this session.
  setAOI: (overlay, coordinates, geometry) => {
    return { type: Types.SET_AOI, overlay, coordinates, geometry };
  },

  // Retrieves a list of available images based on the current session's parameters.
  loadAvailableImages: () => {
    return { type: Types.LOAD_AVAILABLE_IMAGES };
  },

  // Sets the list of available acquisition dates for the current satellite.
  setAvailableDates: (dates, missions) => {
    return { type: Types.SET_AVAILABLE_DATES, dates, missions };
  },

  // Defines the time period to be used in the image acquisition step
  setPeriod: (start, end) => {
    return { type: Types.SET_PERIOD, start, end };
  },

  // Loads an image from the orbital cycle started at the specified date.
  acquireImage: (missionName, date, ...extras) => {
    return { type: Types.ACQUIRE_IMAGE, missionName, date, extras };
  },

  loadTestState: () => {
    return { type: Types.LOAD_TEST_STATE };
  },

  requestAOI: () => {
    return { type: Types.REQUEST_AOI };
  },

  loadThumbnails: () => {
    return { type: Types.LOAD_THUMBNAILS };
  },

  insertMetadata: (missionName, date, metadata) => {
    return { type: Types.INSERT_METADATA, missionName, date, metadata };
  }
}