import * as Algorithms from 'algorithms';
import * as Operations from 'operations';
import * as Utils from 'common/utils';
import { updateStatus } from './index';
//import ee from 'ee_api_js.js';

const ee = window.ee;

export const runVegetationExperiments = () => (dispatch, getState) => {
  const geometry = ee.Geometry.Polygon(
        [[[-48.78925323486328, -26.278947423474804],
          [-48.79405975341797, -26.320498387100198],
          [-48.75011444091797, -26.3263451047402],
          [-48.70994567871094, -26.317421048735763],
          [-48.715782165527344, -26.27802389961222],
          [-48.776206970214844, -26.27863958300396]]]);

  const geometry2 = ee.Geometry.Polygon(
        [[[-48.747711181640625, -26.291875985699352],
          [-48.76213073730469, -26.295877391487558],
          [-48.75629425048828, -26.298339726417723],
          [-48.74290466308594, -26.31649783128436],
          [-48.732261657714844, -26.321113844962177],
          [-48.72093200683594, -26.312804887905067],
          [-48.71681213378906, -26.298031937411274],
          [-48.72539520263672, -26.281102283903152],
          [-48.74565124511719, -26.281102283903152]]]);

  const geometry3 = ee.Geometry.Polygon(
        [[[-48.724365234375, -26.361111588474884],
          [-48.67389678955078, -26.357727699511155],
          [-48.67424011230469, -26.318344258829416],
          [-48.73088836669922, -26.317421048735763]]]);

  const geometry4 = ee.Geometry.Polygon(
        [[[-48.565406799316406, -26.300802009052873],
          [-48.518714904785156, -26.304187562281875],
          [-48.511505126953125, -26.28017877719128],
          [-48.56163024902344, -26.27863958300396]]]);

  const geometry5 = ee.Geometry.Polygon(
        [[[-48.745994567871094, -26.250622682377614],
          [-48.695526123046875, -26.25585712232748],
          [-48.6529541015625, -26.233070192235484],
          [-48.643341064453125, -26.19795726272402],
          [-48.68144989013672, -26.19826531693498],
          [-48.76007080078125, -26.22537089549672]]]);

  const geometries = [geometry, geometry2, geometry3, geometry4, geometry5];

  const images = [44, 70, 79, 91, 120, 147, 200];

  const { satelliteData, spacecraft } = getState().data;

  dispatch(updateStatus("Executando experimentos"));
  let completionCount = 0;

  images.forEach((imageIndex, i) => {
    const imageData = satelliteData.features[imageIndex];
    const image = ee.Image(imageData.id, imageData.version);
    const ndvi = Algorithms.extractNDVI(image, spacecraft.bands);

    geometries.forEach((geom, geoIndex) => {
      Operations.createHistogram(ndvi, {scale: 20, geometry: geom}, histogram => {
        const threshold = Algorithms.otsuThreshold(Utils.firstValue(histogram));

        const vectors = ndvi.gte(threshold).reduceToVectors({
          geometry: geom,
          geometryType: "polygon",
          eightConnected: false,
          scale: 10
        }).filterMetadata("label", "equals", 1)
          .map(feature => feature.set({area: feature.geometry().area(1)}));

        const url = vectors.getDownloadURL("kml", [], "babitonga_img" + i + "_geom" + geoIndex);
        vectors.evaluate(result => {
          let sum = 0;
          result.features.forEach(feature => {
            sum += feature.properties.area;
          });

          console.log(`(${i};${geoIndex}): ${url} -> ${sum} square metres`);
          completionCount++;

          if (completionCount === geometries.length * images.length) {
            dispatch(updateStatus(false));
          }
        });
      });
    });
  });
}
