import * as Algorithms from './algorithms';
import map from 'async/map';
import parallel from 'async/parallel';
import { Roles } from './constants';

const makeLayer = (image, title, role = "other", params = {}) => {
  return {image, title, role, params};
}

export const getOverlay = (image, params = {}, callback = () => {}) => {
  image.getMap(params, info => {
    const overlay = new ee.MapLayerOverlay('https://earthengine.googleapis.com/map',
        info.mapid, info.token, {});

    callback(overlay);
  });
}

export const createHistogram = (image, params, callback) => {
  image.reduceRegion({
    reducer: ee.Reducer.histogram(),
    scale: params.scale,
    geometry: params.geometry,
    maxPixels: 1E12
  }).evaluate(r => callback(r));
}

export const filterClouds = (satelliteData, spacecraft, level) => {
  const validIndices = [];

  satelliteData.features.forEach((feature, i) => {
    const cloudLevel = parseFloat(feature.properties[spacecraft.cloudCoverProperty]);
    if (cloudLevel <= level) {
      validIndices.push(i);
    }
  });

  return validIndices;
}

export const generateImages = (spacecraft, baseImage, params, callback) => {
  const places = 3;

  const histogramMapper = (item, cb) => {
    const histogramParams = {
      scale: 100,
      geometry: item.image.geometry()
    };

    createHistogram(item.image, histogramParams, r => {
      cb(null, r);
    });
  };

  const overlayMapper = (item, cb) => {
    getOverlay(item.image, item.params, overlay => {
      cb(null, overlay);
    });
  };

  const ndwi = Algorithms.extractNDWI(baseImage, spacecraft.bands);
  const ndvi = Algorithms.extractNDVI(baseImage, spacecraft.bands);
  const blue = baseImage.select(spacecraft.bands.blue);
  const salinityIndex = baseImage.select(spacecraft.bands.green)
                  .add(baseImage.select(spacecraft.bands.red))
                  .divide(2);

  const layers = [
    makeLayer(baseImage, "Principal", Roles.base, params),
    makeLayer(ndwi, "NDWI", Roles.ndwi),
    makeLayer(ndvi, "NDVI", Roles.ndvi),
    makeLayer(blue, "Azul", Roles.other),
    makeLayer(salinityIndex, "Salinity Index", Roles.other),
  ];

  parallel({
    histograms: (callback) => {
      map(layers, histogramMapper, (err, results) => {
        callback(err, results);
      });
    },
    overlays: (callback) => {
      map(layers, overlayMapper, (err, results) => {
        callback(err, results);
      });
    }
  }, (err, results) => {
    layers.forEach((value, i) => {
      layers[i].histogram = results.histograms[i];
      layers[i].overlay = results.overlays[i];
    });

    callback(layers);
  });
}
