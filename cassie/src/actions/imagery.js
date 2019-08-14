/**
 * Loads an image from the specified date, representing the start of the orbital
 * cycle. Will trigger a Saga that downloads it and updates the application's
 * state and the map. As an option, you may provide an array of Layers to be
 * included in conjunction with the image.
 * @param {Object} date the date of the beginning of the orbital cycle
 * @param {...Layer} extras additional layers to be included.
 */
export const loadImage = (date, ...extras) => {
  return {type: "LOAD_IMAGE", date, extras};
}

/**
 * Inserts the specified layer in the desired parent. Will also add an overlay
 * to the map.
 * @param {ConcreteLayer} layer the layer to be inserted
 * @param {Number} parent the index of the parent
 * @param {Number?} position an optional position to place the layer
 */
export const insertLayer = (layer, parent, position) => {
  return {type: "INSERT_LAYER", layer, parent, position};
}

/**
 * Prepares for the insertion of a layer into the state tree, displaying its
 * name and a loading indicator.
 * @param {Layer} layer the layer to be inserted
 * @param {Number} parent the index of the parent
 */
export const prepareLayerInsertion = (layer, parent) => {
  return {type: "PREPARE_LAYER_INSERTION", layer, parent};
}

/**
 * Adds a new layer to the specified parent, created through the application of
 * an expression. Triggers a Saga that carries out the necessary procedures.
 * @param {String} expression the expression to be applied.
 * @param {Number} parent the index of the parent to add the layer to.
 * @param {String} title the title of the new layer.
 * @param {Object} [params={}] the parameters of the new layer.
 */
export const addCustomLayer = (expression, parent, title, params = {}) => {
  return {type: "ADD_CUSTOM_LAYER", parent, expression, title, params};
}

/**
 * Changes the visibility of the specified layer.
 * @param {Number} parent the index of the layer's parent
 * @param {Number} layer the index of the layer
 * @param {Boolean} visible whether or not the layer should be visible
 */
export const changeVisibility = (layer, parent, visible) => {
  return {type: "CHANGE_VISIBILITY", parent, layer, visible}
}

/**
 * ...
 * @param {Number} parent the index of the layer's parent
 * @param {Number} layer the index of the layer
 * @param {Boolean} visible whether or not the layer should be visible
 */
export const generateTransects = (layer, parent, visible) => {
  return {type: "GENERATE_TRANSECTS", parent, layer, visible}
}
