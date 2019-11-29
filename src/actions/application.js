/**
 * Opens a modal that allows the user to create a custom layer for the desired
 * image, specifying its name and the expression to be applied. Triggers a Saga
 * to do that.
 * @param {Number} parent the index of the image
 */
export const beginNewLayerCreation = (parent) => {
  return {type: "BEGIN_LAYER_CREATION", parent};
}
