import * as MapDuck from '../ducks/map'
import { take, all, select, put, race } from 'redux-saga/effects';
import { createConcurrentHandler, createBufferedHandler, evaluate } from '../../common/sagaUtils';
import { findLayerIndex, retrieveShape, retrieveHighlightedShape, retrieveShapeGroup } from '../../selectors';
import * as Map from '../../common/map';

export function* requestAndWait(drawingType, message, name, group) {
  yield put(MapDuck.Actions.requestDrawing(drawingType, message));

  const { completion } = yield race({
    completion: take(MapDuck.Types.COMPLETE_DRAWING),
    cancellation: take(MapDuck.Types.CANCEL_DRAWING),
  });

  if (completion) {
    let geometry = null;
    if (drawingType === 'polyline') {
      geometry = ee.Geometry.LineString(completion.coordinates);
    } else {
      geometry = ee.Geometry.Polygon([completion.coordinates]);
    }

    yield put(MapDuck.Actions.addEEFeature(ee.Feature(geometry), name || drawingType, "#00B3A1", 1, group));
    yield take("END_EVALUATION");
    completion.overlay.setMap(null);
    return completion;
  }

  return {};
}

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

  yield put(MapDuck.Actions.addShapes(shapes, name, group, content));
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

  yield put(MapDuck.Actions.commitHighlight(undefined));
}

function* handleRemoveShape({ index }) {
  const shape = yield select(retrieveShape(index));
  shape.overlays.forEach(overlay => {
    Map.removeShape(overlay);
  });

  yield put(MapDuck.Actions.commitShapeRemoval(index));
}

function* handleRemoveShapeGroup({ group }) {
  const indices = yield select(retrieveShapeGroup(group));
  for (const index of indices.sort((a, b) => b - a)) {
    yield put(MapDuck.Actions.removeShape(index));
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
    createConcurrentHandler(MapDuck.Types.ADD_EE_LAYER, handleAddEELayer),
    createBufferedHandler(MapDuck.Types.ADD_EE_FEATURE, handleAddEEFeature),
    createConcurrentHandler(MapDuck.Types.CHANGE_OPACITY, handleChangeOpacity),
    createBufferedHandler(MapDuck.Types.REQUEST_DRAWING, handleRequestDrawing),
    createConcurrentHandler([MapDuck.Types.CANCEL_DRAWING, MapDuck.Types.COMPLETE_DRAWING], handleDrawingTermination),
    createBufferedHandler(MapDuck.Types.HIGHLIGHT, handleHighlight),
    createBufferedHandler(MapDuck.Types.CLEAR_HIGHLIGHT, handleClearHighlight),
    createConcurrentHandler(MapDuck.Types.REMOVE_SHAPE_GROUP, handleRemoveShapeGroup),
    createBufferedHandler(MapDuck.Types.REMOVE_SHAPE, handleRemoveShape),
    createBufferedHandler(MapDuck.Types.CENTRALIZE_MAP, handleCentralizeMap),
  ]);
}
