import update from 'immutability-helper';

const mapType = (name) => `cassie.map.${name}`

/**
 * Types
 */

export const Types = {
  ADD_EE_LAYER: mapType('ADD_EE_LAYER'),
  ADD_EE_FEATURE: mapType('ADD_EE_FEATURE'),
  REMOVE_SHAPE: mapType('REMOVE_SHAPE'),
  REMOVE_SHAPE_GROUP: mapType('REMOVE_SHAPE_GROUP'),
  CHANGE_OPACITY: mapType('CHANGE_OPACITY'),
  REQUEST_DRAWING: mapType('cassie/map/REQUEST_DRAWING'),
  CANCEL_DRAWING: mapType('CANCEL_DRAWING'),
  COMPLETE_DRAWING: mapType('COMPLETE_DRAWING'),
  CENTRALIZE_MAP: mapType('CENTRALIZE_MAP'),
  ADD_SHAPES: mapType('ADD_SHAPES'),
  HIGHLIGHT: mapType('HIGHLIGHT'),
  CLEAR_HIGHLIGHT: mapType('CLEAR_HIGHLIGHT'),
  COMMIT_HIGHLIGHT: mapType('COMMIT_HIGHTLIGHT'),
  COMMIT_SHAPE_REMOVAL: mapType('COMMIT_SHAPE_REMOVAL')
}

/**
 * Actions
 */

export const Actions = {
  addEELayer: (overlay, identifier, position) => {
    return { type: Types.ADD_EE_LAYER, overlay, identifier, position };
  },

  addEEFeature: (feature, name, color = "#FF0000", opacity = 1, group) => {
    return { type: Types.ADD_EE_FEATURE, feature, name, color, opacity, group };
  },

  changeOpacity: (identifier, opacity) => {
    return { type: Types.CHANGE_OPACITY, identifier, opacity };
  },

  cancelDrawing: () => {
    return { type: Types.CANCEL_DRAWING };
  },

  completeDrawing: (overlay, coordinates) => {
    return { type: Types.COMPLETE_DRAWING, overlay, coordinates };
  },

  requestDrawing: (drawingType, message) => {
    return { type: Types.REQUEST_DRAWING, drawingType, message };
  },

  addShapes: (shapes, name, group = "all", content = null) => {
    return { type: Types.ADD_SHAPES, shapes, name, group, content };
  },

  highlight: (index) => {
    return { type: Types.HIGHLIGHT, index };
  },

  clearHighlight: () => {
    return { type: Types.CLEAR_HIGHLIGHT };
  },

  commitHighlight: (index) => {
    return { type: Types.COMMIT_HIGHLIGHT, index };
  },

  commitShapeRemoval: (index) => {
    return { type: Types.COMMIT_SHAPE_REMOVAL, index };
  },

  removeShape: (index) => {
    return { type: Types.REMOVE_SHAPE, index };
  },

  removeShapeGroup: (group) => {
    return { type: Types.REMOVE_SHAPE_GROUP, group };
  },

  centralizeMap: (coordinates) => {
    return { type: Types.CENTRALIZE_MAP, coordinates };
  }
}

/**
 * Reducer
 */

const initialState = {
  layers: [],
  shapes: [],
  zIndex: 0
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.ADD_EE_LAYER: {
      const layers = update(state.layers, {
        $splice: [[action.position, 0, action.identifier]]
      });

      return { ...state, layers };
    }

    case Types.ADD_SHAPES: {
      const shapes = update(state.shapes, {
        $push: [{ overlays: action.shapes, name: action.name, group: action.group, content: action.content }]
      });

      return { ...state, shapes };
    }

    case Types.ADD_EE_FEATURE: {
      return { ...state, zIndex: state.zIndex + 1 };
    }

    case Types.REQUEST_DRAWING: {
      return { ...state, currentlyDrawing: true, drawingMessage: action.message };
    }

    case Types.COMPLETE_DRAWING:
    case Types.CANCEL_DRAWING: {
      return { ...state, currentlyDrawing: false };
    }

    case Types.COMMIT_HIGHLIGHT: {
      return { ...state, highlighted: action.index };
    }

    case Types.COMMIT_SHAPE_REMOVAL: {
      const shapes = update(state.shapes, {
        $unset: [action.index]
      });

      return { ...state, shapes };
    }

    default: {
      return state;
    }
  }
};