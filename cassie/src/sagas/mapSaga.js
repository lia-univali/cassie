import { select, put, take, race, all } from 'redux-saga/effects';
import { clearDetectedRegions, updateVisibility, raw } from '../actions/basic';
import lastItem from 'lodash/last';
import * as Map from '../common/map';

const ee = window.ee;

function* addLayerWatcher() {
  while (true) {
    const { layer } = yield take("ADD_LAYER");
    const layers = yield select(state => state.data.images[layer.parentIndex].layers);

    Map.addLayer(layer.overlay, lastItem(layers));
  }
}

function* removeLayerWatcher() {
  while (true) {
    const { index } = yield take("REMOVE_LAYER");
    Map.removeLayer(index);
  }
}

function* placeOverlayWatcher() {
  while (true) {
    let { layer, overlay } = yield take("PLACE_OVERLAY");
    const visible = yield select(state => state.data.layers[layer].visible);

    if (overlay === undefined) {
      // Let's restore the original
      overlay = yield select(state => state.data.layers[layer].overlay);
    }

    Map.replaceLayer(layer, overlay);

    yield put(updateVisibility(layer, visible));
  }
}

function* removeRegionWatcher() {
  while (true) {
    yield take("PREPARE_REGION_REMOVAL");
    const geometry = yield select(state => state.data.region.geometry);

    geometry.setMap(null);

    Map.setDrawingControlsVisible(true);
    yield put({ type: "REMOVE_REGION" });

    yield put(clearDetectedRegions());
  }
}

function* setRegionWatcher() {
  while (true) {
    const { payload } = yield take("PREPARE_SET_REGION");
    const eeGeometry = ee.Geometry.Polygon([payload.coordinates]);

    Map.setDrawingControlsVisible(false);
    yield put({ type: "SET_REGION", payload: { geometry: payload.geometry, eeGeometry } });
  }
}

function* selectImageWatcher() {
  while (true) {
    const { index } = yield take("SELECT_IMAGE");

    if (index === null) {
      Map.clearOutline();
    } else {
      const footprint = yield select(state => state.data.satelliteData
        ? state.data.satelliteData.features[index].properties["system:footprint"]
        : undefined
      );

      if (footprint !== undefined) {
        Map.drawOutline(footprint.coordinates);
      }
    }
  }
}

function* visibilityWatcher() {
  while (true) {
    const { layer, visible } = yield take("UPDATE_VISIBILITY");

    let opacity = 0;
    if (visible) {
      opacity = yield select(state => state.data.layers[layer].opacity);
    }

    Map.setOpacity(layer, opacity);
  }
}

function* opacityWatcher() {
  while (true) {
    const { layer, opacity } = yield take("UPDATE_OPACITY");
    const visible = yield select(state => state.data.layers[layer].visible);

    if (visible) {
      Map.setOpacity(layer, opacity);
    }
  }
}

function* highlightWatcher() {
  while (true) {
    const { set } = yield race({
      set: take("HIGHLIGHT_REGION"),
      clear: take("CLEAR_HIGHLIGHTED_REGION"),
    });

    if (set) {
      Map.highlightShape(set.shape);
    } else {
      Map.clearHighlight();
    }
  }
}

function* shapeAssignmentWatcher() {
  while (true) {
    const { regions } = yield take("PREPARE_SHAPES");

    const shapes = regions.map(region => {
      const isMulti = region.geometry.type === "MultiPolygon";

      return Map.addShape(region.geometry.coordinates, region.color, 0.8, isMulti);
    });

    yield put(raw("ASSIGN_SHAPES", { shapes }));
  }
}

function* clearRegionsWatcher() {
  while (true) {
    yield take("PREPARE_CLEAR_DETECTED_REGIONS");
    const regionData = yield select(state => state.data.detectedRegions);

    if (regionData) {
      regionData.shapes.forEach(shape => {
        Map.removeShape(shape);
      });

      yield put(raw("CLEAR_DETECTED_REGIONS"));
    }
  }
}

export default function* rootSaga() {
  yield all([
    opacityWatcher(),
    addLayerWatcher(),
    setRegionWatcher(),
    highlightWatcher(),
    visibilityWatcher(),
    removeLayerWatcher(),
    selectImageWatcher(),
    placeOverlayWatcher(),
    removeRegionWatcher(),
    clearRegionsWatcher(),
    shapeAssignmentWatcher(),
  ]);
}
