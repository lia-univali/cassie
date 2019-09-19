import {
  take,
  takeEvery,
  all,
  select,
  put,
  actionChannel,
  call
} from "redux-saga/effects";
import isString from "lodash/isString";
import update from "immutability-helper";
import {
  createBufferedHandler,
  createConcurrentHandler,
  cancellable,
  evaluate
} from "common/sagaUtils";
import { asPromise, generateColors, interpolateColors } from "common/utils";
import {
  applyExpression,
  getSatelliteCollection,
  combineReducers
} from "common/eeUtils";
import { pushResult } from "./results";
import { openAndWait, openDialog } from "./dialog";
import * as Map from "./map";
import { ConcreteLayer } from "common/classes";
import * as Selectors from "selectors";
import * as Metadata from "common/metadata";
import * as Coastline from "procedures/coastline";
import { extractOcean, generateLayer } from "procedures/imagery";
import { computeBearing } from "common/geodesy";
import { acquireFromDate } from "procedures/acquisition";
import { otsuThreshold } from '../common/algorithms';

const ee = window.ee;

const PUSH_IMAGE = "cassie/imagery/PUSH_IMAGE";
const LOAD_LAYER = "cassie/imagery/LOAD_LAYER";
const PUSH_LAYER = "cassie/imagery/PUSH_LAYER";
const SET_BASELINE = "cassie/imagery/SET_BASELINE";
const TOGGLE_VISIBILITY = "cassie/imagery/TOGGLE_VISIBILITY";
const UPDATE_OPACITY = "cassie/imagery/UPDATE_OPACITY";
const GENERATE_TRANSECTS = "cassie/imagery/GENERATE_TRANSECTS";
const COMMIT_CHANGE = "cassie/imagery/COMMIT_CHANGE";
const ANALYZE_COASTLINE = "cassie/imagery/ANALYZE_COASTLINE";
const REQUEST_EXPRESSION = "cassie/imagery/REQUEST_EXPRESSION";

export const pushImage = (name, date) => {
  return { type: PUSH_IMAGE, name, date };
};

export const analyzeCoastline = () => {
  return { type: ANALYZE_COASTLINE };
};
// Retrieves the image represented by the specified layers and adds to the parent.
// If parent is a String, a parent with be created with that name.
export const loadLayer = (layer, parent = "???") => {
  return { type: LOAD_LAYER, layer, parent };
};

const pushLayer = (layer, parent) => {
  return { type: PUSH_LAYER, layer, parent };
};

export const setBaseline = coordinates => {
  const baseline = ee.List(coordinates);
  return { type: SET_BASELINE, baseline };
};

export const toggleVisibility = identifier => {
  return { type: TOGGLE_VISIBILITY, identifier };
};

export const updateOpacity = (identifier, opacity) => {
  return { type: UPDATE_OPACITY, identifier, opacity };
};

export const generateTransects = identifier => {
  return { type: GENERATE_TRANSECTS, identifier };
};

export const requestExpression = parent => {
  return { type: REQUEST_EXPRESSION, parent };
};

const commitChange = (layer, data) => {
  return { type: COMMIT_CHANGE, layer, data };
};

function alterLayer(state, parent, layer, data) {
  return update(state.images, {
    [parent]: {
      layers: {
        [layer]: {
          $merge: data
        }
      }
    }
  });
}

const initialState = {
  images: {},
  imageId: 0,
  layerId: 0
};

export default function reducer(state = initialState, action) {
  //const { parent, layer, type } = action;

  switch (action.type) {
    case PUSH_IMAGE: {
      const images = update(state.images, {
        [state.imageId]: {
          $set: {
            name: action.name,
            date: action.date,
            layers: {}
          }
        }
      });

      return { ...state, images, imageId: state.imageId + 1 };
    }

    case PUSH_LAYER: {
      const images = update(state.images, {
        [action.parent]: {
          layers: { [state.layerId]: { $set: action.layer } }
        }
      });

      return { ...state, images, layerId: state.layerId + 1 };
    }

    case COMMIT_CHANGE: {
      const parent = Selectors.findLayerParent(action.layer)(state, true);
      const images = alterLayer(state, parent, action.layer, action.data);

      return { ...state, images };
    }

    case SET_BASELINE: {
      return { ...state, baseline: action.baseline };
    }

    default:
      return state;
  }
}

function* handleLoadLayer({ layer, parent }) {
  const { imageId, layerId } = yield select(Selectors.getImageryIdentifiers);

  if (isNaN(parent)) {
    yield put(pushImage(parent));
    parent = imageId;
  }

  let { image, params } = layer;

  yield put({ type: "BEGIN_EVALUATION" });
  const info = yield call(asPromise, image.getMap.bind(image), params);
  yield put({ type: "END_EVALUATION" });

  const source = new ee.layers.EarthEngineTileSource(
    "https://earthengine.googleapis.com/map",
    info.mapid,
    info.token
  );
  const overlay = new ee.layers.ImageOverlay(source, {});
  const concrete = new ConcreteLayer(layer, overlay);
  const position = yield select(Selectors.computeInsertionIndex(parent));

  yield put(pushLayer(concrete, parent));
  yield put(Map.addEELayer(overlay, layerId, position));
}

function* handleToggleVisibility({ identifier }) {
  const layer = yield select(Selectors.getLayer(identifier));

  const newVisibility = layer.visible ? 0 : 1;

  yield put(Map.changeOpacity(identifier, newVisibility));
  yield put(commitChange(identifier, { visible: newVisibility }));
}

function* handleUpdateOpacity({ identifier, opacity }) {
  yield put(Map.changeOpacity(identifier, opacity));
  yield put(commitChange(identifier, { opacity }));
}

function* requestCoastlineInput() {
  const dates = yield* openAndWait("imageSelection");

  if (!Array.isArray(dates)) {
    return null;
  }

  const { coordinates, overlay } = yield* Map.requestAndWait(
    "polyline",
    "Desenhe a linha de base.",
    "Linha de Base",
    "coastlineData"
  );

  if (coordinates === undefined) {
    return null;
  }

  const { spacing, extent, threshold } = yield* openAndWait("coastlineConfig");

  if (spacing === undefined) {
    overlay.setMap(null);
    return null;
  }

  const baseline = yield select(Selectors.retrieveShapeByName("Linha de Base"));
  baseline.content = baseline.content[0].geometry.coordinates;

  yield put(pushResult("baselineData", { baseline }));

  return {
    dates,
    coordinates,
    spacing: parseInt(spacing, 10),
    extent: parseInt(extent, 10),
    threshold: parseFloat(threshold)
  };
}

function* handleAnalyzeCoastline() {
  const identifier = "coastlineData";

  yield put(Map.removeShapeGroup(identifier));

  const input = yield* requestCoastlineInput();
  if (input === null) return;

  const { coordinates, spacing, extent, dates, threshold } = input;

  const { satellite, geometry } = yield select(
    Selectors.getAcquisitionParameters
  );

  const bufferedBaseline = ee.Geometry.LineString(coordinates).buffer(
    extent / 2
  );

  const coastlines = yield call(
    Coastline.computeCoastlines,
    dates,
    satellite,
    bufferedBaseline,
    threshold
  );

  let transects = yield call(Coastline.generateOrthogonalTransects, coordinates, spacing, extent);

  transects = yield call(Coastline.addDistances, transects, coastlines);

  const lrrs = yield evaluate(transects.map(x => ee.Feature(x).get("lrr")));

  const transectsViz = yield call(Coastline.expandHorizontally, transects, 10);

  const enhancedCoastlines = yield call(
    Coastline.mapToSummary,
    transects,
    coastlines,
    bufferedBaseline
  );

  const lrrColors = interpolateColors(lrrs, "#00FF00", "#DF0000");

  const colors = generateColors(dates.length, 66);
  yield put(
    Map.addEEFeature(enhancedCoastlines, "Linhas de Costa", colors, 1, identifier)
  );
  yield put(
    Map.addEEFeature(transectsViz, "Transectos", lrrColors, 1, Metadata.FeatureType.TRANSECT)
  );

  const finalQuery = ee
    .List(enhancedCoastlines.toList(enhancedCoastlines.size()))
    .map(poly => {
      return ee.Feature(poly).toDictionary(["date", "mean", "stdDev"]);
    });

  const xx = yield evaluate(enhancedCoastlines);

  const [evolutionData, transectData, coastlineCollection] = yield evaluate(
    ee.List([finalQuery, transects, coastlines])
  );

  const withColors = evolutionData.map((row, i) => ({
    ...row,
    color: colors[i]
  }));

  const exportable = {
    collection: yield evaluate(
      ee
        .FeatureCollection(enhancedCoastlines)
        .merge(ee.FeatureCollection(transects))
        .merge(ee.Feature(ee.Geometry.LineString(coordinates)))
    )
  };

  yield put(
    pushResult(identifier, {
      transectData,
      coastlineCollection: xx,
      evolution: withColors,
      exportable
    })
  );

  yield put(openDialog("coastlineEvolution"));
}

function* handleRequestExpression({ parent }) {
  const { name, expression } = yield* openAndWait("newLayer");

  if (expression === undefined) {
    return;
  }

  const { geometry, satellite } = yield select(
    Selectors.getAcquisitionParameters
  );
  const date = yield select(state => state.imagery.images[parent].date);
  const image = acquireFromDate(
    date,
    getSatelliteCollection(satellite),
    geometry
  );

  const modified = applyExpression(image, expression, satellite.bands);
  const layer = generateLayer(modified, satellite, name, {});

  console.log(parent);
  yield put(loadLayer(layer, parent));
}

export function* saga() {
  yield all([
    createBufferedHandler(LOAD_LAYER, handleLoadLayer),
    createConcurrentHandler(TOGGLE_VISIBILITY, handleToggleVisibility),
    createConcurrentHandler(UPDATE_OPACITY, handleUpdateOpacity),
    //createConcurrentHandler(GENERATE_TRANSECTS, handleGenerateTransects),
    createBufferedHandler(ANALYZE_COASTLINE, handleAnalyzeCoastline),
    createBufferedHandler(REQUEST_EXPRESSION, handleRequestExpression)
  ]);
}
