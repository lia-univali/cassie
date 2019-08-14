import { Layer, ConcreteLayer } from 'common/classes';
import { generateVisualizationParams, simplify, applyExpression } from 'common/eeUtils';
import * as Indices from 'common/indices';
import * as Metadata from 'common/metadata';
import { getDate } from './common';
import { asPromise } from 'common/utils';

const ee = window.ee;

const normalizeByArea = function (property) {
  return function (feature) {
    feature = ee.Feature(feature);
    const value = ee.Number(feature.get(property));
    const normalized = value.divide(feature.area(1));

    return feature.set({ [property]: normalized, original: value, area: feature.area(1) });
  };
};

export const scoreClouds = (image, geometry) => {
  const band = "pixel_qa";

  const cloud = "((b(0) >> 5) & 1)";
  const shadow = "((b(0) >> 3) & 1)";
  const confidence = "((b(0) >> 6) & 3)";
  const expr = `(${confidence} > 0) && (${cloud} || ${shadow})`;

  const filtered = image.select(band).expression(expr);
  const imageArea = filtered.multiply(ee.Image.pixelArea());

  const res = imageArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    scale: 1000,
    maxPixels: 1e9,
    geometry: geometry
  });

  const cloudyArea = res.get(band);
  const ratio = ee.Number(cloudyArea).divide(geometry.area(1));
  //image = ee.Algorithms.Landsat.simpleCloudScore(image);

  //const reducers = ee.Reducer.count().combine(ee.Reducer.sum(), "", true);
  //const result = image.select("cloud").reduceRegion({
  //  reducer: reducers,
  //  geometry: geometry,
  //  scale: 300,
  //});

  //const clouds = ee.Number(result.get("cloud_sum"));
  //const total = ee.Number(result.get("cloud_count"));

  //return image.set("CLOUDS", clouds.divide(total.multiply(100)));
  return image.set("CLOUDS", ratio);
}

export const generateLayer = (image, satellite, name, params) => {
  if (params === undefined) {
    params = generateVisualizationParams(satellite);
  }

  return new Layer(image, name, params);
}

export const concretizeLayer = (layer) => {
  // const image = layer.image.clip(region);
  //
  // console.log("Getting data for ", layer);
  // const [histogram, overlay] = yield all([
  //   createHistogram(image, {scale: 300}),
  //   getOverlay(image, layer.params),
  // ]);
  // console.log("Finished retrieving ", layer);
  //
  // layer = cloneClass(layer);
  // layer.image = image;
  // return new ConcreteLayer(layer, overlay, histogram);
}

export const createThumbnail = (imageOrJSON, geometry, params) => {
  const generationParams = {
    image: typeof (imageOrJSON) === 'string' ? imageOrJSON : imageOrJSON.serialize(),
    region: geometry.toGeoJSONString(),
    ...params
  };

  return asPromise(ee.data.getThumbId, generationParams).then(result => ee.data.makeThumbUrl(result));
}

export const extractOcean = (image, satellite, geometry, threshold) => {
  //image = image.clip(geometry);

  const morphParams = {
    kernelType: "circle",
    radius: 20,
    iterations: 2,
    units: "meters"
  };

  const oceanId = 999; // Arbitrary
  const elevation = ee.Image("WWF/HydroSHEDS/03VFDEM").unmask(-oceanId, false).lte(-oceanId);

  const ndwi = applyExpression(image, Indices.expression(Indices.find("NDWI")), satellite.bands);
  const water = ndwi
    .gt(threshold)
    .focal_min(morphParams)
    .focal_max(morphParams); // Performs a morphological opening operation.

  const gaussKernel = ee.Kernel.gaussian({
    radius: 2, units: 'pixels', normalize: true
  });

  // Smooth the image by convolving with the gaussian kernel.
  const smooth = water.convolve(gaussKernel);

  const vectors = smooth.reduceToVectors({
    scale: 30,
    maxPixels: 1e9
  }).filter(ee.Filter.eq("label", 1));

  const property = "sum";
  const oceanProbabilities = elevation.reduceRegions({
    collection: vectors,
    reducer: ee.Reducer.sum(),
    scale: 10,
  }).map(simplify(60)).sort(property, false);

  let feature = ee.Feature(ee.List(oceanProbabilities.toList(1)).get(0));

  // const feature = ee.Feature(ee.List(vectors.toList(1)).get(0));
  const withProperties = feature.setMulti({
    [Metadata.TIME_START]: ee.Date(getDate(image)).format("YYYY-MM-dd")
  });

  return ee.Feature(withProperties);
}
