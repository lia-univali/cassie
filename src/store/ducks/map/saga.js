import { take, all, select, put, race } from "redux-saga/effects";
import { ee } from "../../../services/earth-engine";

import {
  concurrentHandler,
  bufferedHandler,
  evaluate,
} from "../../tools/effects";
import { Types, Actions } from "./header";
import * as Map from "../../../common/map";

import {
  findLayerIndex,
  retrieveShape,
  retrieveHighlightedShape,
  retrieveShapeGroup,
} from "../../../selectors";

export const requestAndWait = function* (drawingType, message, name, group) {
  yield put(Actions.requestDrawing(drawingType, message));

  const { completion } = yield race({
    completion: take(Types.COMPLETE_DRAWING),
    cancellation: take(Types.CANCEL_DRAWING),
  });

  if (completion) {
    const {
      payload: { overlay, coordinates },
    } = completion;

    const geometry =
      drawingType === "polyline"
        ? ee.Geometry.LineString(coordinates)
        : ee.Geometry.Polygon([coordinates]);

    yield put(
      Actions.addEEFeature(
        ee.Feature(geometry),
        name || drawingType,
        "#00B3A1",
        1,
        group
      )
    );
    yield take("DONE");

    overlay.setMap(null);

    return completion.payload;
  }

  return {};
};

const handleAddEELayer = function* ({ payload: { overlay, position } }) {
  Map.addLayer(overlay, position);
};

const handleAddEEFeature = function* ({
  payload: { feature, name, color, opacity, group },
}) {
  const collection = ee.FeatureCollection(feature);
  const list = ee.List(collection.toList(collection.size()));

  const content = yield evaluate(list);

  const colors = Array.isArray(color) ? color : [color];
  let colorIndex = 0;

  const shapes = content.map((element) => {
    const shape = Map.addShape(element, colors[colorIndex], opacity, group);

    if (colorIndex < colors.length - 1) {
      colorIndex++;
    }

    return shape;
  });

  yield put(Actions.addShapes(shapes, name, group, content));
};

const handleChangeOpacity = function* ({ payload: { identifier, opacity } }) {
  const index = yield select(findLayerIndex(identifier));

  Map.setOpacity(index, opacity);
};

const handleRequestDrawing = function* ({ payload: { drawingType } }) {
  Map.setDrawingControlsVisible(false);
  Map.setDrawingMode(drawingType);
};

const handleDrawingTermination = function* () {
  Map.setDrawingMode(null);
};

const handleHighlight = function* ({ payload: { index } }) {
  const shape = yield select(retrieveShape(index));

  shape.overlays.forEach((overlay) => {
    Map.highlightShape(overlay);
  });

  yield put(Actions.commitHighlight(index));
};

const handleClearHighlight = function* () {
  const shape = yield select(retrieveHighlightedShape);

  shape.overlays.forEach((overlay) => {
    Map.clearHighlight(overlay);
  });

  yield put(Actions.commitHighlight(undefined));
};

const handleRemoveShape = function* ({ payload: { index } }) {
  const shape = yield select(retrieveShape(index));
  shape.overlays.forEach((overlay) => {
    Map.removeShape(overlay);
  });

  yield put(Actions.commitShapeRemoval(index));
};

const handleRemoveShapeGroup = function* ({ payload: { group } }) {
  const indices = yield select(retrieveShapeGroup(group));
  for (const index of indices.sort((a, b) => b - a)) {
    yield put(Actions.removeShape(index));
  }
};

const handleCentralizeMap = function* ({ payload: { coordinates } }) {
  const bounds = new window.google.maps.LatLngBounds();
  coordinates.forEach(([lng, lat]) => bounds.extend({ lat, lng }));

  const center = bounds.getCenter();
  Map.centralize(center.lat(), center.lng());
};

const root = function* () {
  yield all([
    concurrentHandler(Types.ADD_EE_LAYER, handleAddEELayer),
    bufferedHandler(Types.ADD_EE_FEATURE, handleAddEEFeature),
    concurrentHandler(Types.CHANGE_OPACITY, handleChangeOpacity),
    bufferedHandler(Types.REQUEST_DRAWING, handleRequestDrawing),
    concurrentHandler(
      [Types.CANCEL_DRAWING, Types.COMPLETE_DRAWING],
      handleDrawingTermination
    ),
    bufferedHandler(Types.HIGHLIGHT, handleHighlight),
    bufferedHandler(Types.CLEAR_HIGHLIGHT, handleClearHighlight),
    concurrentHandler(Types.REMOVE_SHAPE_GROUP, handleRemoveShapeGroup),
    bufferedHandler(Types.REMOVE_SHAPE, handleRemoveShape),
    bufferedHandler(Types.CENTRALIZE_MAP, handleCentralizeMap),
  ]);
};

export default root;
