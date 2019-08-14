/**
 * A geographic coordinate, of the form [lng, lat].
 * @typedef {Number[]} Coordinate
 */

/**
 * An index that can be applied to an image to transform it.
 * @typedef {Object} Index
 * @property {String} expression the expression of the index.
 * @property {String} label the name of the index.
 * @property {Object} params the visualization parameters for the index.
 */



/**
 * An abstract layer, containing enough information to be passed into Earth
 * Engine's API and transformed into a concrete layer.
 */
export class Layer {
  /**
   * Creates a new abstract layer.
   * @param {*} image the representation of an image from Earth Engine.
   * @param {String} title the title (label) of the layer.
   * @param {Object} [params={}] the visualization parameters of the image
   * @param {String} [expression=undefined] the expression that optionally transforms the image
   * @param {Boolean} [removable=true] whether or not the layer can be removed
   */
  constructor(image, title, params = {}, expression = undefined, removable = true) {
    this.image = image;
    this.title = title;
    this.params = params;
    this.expression = expression;
    this.removable = removable;
  }
}

/**
 * A class that represents a concrete layer, ready to be displayed in the map.
 * @extends Layer
 */
export class ConcreteLayer extends Layer {
  /**
   * Creates a new concrete layer.
   * @param {Layer} base the original, abstract layer (to be merged into this instance)
   * @param {*} overlay the map overlay of the layer
   * @param {Object} histogram the histogram of the image, obtained from Earth Engine
   * @param {Number} parentIndex the image panel that contains this layer
   * @param {Number} [opacity=1] the opacity of the layer, from 0 (transparent) to 1 (opaque)
   * @param {Boolean} [visible=true] whether or not this layer is visible
   */
  constructor(base, overlay, histogram, parentIndex, opacity = 1, visible = true) {
    super(base.image, base.title, base.params, base.expression);

    this.overlay = overlay;
    this.histogram = histogram;
    this.parentIndex = parentIndex;
    this.opacity = opacity;
    this.visible = visible;
  }
}
