import { get as getSatellite } from 'common/satellites';

/**
 * Defines the satellite to be used for this acquisition.
 * @see satellites.js
 * @param {Number} satelliteIndex the index of the satellite
 */
export const setSatellite = (satelliteIndex) => {
  const satellite = getSatellite(satelliteIndex);
  return {type: "SET_SATELLITE", satellite, satelliteIndex};
}

/**
 * Defines the Area Of Interest to be used for this acquisition.
 * @param {*} overlay the overlay from Google Maps
 * @param {Coordinate[]} coordinates the coordinates of the area
 * @param {*} geometry the geometry of the AOI from Earth Engine
 */
export const setAOI = (overlay, coordinates, geometry) => {
  return {type: "SET_AOI", overlay, coordinates, geometry};
}

/**
 * Defines the time period to be used in the image acquisition step
 * @param {Number} start the timestamp of the starting date
 * @param {Number} end the timestamp of the ending date
 */
export const setPeriod = (start, end) => {
  return {type: "SET_PERIOD", start, end};
}

/**
 * Defines the images to be used in the processing step of this acquisition.
 * @param {Object[]} selectedImages the selected images
 */
export const setSelectedImages = (selectedImages) => {
  return {type: "SET_SELECTED_IMAGES", selectedImages};
}

/**
 * Begins downloading the list of available images for the currently selected
 * satellite, storing it in the state afterwards.
 */
export const loadAvailableImages = () => {
  return {type: "LOAD_AVAILABLE_IMAGES"};
}

/**
 * Sets the list of available dates for the current satellite.
 * @param {String[]} dates the list of dates, formatted as YYYY-MM-dd
 */
export const setDates = (dates) => {
  return {type: "SET_DATES", dates};
}

/**
 * Loads the default testing state into the state tree.
 */
export const loadTestState = () => {
  return {type: "LOAD_TEST_STATE"};
}

/**
 * TODO Document
 * @return {[type]} [description]
 */
export const computeCloudScore = (collection, count, offset) => {
  return {type: "COMPUTE_CLOUD_SCORE", collection, count, offset};
}
