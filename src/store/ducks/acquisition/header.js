import duckify from "../../tools/duckify";
import { get as getSatellite } from "../../../common/satellites";

export const namespace = "cassie";
export const store = "acquisition";

export const Types = duckify(namespace, store, [
  "SET_SATELLITE",
  "SET_MISSION_FALLBACK",
  "SET_AOI",
  "SET_PERIOD",
  "SET_AVAILABLE_DATES",
  "LOAD_AVAILABLE_IMAGES",
  "ACQUIRE_IMAGE",
  "REQUEST_AOI",
  "LOAD_TEST_STATE",
  "LOAD_THUMBNAILS",
  "INSERT_METADATA",
]);

export const Actions = {
  /**
   * Defines the satellite to be used for this acquisition.
   * @see satellites.js
   * @param {Number} satelliteIndex the index of the satellite
   */
  setSatellite: (satelliteIndex) => ({
    type: Types.SET_SATELLITE,
    payload: {
      satellite: getSatellite(satelliteIndex),
      satelliteIndex,
    },
  }),

  /**
   * Defines that the main mission cannot be used and use a secondary collection instead
   */
  setMissionFallback: (mission) => ({
    type: Types.SET_MISSION_FALLBACK,
    payload: { mission },
  }),

  /**
   * Defines the Area Of Interest to be used for this acquisition.
   * @param {*} overlay the overlay from Google Maps
   * @param {Coordinate[]} coordinates the coordinates of the area
   * @param {*} geometry the geometry of the AOI from Earth Engine
   */
  setAOI: (overlay, coordinates, geometry) => ({
    type: Types.SET_AOI,
    payload: { overlay, coordinates, geometry },
  }),

  /**
   * Begins downloading the list of available images for the currently selected
   * satellite, storing it in the state afterwards.
   */
  loadAvailableImages: () => ({
    type: Types.LOAD_AVAILABLE_IMAGES,
  }),

  /**
   * Sets the list of available dates for the current satellite.
   * @param {String[]} dates the list of dates, formatted as YYYY-MM-dd
   */
  setAvailableDates: (dates, missions) => ({
    type: Types.SET_AVAILABLE_DATES,
    payload: { dates, missions },
  }),

  /**
   * Defines the time period to be used in the image acquisition step
   * @param {Number} start the timestamp of the starting date
   * @param {Number} end the timestamp of the ending date
   */
  setPeriod: (start, end) => ({
    type: Types.SET_PERIOD,
    payload: { start, end },
  }),

  // Loads an image from the orbital cycle started at the specified date.
  acquireImage: (missionName, date, ...extras) => ({
    type: Types.ACQUIRE_IMAGE,
    payload: { missionName, date, extras },
  }),

  requestAOI: () => ({
    type: Types.REQUEST_AOI,
  }),

  loadThumbnails: () => ({
    type: Types.LOAD_THUMBNAILS,
  }),

  insertMetadata: (missionName, date, metadata) => ({
    type: Types.INSERT_METADATA,
    payload: { missionName, date, metadata },
  }),

  /**
   * Loads the default testing state into the state tree.
   */
  loadTestState: () => ({
    type: Types.LOAD_TEST_STATE,
  }),
};

export default Actions;
