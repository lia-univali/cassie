import { call, select, put, take, all, takeEvery } from "redux-saga/effects";
import {
  generateVisualizationParams,
  applyExpression,
  getSatelliteCollection,
  imageToKey,
  simplify
} from "../common/eeUtils";
import { createImage } from "./operations";
import { Layer } from "../common/classes";
import { makeTriangle } from "../common/utils";
import { cancellable, evaluate } from "./sagaUtils";
import { acquireFromDate } from "../procedures/acquisition";
import {
  generateOrthogonalTransects,
  computeDistance
} from "../procedures/coastline";
import * as Indices from "../common/indices";
import * as Imagery from "../actions/imagery";
import * as Map from "../common/map";

const ee = window.ee;

// Returns the number of layers from the start up to the specified index
function layersUpTo(parent, images) {
  console.log(images);

  return images
    .slice(0, parent + 1)
    .map(image => image.layers.length)
    .reduce((a, b) => a + b);
}

// Finds the index of the specified layer in the parent, counting from the start.
function findLayer(parent, layer, images) {
  return layersUpTo(parent, images) - (images[parent].layers.length - layer);
}

function* onLoadImage() {
  yield takeEvery("LOAD_IMAGE", function* ({ date, extras }) {
    const { geometry, satellite, index } = yield select(state => ({
      geometry: state.acquisition.geometry,
      satellite: state.acquisition.satellite,
      index: state.imagery.images.length - 1
    }));

    const image = acquireFromDate(
      date,
      getSatelliteCollection(satellite),
      geometry
    );

    const layer = new Layer(
      image,
      "Principal",
      generateVisualizationParams(satellite)
    );
    layer.removable = false;

    // Load every image in parallel
    const set = [layer, ...extras].map(v => createImage(v, geometry));
    const result = yield cancellable(all(set));

    if (result === undefined) return;

    for (const value of result) {
      yield put(Imagery.insertLayer(value, index));
    }
  });
}

function lookup(description, state) {
  const index = state.acquisition.lookupTable[imageToKey(description)];

  return ee.Image(state.acquisition.query.toList(1, index).get(0));
}

function* onAddCustomLayer() {
  yield takeEvery("ADD_CUSTOM_LAYER", function* ({
    expression,
    title,
    params,
    parent
  }) {
    // Grab what we need from the state tree
    const { image, bands, geometry, position } = yield select(state => {
      const description = state.imagery.images[parent];

      return {
        image: lookup(description, state),
        bands: state.acquisition.satellite.bands,
        geometry: state.acquisition.geometry,
        position: description.layers.length
      };
    });

    try {
      const modified = applyExpression(image, expression, bands);
      const layer = new Layer(modified, title, params, expression);

      yield put(Imagery.prepareLayerInsertion(layer, parent));

      const result = yield call(createImage, layer, geometry);

      yield put(Imagery.insertLayer(result, parent, position));
    } catch (e) {
      // Handle the error in a better way, eventually
      alert(e);
    }
  });
}

function* onInsertLayer() {
  yield takeEvery("INSERT_LAYER", function* ({ layer, parent }) {
    const index = yield select(
      state => layersUpTo(parent, state.imagery.images) - 1
    );

    console.log("Added at", index);
    Map.addLayer(layer.overlay, index);
  });
}

// Deprecated: I think that this is not used.
function* onChangeVisibility() {
  while (true) {
    const { parent, layer, visible } = yield take("CHANGE_VISIBILITY");

    const { index, opacity } = yield select(state => ({
      index: findLayer(parent, layer, state.imagery.images),
      opacity: state.imagery.images[parent].layers[layer].opacity
    }));

    console.log(index);

    if (visible === true) {
      Map.setOpacity(index, opacity);
    } else {
      Map.setOpacity(index, 0);
    }
  }
}

function* onGenerateTransects() {
  while (true) {
    const { parent, layer, visible } = yield take("GENERATE_TRANSECTS");

    const { index, image, bands, geometry } = yield select(state => ({
      index: findLayer(parent, layer, state.imagery.images),
      image: state.imagery.images[parent].layers[layer].image,
      bands: state.acquisition.satellite.bands,
      geometry: state.acquisition.geometry
    }));

    const imageX = ee
      .Image("LANDSAT/LT05/C01/T1_SR/LT05_220079_19860712", 1521868617067444)
      .clip(geometry);
    //const ndwi = imageX.normalizedDifference(['B2','B4']).clip(geometry);
    const ndwi = applyExpression(
      imageX,
      Indices.expression(Indices.find("NDWI")),
      bands
    );
    //const ndwi = applyExpression(image, Indices.expression(Indices.find("NDWI")), bands);
    const bin = ndwi.gt(0.16);
    let vectors = bin
      .reduceToVectors({
        scale: 10,
        maxPixels: 1e9
      })
      .filterMetadata("label", "equals", 1)
      .sort("count", false);

    image.evaluate(r => {
      console.log("Image: ");
      console.log(r);
    });
    vectors.evaluate(r => {
      console.log("Before simplification Vectors:");
      console.log(r);
    });

    vectors = vectors.map(simplify(60));

    vectors.evaluate(r => {
      console.log("After simplification Vectors:");
      console.log(r);
    });

    vectors = ee.FeatureCollection(
      ee.Feature(
        ee.Geometry.Polygon(
          vectors
            .geometry()
            .coordinates()
            .get(0)
        )
      )
    );

    const vector = ee.Feature(ee.List(vectors.toList(1)).get(0));
    vector.geometry().evaluate(console.log);
    const data = yield evaluate(vector);
    const shape = Map.addShape(
      data.geometry.coordinates,
      "#FF0000",
      0.8,
      false
    );

    const result = generateOrthogonalTransects(vector, 200, 200);

    const actualTransects = result
      .map(dict => ee.Dictionary(dict).get("transects"))
      .flatten();
    actualTransects.evaluate(r => {
      console.log("Flattened");
      console.log(r);
    });

    const ocean = vector.buffer(20, 1);
    const data2 = yield evaluate(ocean);
    Map.addShape(data2.geometry.coordinates, "#00FFFF", 0.8, false);

    const trs = yield evaluate(ee.List(result).slice(64, 65));
    console.log(trs);
    trs.forEach(sub => {
      if (sub.transects !== undefined) {
        sub.transects.forEach(transect => {
          console.log(transect);
          Map.addShape(transect.geometry.coordinates, "#FFFF00", 1, false);
        });
      }

      const triangle = makeTriangle(sub.a, 0.00001);

      Map.addShape([triangle], "#330033", 1, false);
    });
  }
}

export default function* rootSaga() {
  yield all([
    onLoadImage(),
    onInsertLayer(),
    onAddCustomLayer(),
    onChangeVisibility(),
    onGenerateTransects()
  ]);
}
