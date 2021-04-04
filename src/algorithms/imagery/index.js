import { ee } from "../../services/earth-engine";
import { Layer } from "../../common/classes";
import { generateVisualizationParams } from "../utils";

/*
 * Given a {masked} image having {bandName} with pixel values {0, 1} where 1 indicates
 * cloud presence, the function reduces the region specified in {geometry}
 * with params {scale} and {maxPixels} adding pixel values and then divides
 * it by the pixel count to get the cloud ratio.
 */
export const scoreCloudRatio = (
  masked,
  bandName,
  geometry,
  scale = 30,
  maxPixels = 1e12
) => {
  const cloudyArea = masked.multiply(ee.Image.pixelArea());

  const cloudClassSum = cloudyArea.reduceRegion({
    reducer: ee.Reducer.sum(),
    scale: scale,
    maxPixels: maxPixels,
    geometry: geometry,
  });

  return ee.Number(cloudClassSum.get(bandName)).divide(geometry.area());
};

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
    geometry: geometry,
  });

  const cloudyArea = res.get(qa);
  const ratio = ee.Number(cloudyArea).divide(geometry.area(1));
  return image.set("CLOUDS", ratio);
};

export const generateLayer = (image, mission, name, params) => {
  if (params === undefined) {
    params = generateVisualizationParams(mission);
  }

  return new Layer(image, name, params);
};

export const createThumbnail = (image, geometry, params, callback) => {
  const generationParams = {
    region: geometry,
    format: "jpg",
    dimensions: 512,
    ...params,
  };

  return image.getThumbURL(generationParams, callback);
};

/**
 * Calculates the cumulative window of the *fullHistogram*
 * by removing up to *percentile* pixels in each side of
 * the histogram's buckets.
 * @param {ee.Dictionary} fullHistogram
 * @param {Number|ee.Number} percentile
 * @returns {ee.List} the cumulative window bounds (min/max)
 */
export const cumulativeWindow = (fullHistogram, percentile) => {
  /* Cast to dictionary and retrieve histogram and buckets */
  const cast = ee.Dictionary(fullHistogram);
  const histogram = ee.List(cast.get("histogram"));
  const buckets = ee.List(cast.get("bucketMeans"));

  const pixelCount = ee.Number(histogram.reduce(ee.Reducer.sum()));
  const cumulativeCut = pixelCount.multiply(percentile);

  /*
   * lowerBound returns the min level where cumulative sum
   * would have exceeded the percentile threshold
   */
  const lowerBound = (histogram, buckets) => {
    const cumulativeMin = ee.List.sequence(
      0,
      buckets.size().subtract(1)
    ).iterate(
      (idx, acc) => {
        const ctx = ee.Dictionary(acc);

        const sum = ctx.getNumber("sum").add(histogram.getNumber(idx));
        const min = ee.Algorithms.If(
          sum.gt(cumulativeCut),
          ctx.getNumber("min"),
          buckets.getNumber(idx)
        );

        return ee.Dictionary({ min, sum });
      },
      { min: buckets.getNumber(0), sum: 0 }
    );

    return ee.Dictionary(cumulativeMin).getNumber("min");
  };

  /* Calculate the bound of each side */
  const lower = lowerBound(histogram, buckets);
  const upper = lowerBound(histogram.reverse(), buckets.reverse());

  return ee.List([lower, upper]);
};
