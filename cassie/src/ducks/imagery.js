import {
  take,
  takeEvery,
  all,
  select,
  put,
  actionChannel,
  call
} from "redux-saga/effects";
import update from "immutability-helper";
import {
  createBufferedHandler,
  createConcurrentHandler,
  cancellable,
  evaluate
} from "../common/sagaUtils";
import { asPromise, generateColors, interpolateColors } from "../common/utils";
import {
  applyExpression,
  getSatelliteCollection,
  combineReducers
} from "../common/eeUtils";
import { pushResult } from "./results";
import { openAndWait, openDialog } from "./dialog";
import * as Map from "./map";
import { ConcreteLayer } from "../common/classes";
import * as Selectors from "../selectors";
import * as Metadata from "../common/metadata";
import * as Coastline from "../procedures/coastline";
import { extractOcean, generateLayer } from "../procedures/imagery";
import { computeBearing } from "../common/geodesy";
import { acquireFromDate } from "../procedures/acquisition";

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

export const pushImage = (name, date, missionName) => {
  return { type: PUSH_IMAGE, name, date, missionName };
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
            missionName: action.missionName,
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

  let transects = yield call(
    Coastline.generateOrthogonalTransects,
    coordinates,
    spacing,
    extent
  );

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
    Map.addEEFeature(
      enhancedCoastlines,
      "Linhas de Costa",
      colors,
      1,
      identifier
    )
  );
  yield put(
    Map.addEEFeature(
      transectsViz,
      "Transectos",
      lrrColors,
      1,
      Metadata.FeatureType.TRANSECT
    )
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

  const putObjectId = feature => {
    return ee
      .Feature(feature)
      .set("objectid", ee.Feature(feature).get("system:index"));
  };

  const selectProperties = (...properties) => feature => {
    const props = ee.List(properties);
    const cast = ee.Feature(feature);
    return ee.Feature(cast.geometry(), cast.toDictionary(props));
  };

  const shapeTransectData = feature => {
    const cast = ee.Feature(feature);
    const geometry = ee.Geometry(cast.geometry());
    let properties = cast.toDictionary();

    /* insert initial and final coordinates */
    const begin = ee.List(geometry.coordinates().get(0));
    properties = properties.set("LongStart", ee.Number(begin.get(0)));
    properties = properties.set("LatStart", ee.Number(begin.get(1)));

    const end = ee.List(geometry.coordinates().get(1));
    properties = properties.set("LongEnd", ee.Number(end.get(0)));
    properties = properties.set("LatEnd", ee.Number(end.get(1)));

    /* set regression values */
    const trend = ee.Dictionary(properties.get("trend"));
    const r = ee.Number(trend.get("correlation"));

    properties = properties.set("r", r);
    properties = properties.set("rsquared", r.pow(2));
    properties = properties.set("intercept", trend.get("offset"));
    properties = properties.set("slope", trend.get("scale"));

    return ee.Feature(geometry, properties);
  };

  const exportable = {
    shpBaseline: yield evaluate(
      ee
        .FeatureCollection([ee.Geometry.LineString(coordinates)])
        .map(putObjectId)
    ),
    shpCoasts: yield evaluate(
      ee
        .FeatureCollection(enhancedCoastlines)
        .map(selectProperties("date", "mean", "stdDev"))
        .map(putObjectId)
    ),
    shpTransects: yield evaluate(
      ee
        .FeatureCollection(transects)
        .map(shapeTransectData)
        .map(
          selectProperties(
            "LongStart",
            "LongEnd",
            "LatStart",
            "LatEnd",
            "r",
            "rsquared",
            "intercept",
            "slope",
            "epr",
            "lrr",
            "nsm",
            "sce"
          )
        )
        .map(putObjectId)
    )
  };

  yield put(
    pushResult(identifier, {
      transectData,
      coastlineCollection: xx,
      evolution: withColors,
      exportable: {}
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
  const { date, missionName } = yield select(state => state.imagery.images[parent]);

  const mission = satellite.get(missionName);
  const image = mission.algorithms.acquire(date, geometry);

  const modified = applyExpression(image, expression, mission.bands);
  const layer = generateLayer(modified, satellite, name, {});

  yield put(loadLayer(layer, parent));
}

export function* saga() {
  yield all([
    createBufferedHandler(LOAD_LAYER, handleLoadLayer),
    createConcurrentHandler(TOGGLE_VISIBILITY, handleToggleVisibility),
    createConcurrentHandler(UPDATE_OPACITY, handleUpdateOpacity),
    createBufferedHandler(ANALYZE_COASTLINE, handleAnalyzeCoastline),
    createBufferedHandler(REQUEST_EXPRESSION, handleRequestExpression)
  ]);
}
