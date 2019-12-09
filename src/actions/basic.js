/**
 * Dispatches a raw action with the specified type and data.
 * @param {String} type the type of the action
 * @param {?Object} data the data to be dispatched
 */
export const raw = (type, data) => {
  return {type, ...data};
}

/**
 * Aborts an asynchronous action, such as the download of an image. Sagas that
 * can be aborted are responsible for handling such a case.
 * @see cancellable() in sagaUtils.js
 */
export const abort = () => {
  return {type: "ABORT_REQUEST"};
}

/**
 * Controls the component that displays the status of the system.
 * @param {(String|Boolean)} status The text to show, or false to hide it.
 * @param {Boolean} [cancellable=false] whether or not the ongoing request can be cancelled.
 */
export const updateStatus = (status, cancellable = false) => {
  let payload = {working: status !== false};

  if (payload.working) {
    payload.status = status;
    payload.cancellable = cancellable;
  }

  return {type: "UPDATE_STATUS", ...payload};
}

/**
 * Selects an image from the list of available images. Triggers a Saga that
 * displays the image's outline in the map or removes it.
 * @param {?Number} index the index of the image, or null to clear the selection.
 */
export const selectImage = (index) => {
  return {type: "SELECT_IMAGE", index};
}

/**
 * Creates an image panel, allowing the insertion of layers. Panels that
 * refer to images of the list (i.e. with a non-null index) provide some
 * additional functionalities.
 * @param {?Number} imageIndex the index of the image (or null).
 * @param {String} name the name of the panel.
 */
export const createImagePanel = (imageIndex, name) => {
  return {type: "CREATE_IMAGE_PANEL", payload: {index: imageIndex, name}};
}

/**
 * Adds a new layer to the application's state. The layer's content must have
 * already been downloaded from Earth Engine.
 * @see createImage() in sagas/operations.js
 * @param {ConcreteLayer} layer the layer to be added
 * @param {Number} parent the index of the panel that the layer should belong to.
 */
export const addLayer = (layer, parent) => {
  layer.parentIndex = parent;
  return {type: "ADD_LAYER", layer};
}

/**
 * Updates the opacity of the specified layer, turning the image in the map
 * transparent or opaque.
 * @param {Number} layer the index of the layer
 * @param {Number} opacity the new opacity, from 0 (transparent) to 1 (opaque)
 */
export const updateOpacity = (layer, opacity) => {
  return {type: "UPDATE_OPACITY", layer, opacity};
}

/**
 * Changes the visibility of the specified layer.
 * @param {Number} layer the index of the layer
 * @param {Boolean} visible whether or not the layer should be visible
 */
export const updateVisibility = (layer, visible) => {
  return {type: "UPDATE_VISIBILITY", layer, visible};
}

/**
 * Updates the threshold of a layer, replacing the image in the map with
 * a thresholded version. Use clearThreshold() to restore the original.
 * @param {Number} layer the index of the layer.
 * @param {Number} threshold the threshold to be applied.
 */
export const updateThreshold = (layer, threshold) => {
  return {type: "UPDATE_THRESHOLD", layer, threshold};
}

/**
 * Removes the threshold of the specified layer, restoring its original state.
 * @param {Number} layer the index of the layer
 */
export const clearThreshold = (layer) => {
  return {type: "CLEAR_THRESHOLD", layer};
}

/**
 * Opens a modal dialog that allows the user to select a threshold to be
 * applied to a layer, displaying its histogram.
 * @param {Number} layer the index of the layer
 */
export const solicitThreshold = (layer) => {
  return {type: "SOLICIT_THRESHOLD", layer};
}

/**
 * Adds a new layer to the specified parent, created through the application of
 * an expression. Triggers a Saga that carries out the necessary procedures.
 * @param {Number} parent the image panel to add the layer to.
 * @param {String} expression the expression to be applied.
 * @param {String} name the name of the new layer.
 * @param {Object} [params={}] the parameters of the new layer.
 */
export const addCustomLayer = (parent, expression, name, params = {}) => {
  return {type: "ADD_CUSTOM_LAYER", parent, expression, name, params};
}

/**
 * Resets the application's state to the most basic level, removing every
 * image, clearing the list of available images and, if completely is true,
 * erasing the Region of Interest. Triggers a Saga that does all of that.
 * @param {Boolean} [completely=false] specifies if the reset is total or not.
 */
export const resetData = (completely = false) => {
  return {type: "RESET_DATA", completely};
}

/**
 * Loads an image from the list of available images. Will trigger a Saga
 * that downloads it and updates the application's state and the map. As an
 * option, you may provide an array of Layers to be included in conjunction
 * with the image.
 * @param {Number} index the index of the image to be loaded.
 * @param {...Layer} extras additional layers to be included.
 */
export const loadImage = (index, ...extras) => {
  return {type: "LOAD_IMAGE", index, extras};
}

/**
 * Loads an image from the list of stored area series images. Only works after
 * calling analyzeEvolutionAsChart(), which will download said list. Triggers
 * a Saga that does some preparations and calls loadImage() at least once.
 * @param {Number} index the index of the image in the series list.
 */
export const loadSeriesImage = (index) => {
  return {type: "LOAD_SERIES_IMAGE", index};
}

/**
 * Removes a layer. Triggers a Saga that removes it from the map as well, and
 * another one that does some preparations and removes it from the application's
 * state, as well as removing the parent if it was the last layer.
 * @param {Number} index the index of the layer to be removed.
 */
export const removeLayer = (index) => {
  return {type: "PREPARE_LAYER_REMOVAL", index};
}

/**
 * Removes every layer of the specified image panel, then triggers a Saga
 * to remove the image from the application's state.
 * @param {Number} index the index of the image panel.
 */
export const removeImage = (index) => {
  return {type: "REMOVE_IMAGE_CONTENT", index};
}

/**
 * Clears the Region of Interest. Triggers a Saga that updates the map.
 */
export const removeRegion = () => {
  return {type: "PREPARE_REGION_REMOVAL"};
}

/**
 * Specifies the Region of Interest of the system. Will trigger a Saga
 * that draws the region's polygon on the map.
 * @param {*} geometry the geometry from Google Maps
 * @param {Coordinate[]} coordinates the list coordinates of the region
 */
export const setRegion = (geometry, coordinates) => {
  return {type: "PREPARE_SET_REGION", payload: {geometry, coordinates}};
}

/**
 * Fetches a detailed collection of available images from Earth Engine.
 * Will trigger a Saga that executes the necessary procedures and writes
 * the result to the application's state. Utilizes the current spacecraft
 * and Region of Interest.
 */
export const fetchSatelliteData = () => {
  return {type: "FETCH_SATELLITE_DATA"};
}

/**
 * Specifies the authentication state of the application.
 * @param {Boolean} authenticated whether or not the authentication succeeded
 */
export const setAuthenticationState = (authenticated) => {
  return {type: "SET_AUTHENTICATION_STATE", authenticated};
}

/**
 * Toggles the expanded state of the component that allows the user to modify
 * the filters of the list of available images.
 */
export const toggleFiltersExpanded = () => {
  return {type: "TOGGLE_FILTERS_EXPANDED"};
}

/**
 * Opens a modal dialog that allows the user to choose a satellite. Triggers
 * a Saga that updates the state with the chosen satellite.
 */
export const chooseSatellite = () => {
  return {type: "CHOOSE_SATELLITE"};
}

/**
 * Begins the authentication process, attempting to log in via the OAuth client
 * ID and via popup if the first fails.
 * @param {String} clientId the OAuth client ID
 */
export const beginAuthentication = (clientId) => {
  return {type: "BEGIN_AUTHENTICATION", clientId};
}

/**
 * Revokes the permissions granted by the user, essentially logging out. Will
 * refresh the page.
 */
export const logout = () => {
  return {type: "LOGOUT"};
}

/**
 * Opens a modal that allows the user to create a custom layer for the desired
 * image panel, specifying its name and the expression to be applied. Triggers
 * a Saga to do that.
 * @param {Number} panelIndex the index of the panel
 */
export const beginNewLayerCreation = (panelIndex) => {
  return {type: "BEGIN_LAYER_CREATION", panelIndex};
}

/**
 * Opens a modal that allows the user to combine a layer with another one
 * to carry out various operations, such as computing the difference between
 * the two.
 * @param {Number} primaryIndex the index of the panel to be combined
 */
export const beginCombination = (primaryIndex) => {
  return {type: "BEGIN_COMBINATION", primaryIndex};
}

/**
 * Opens a dialog that allows the user to analyze the evolution of the region
 * in a specified time range in various ways, such as through a chart.
 */
export const beginTemporalAnalysis = () => {
  return {type: "BEGIN_TEMPORAL_ANALYSIS"};
}

/**
 * Requests an analysis of the areas of the image. The analysis will be based
 * on the specified index.
 * @see indices.js
 * @param {Number} imageIndex the index of the image in the list.
 * @param {Index} index the index.
 */
export const analyzeArea = (imageIndex, index) => {
  return {type: "BEGIN_AREA_ANALYSIS", imageIndex, index};
}

/**
 * Requests an analysis of the evolution of the features of the images matching
 * the specified time period, generating a color-coded image that summarizes
 * the growth or decline in intensity of the specified index along the years.
 * @param {Number} begin the timestamp of the beginning of the period.
 * @param {Number} end the timestamp of the end of the period.
 * @param {Index} index the index to base the analysis on.
 */
export const analyzeEvolutionAsImage = (begin, end, index) => {
  return {type: "BEGIN_EVOLUTION_ANALYSIS_IMAGE", begin, end, index};
}

/**
 * Requests an analysis of the evolution of the geographical area in a region
 * matching the specified time period. Utilizes a threshold to determine whether
 * or not a region can be classified as the index that was passed (e.g., a value
 * of > 0.4 for NDVI dictates that the pixel is vegetation). Displays the
 * results of the analysis in a line chart.
 * @param {Number} begin the timestamp of the beginning of the period.
 * @param {Number} end the timestamp of the end of the period.
 * @param {Index} index the index to base the analysis on.
 */
export const analyzeEvolutionAsChart = (begin, end, index) => {
  return {type: "BEGIN_EVOLUTION_ANALYSIS_CHART", begin, end, index};
}

/**
 * Updates the value of the specified filter.
 * @param {String} name the name of the filter
 * @param {*} value the new value of the filter
 */
export const updateFilter = (name, value) => {
  return {type: "UPDATE_FILTER", name, value};
}

/**
 * Highlights the specified shape in the map, making it more opaque and thus
 * easier to notice.
 * @param {*} shape the shape to be highlighted.
 */
export const highlightRegion = (shape) => {
  return {type: "HIGHLIGHT_REGION", shape};
}

/**
 * Turns the highlighted region back to its original state.
 */
export const clearHighlightedRegion = () => {
  return {type: "CLEAR_HIGHLIGHTED_REGION"}
}

/**
 * Removes every region detected by the analyzeArea() process, both from the map
 * and from the application's state. Does nothing it analyzeArea() was not
 * called beforehand.
 */
export const clearDetectedRegions = () => {
  return {type: "PREPARE_CLEAR_DETECTED_REGIONS"};
}
