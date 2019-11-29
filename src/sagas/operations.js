// Operations related to Google Earth Engine that do not need
// to communicate with Redux (neither writes nor reads).
// All functions either are Generators or return a Promise (alternatively,
// some might return the GEE query itself to allow for additional flexibility).
// Saga effects are used merely to provide better readability.
// WARNING: Do NOT use the select() or put() effects in this file.
// If there is a ever a need to do that, the function should probably
// be a "chapter" of a saga or a saga itself.

import mathjs from 'mathjs';
import { call, all } from 'redux-saga/effects';
import {
  asPromise, firstValue, organizeHierarchically, hasKeys,
  selectKey, cloneClass
} from '../common/utils';
import { evaluate } from './sagaUtils';
import { ConcreteLayer } from '../common/classes';

const ee = window.ee;

export function* computeMinimax(image, params = {}) {
  const query = image.reduceRegion({
    reducer: ee.Reducer.min().combine(ee.Reducer.max(), "", true),
    scale: params.scale,
    geometry: params.geometry || image.geometry(),
    maxPixels: 1E12
  });

  // Keys of the result are of the format [<bandname>_<min/max>]. Organize it hierarchically.
  const result = yield evaluate(query);
  return organizeHierarchically(result, "_");
}

export function* getOverlay(image, params = {}) {
  console.log(params);

  if (!hasKeys(params, "min", "max") && !hasKeys(params, "gain")) {
    // Automatically compute the minimum and maximum values
    const mm = yield call(computeMinimax, image, { scale: 120 });

    console.log("Min max", mm);

    if ("bands" in params) {
      // Compute the mean of the min and max values of the bands to be displayed
      const values = params.bands.map(band => mm[band]);
      params.min = mathjs.mean(selectKey(values, "min"));
      params.max = mathjs.mean(selectKey(values, "max"));
    } else {
      // If no band was chosen, assume the first one
      params = { ...params, ...firstValue(mm) };
    }
  }

  const info = yield asPromise(image.getMap.bind(image), params);

  return new ee.MapLayerOverlay("https://earthengine.googleapis.com/map",
    info.mapid, info.token, {});
}

export function createHistogram(image, params) {
  const query = image.reduceRegion({
    reducer: ee.Reducer.histogram(),
    scale: params.scale,
    geometry: params.geometry || image.geometry(),
    maxPixels: 1E12
  });

  return evaluate(query);
}

export function vectorizeImage(image, threshold, params, promise = true) {
  const query = image.gte(threshold).reduceToVectors({
    geometry: params.geometry || image.geometry(),
    geometryType: "polygon",
    eightConnected: false,
    scale: params.scale,
    maxPixels: 1E12
  }).filterMetadata("label", "equals", 1)
    .map(feature => feature.set({ area: feature.geometry().area(1) }));

  return promise ? evaluate(query) : query;
}

export function computeAreas(images, threshold, bandName, promise = true) {
  const query = images.map(image => {
    // Transform the raster image to a collection of vectors
    const measured = image.select(bandName);
    const vectors = vectorizeImage(measured, threshold, { scale: 10 }, false);

    // Compute the sum of the areas of the features
    const totalArea = vectors.reduceColumns(ee.Reducer.sum(), ["area"]).get("sum");

    // Iterate over the features, specifying a color index
    const initial = ee.List([]);
    const featureList = vectors.iterate((current, last) => {
      const list = ee.List(last);
      const value = ee.Algorithms.If(
        list.length().eq(0),
        ee.Number(0),
        ee.Number(ee.Feature(list.get(-1)).get("color"))
      );

      // Adds the feature to the list, with an additional property: color.
      return list.add(
        current.set({ color: ee.Number(value).add(1) })
      );
    }, initial);

    // Transform the features into an image
    const features = ee.FeatureCollection(ee.List(featureList));
    const newImage = features.reduceToImage({
      properties: ["color"],
      reducer: ee.Reducer.first(),
    }).select([0], ["vectors"]);

    return image
      .set({ area: totalArea, areaCount: features.size() })
      .addBands(newImage);
  });

  return promise ? evaluate(query) : query;
}

export function* createImage(layer, region) {
  const image = layer.image.clip(region);

  console.log("Getting data for ", layer);
  const [histogram, overlay] = yield all([
    createHistogram(image, { scale: 300 }),
    getOverlay(image, layer.params),
  ]);
  console.log("Finished retrieving ", layer);

  layer = cloneClass(layer);
  layer.image = image;
  return new ConcreteLayer(layer, overlay, histogram);
}
