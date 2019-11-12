import { Layer, ConcreteLayer } from '../common/classes';
import { generateVisualizationParams, simplify, applyExpression } from '../common/eeUtils';
import * as Indices from '../common/indices';
import * as Metadata from '../common/metadata';
import { getDate } from './common';
import { asPromise } from '../common/utils';

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
  return image.set("CLOUDS", ratio);
}

export const generateLayer = (image, mission, name, params) => {
  if (params === undefined) {
    params = generateVisualizationParams(mission);
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

export const gaussDistribution = (x, mean, sigma) => {
  const divider = ee.Number(sigma).multiply(ee.Number(2).multiply(Math.PI).sqrt())
  const exponent = ee.Number(-1).multiply(ee.Number(x).subtract(mean).pow(2).divide(ee.Number(2).multiply(ee.Number(sigma).pow(2))))

  return ee.Number(1).divide(divider).multiply(exponent.exp())
}

export const gaussKernel = (size, mean, sigma) => {
  const half = ee.Number(size).divide(2).floor()

  const begin = ee.Number(0).subtract(half),
    end = ee.Number(0).add(half)

  // Get the normal distribution Y value for each X
  // in the interval
  const kernel = ee.List.sequence(begin, end).map(i => gaussDistribution(i, mean, sigma))

  const sum = kernel.reduce(ee.Reducer.sum())

  // Normalize each value, so that the sum of the list
  // will be equal to one
  const normalizedKernel = kernel.map(val => ee.Number(val).divide(sum))

  return normalizedKernel
}

/**
 * 
 * @param {ee.List} coordinates List containing the path
 * @param {ee.Number} samples Size of the kernel
 * @param {ee.Number} mean Center of the normal distribution
 * @param {ee.Number} sd Standard Deviation, controls the size of the bell-shaped curve
 */
export const gaussSmooth = (coordinates, samples, mean, sd) => {
  const coordinateList = ee.List(coordinates)

  // Setup gauss distribution kernel parameters
  const kernelSize = ee.Algorithms.If(samples, ee.Number(samples), ee.Number(3))
  const kernelMean = ee.Algorithms.If(mean, ee.Number(mean), ee.Number(0))
  const kernelSd = ee.Algorithms.If(sd, ee.Number(sd), ee.Number(1))
  const kernel = gaussKernel(kernelSize, kernelMean, kernelSd)

  const first = coordinateList.reduce(ee.Reducer.first()),
    last = coordinateList.reduce(ee.Reducer.last())

  const sequence = ee.List.sequence(ee.Number(0), coordinateList.length().subtract(kernelSize))

  const path = sequence.map(index => {
    // Take interval of the kernel size to apply the smoothing
    // and zip it to the kernel, so each element in the new list
    // will be a pair of a 2d point and its weight
    const interval = coordinateList.slice(ee.Number(index), ee.Number(index).add(kernelSize)).zip(kernel)

    // Map the elements, multiplying their axis values by their weight
    const gaussian = interval.map(element => {
      // Each element contains a 2d point (0) and a kernel weight (1)
      const asList = ee.List(element)

      const point = ee.List(asList.get(0))
      const weight = ee.Number(asList.get(1))

      // Now we map the two values (each point dimention), multiplying to the weight
      return point.map(value => ee.Number(value).multiply(weight))
    })

    // Sum longitude and latitude separately
    const smoothenLong = gaussian.map(point => ee.List(point).get(0)).reduce(ee.Reducer.sum())
    const smoothenLat = gaussian.map(point => ee.List(point).get(1)).reduce(ee.Reducer.sum())

    // Return final smoothen point
    return ee.List([smoothenLong, smoothenLat]);
  })

  const smoothen = ee.List([]).add(first).cat(path).add(last)

  // return original coordinates if the kernelSize is less than or equal to the length
  // of the given coordinates, otherwise return smoothen coordinates.
  return ee.Algorithms.If(coordinateList.size().lte(kernelSize), coordinateList, smoothen);
}

export const smoothLineString = (geom) => {
  return ee.Geometry.LineString(gaussSmooth(ee.Geometry(geom).coordinates(), 3, 0, 1))
}

export const otsuAlgorithm = (histogram) => {
  var counts = ee.Array(ee.Dictionary(histogram).get('histogram'));
  var means = ee.Array(ee.Dictionary(histogram).get('bucketMeans'));
  var size = means.length().get([0]);
  var total = counts.reduce(ee.Reducer.sum(), [0]).get([0]);
  var sum = means.multiply(counts).reduce(ee.Reducer.sum(), [0]).get([0]);
  var mean = sum.divide(total);

  var indices = ee.List.sequence(1, size);

  // Compute between sum of squares, where each mean partitions the data.
  var bss = indices.map(function (i) {
    var aCounts = counts.slice(0, 0, i);
    var aCount = aCounts.reduce(ee.Reducer.sum(), [0]).get([0]);
    var aMeans = means.slice(0, 0, i);
    var aMean = aMeans.multiply(aCounts)
      .reduce(ee.Reducer.sum(), [0]).get([0])
      .divide(aCount);
    var bCount = total.subtract(aCount);
    var bMean = sum.subtract(aCount.multiply(aMean)).divide(bCount);
    return aCount.multiply(aMean.subtract(mean).pow(2)).add(
      bCount.multiply(bMean.subtract(mean).pow(2)));
  });

  // Return the mean value corresponding to the maximum BSS.
  return means.sort(bss).get([-1]);
};

export const extractOcean = (image, bands, geometry, threshold) => {
  const morphParams = {
    kernelType: "circle",
    radius: 20,
    iterations: 2,
    units: "meters"
  };

  const oceanId = 999; // Arbitrary
  const elevation = ee.Image("WWF/HydroSHEDS/03VFDEM").unmask(-oceanId, false).lte(-oceanId);

  const ndwi = ee.Image(applyExpression(image, Indices.expression(Indices.find("NDWI")), bands)).rename('NDWI');

  const otsuThreshold = otsuAlgorithm(ee.Dictionary(ndwi.reduceRegion({
    reducer: ee.Reducer.histogram(),
    scale: 10,
    maxPixels: 1e9
  })).get('NDWI'));

  const water = ndwi.gt(otsuThreshold).focal_min(morphParams).focal_max(morphParams); // Performs a morphological opening operation.

  const vectors = water.reduceToVectors({
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
    [Metadata.TIME_START]: ee.Date(getDate(image)).format("YYYY-MM-dd"),
    otsu: otsuAlgorithm
  });

  return ee.Feature(withProperties);
}
