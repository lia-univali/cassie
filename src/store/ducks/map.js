import { take, all, select, put, race } from 'redux-saga/effects';
import { createConcurrentHandler, createBufferedHandler, evaluate } from '../../common/sagaUtils';
import { findLayerIndex, retrieveShape, retrieveHighlightedShape, retrieveShapeGroup } from '../../selectors';
import update from 'immutability-helper';
import * as Map from '../../common/map';

const ADD_EE_LAYER = 'cassie/map/ADD_EE_LAYER';
const ADD_EE_FEATURE = 'cassie/map/ADD_EE_FEATURE';
const REMOVE_SHAPE = 'cassie/map/REMOVE_SHAPE';
const REMOVE_SHAPE_GROUP = 'cassie/map/REMOVE_SHAPE_GROUP';
const CHANGE_OPACITY = 'cassie/map/CHANGE_OPACITY';
const REQUEST_DRAWING = 'cassie/map/REQUEST_DRAWING';
const CANCEL_DRAWING = 'cassie/map/CANCEL_DRAWING';
const COMPLETE_DRAWING = 'cassie/map/COMPLETE_DRAWING';
const CENTRALIZE_MAP = 'cassie/map/CENTRALIZE_MAP';
const ADD_SHAPES = 'cassie/map/ADD_SHAPES';
const HIGHLIGHT = 'cassie/map/HIGHLIGHT';
const CLEAR_HIGHLIGHT = 'cassie/map/CLEAR_HIGHLIGHT';
const COMMIT_HIGHLIGHT = 'cassie/map/COMMIT_HIGHTLIGHT';
const COMMIT_SHAPE_REMOVAL = 'cassie/map/COMMIT_SHAPE_REMOVAL';

export const addEELayer = (overlay, identifier, position) => {
  return { type: ADD_EE_LAYER, overlay, identifier, position };
}

export const addEEFeature = (feature, name, color = "#FF0000", opacity = 1, group) => {
  return { type: ADD_EE_FEATURE, feature, name, color, opacity, group };
}

export const changeOpacity = (identifier, opacity) => {
  return { type: CHANGE_OPACITY, identifier, opacity };
}

export const cancelDrawing = () => {
  return { type: CANCEL_DRAWING };
}

export const completeDrawing = (overlay, coordinates) => {
  return { type: COMPLETE_DRAWING, overlay, coordinates };
}

export const requestDrawing = (drawingType, message) => {
  return { type: REQUEST_DRAWING, drawingType, message };
}

export const addShapes = (shapes, name, group = "all", content = null) => {
  return { type: ADD_SHAPES, shapes, name, group, content };
}

export const highlight = (index) => {
  return { type: HIGHLIGHT, index };
}

export const clearHighlight = () => {
  return { type: CLEAR_HIGHLIGHT };
}

export const commitHighlight = (index) => {
  return { type: COMMIT_HIGHLIGHT, index };
}

export const commitShapeRemoval = (index) => {
  return { type: COMMIT_SHAPE_REMOVAL, index };
}

export const removeShape = (index) => {
  return { type: REMOVE_SHAPE, index };
}

export const removeShapeGroup = (group) => {
  return { type: REMOVE_SHAPE_GROUP, group };
}

export const centralizeMap = (coordinates) => {
  return { type: CENTRALIZE_MAP, coordinates };
}

const ee = window.ee;

export function* requestAndWait(drawingType, message, name, group) {
  yield put(requestDrawing(drawingType, message));

  const { completion } = yield race({
    completion: take(COMPLETE_DRAWING),
    cancellation: take(CANCEL_DRAWING),
  });

  if (completion) {
    let geometry = null;
    if (drawingType === 'polyline') {
      geometry = ee.Geometry.LineString(completion.coordinates);
    } else {
      geometry = ee.Geometry.Polygon([completion.coordinates]);
    }

    yield put(addEEFeature(ee.Feature(geometry), name || drawingType, "#00B3A1", 1, group));
    yield take("END_EVALUATION");
    completion.overlay.setMap(null);
    return completion;
  }

  return {};
}

const initialState = { layers: [], shapes: [], zIndex: 0 };
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EE_LAYER: {
      const layers = update(state.layers, {
        $splice: [[action.position, 0, action.identifier]]
      });

      return { ...state, layers };
    }

    case ADD_SHAPES: {
      const shapes = update(state.shapes, {
        $push: [{ overlays: action.shapes, name: action.name, group: action.group, content: action.content }]
      });

      return { ...state, shapes };
    }

    case ADD_EE_FEATURE: {
      return { ...state, zIndex: state.zIndex + 1 };
    }

    case REQUEST_DRAWING: {
      return { ...state, currentlyDrawing: true, drawingMessage: action.message };
    }

    case COMPLETE_DRAWING:
    case CANCEL_DRAWING: {
      return { ...state, currentlyDrawing: false };
    }

    case COMMIT_HIGHLIGHT: {
      return { ...state, highlighted: action.index };
    }

    case COMMIT_SHAPE_REMOVAL: {
      const shapes = update(state.shapes, {
        $unset: [action.index]
      });

      return { ...state, shapes };
    }

    default: {
      return state;
    }
  }
}

export default reducer

function* handleAddEELayer({ overlay, position }) {
  Map.addLayer(overlay, position);
}

function* handleAddEEFeature({ feature, name, color, opacity, group }) {
  const collection = ee.FeatureCollection(feature);
  const list = ee.List(collection.toList(collection.size()));

  const content = yield evaluate(list);

  const colors = Array.isArray(color) ? color : [color];
  let colorIndex = 0;

  const shapes = content.map(element => {
    const shape = Map.addShape(element, colors[colorIndex], opacity, group);

    if (colorIndex < colors.length - 1) {
      colorIndex++;
    }

    return shape;
  });

  yield put(addShapes(shapes, name, group, content));
}

function* handleChangeOpacity({ identifier, opacity }) {
  const index = yield select(findLayerIndex(identifier));

  Map.setOpacity(index, opacity);
}

function* handleRequestDrawing({ drawingType }) {
  Map.setDrawingControlsVisible(false);
  Map.setDrawingMode(drawingType);
}

function* handleDrawingTermination() {
  Map.setDrawingMode(null);
}

function* handleHighlight({ index }) {
  const shape = yield select(retrieveShape(index))

  shape.overlays.forEach(overlay => {
    Map.highlightShape(overlay)
  });

  yield put(commitHighlight(index));
}

//Should probably debounce this.
function* handleClearHighlight() {
  const shape = yield select(retrieveHighlightedShape);

  shape.overlays.forEach(overlay => {
    Map.clearHighlight(overlay);
  });

  yield put(commitHighlight(undefined));
}

function* handleRemoveShape({ index }) {
  const shape = yield select(retrieveShape(index));
  shape.overlays.forEach(overlay => {
    Map.removeShape(overlay);
  });

  yield put(commitShapeRemoval(index));
}

function* handleRemoveShapeGroup({ group }) {
  const indices = yield select(retrieveShapeGroup(group));
  for (const index of indices.sort((a, b) => b - a)) {
    yield put(removeShape(index));
  }
}

function* handleCentralizeMap({ coordinates }) {
  const bounds = new window.google.maps.LatLngBounds();
  coordinates.forEach(([lng, lat]) => bounds.extend({ lat, lng }));

  const center = bounds.getCenter();
  Map.centralize(center.lat(), center.lng());
}

export function* saga() {
  yield all([
    createConcurrentHandler(ADD_EE_LAYER, handleAddEELayer),
    createBufferedHandler(ADD_EE_FEATURE, handleAddEEFeature),
    createConcurrentHandler(CHANGE_OPACITY, handleChangeOpacity),
    createBufferedHandler(REQUEST_DRAWING, handleRequestDrawing),
    createConcurrentHandler([CANCEL_DRAWING, COMPLETE_DRAWING], handleDrawingTermination),
    createBufferedHandler(HIGHLIGHT, handleHighlight),
    createBufferedHandler(CLEAR_HIGHLIGHT, handleClearHighlight),
    createConcurrentHandler(REMOVE_SHAPE_GROUP, handleRemoveShapeGroup),
    createBufferedHandler(REMOVE_SHAPE, handleRemoveShape),
    createBufferedHandler(CENTRALIZE_MAP, handleCentralizeMap),
  ]);
}
