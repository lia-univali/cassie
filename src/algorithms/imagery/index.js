import { ee } from '../../services/earth-engine'
import { Layer } from '../../common/classes';
import { generateVisualizationParams } from '../utils';

/*
 * Given a {masked} image having {bandName} with pixel values {0, 1} where 1 indicates
 * cloud presence, the function reduces the region specified in {geometry}
 * with params {scale} and {maxPixels} adding pixel values and then divides
 * it by the pixel count to get the cloud ratio.
 */
export const scoreCloudRatio = (masked, bandName, geometry, scale = 30, maxPixels = 1e12) => {
  const cloudyArea = masked.multiply(ee.Image.pixelArea())

  const cloudClassSum = cloudyArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    scale: scale,
    maxPixels: maxPixels,
    geometry: geometry
  })

  return ee.Number(cloudClassSum.get(bandName))
    .divide(geometry.area())
}

export const scoreClouds = (image, geometry, qa) => {
  const cloud = "((b(0) >> 5) & 1)";
  const shadow = "((b(0) >> 3) & 1)";
  const confidence = "((b(0) >> 6) & 3)";
  const expr = `(${confidence} > 0) && (${cloud} || ${shadow})`;

  const filtered = image.select(qa).expression(expr);
  const imageArea = filtered.multiply(ee.Image.pixelArea());

  const res = imageArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    scale: 1000,
    maxPixels: 1e9,
    geometry: geometry
  });

  const cloudyArea = res.get(qa);
  const ratio = ee.Number(cloudyArea).divide(geometry.area(1));
  return image.set("CLOUDS", ratio);
}

export const generateLayer = (image, mission, name, params) => {
  if (params === undefined) {
    params = generateVisualizationParams(mission);
  }

  return new Layer(image, name, params);
}

export const createThumbnail = (image, geometry, params, callback) => {
  const generationParams = {
    region: geometry,
    format: 'jpg',
    dimensions: 512,
    ...params
  };

  return image.getThumbURL(generationParams, callback);
}