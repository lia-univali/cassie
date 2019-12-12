import Algorithms from '../procedures'
import { formatDate, asPercentage } from "./utils";
import sentinel2Thumb from "../resources/Sentinel-2.jpg";
import sentinel3Thumb from "../resources/Sentinel-3.jpg";
import landsatThumb from "../resources/Landsat.jpg";

const dateToString = date => {
  return formatDate(date, true);
};

/* Single Satellite Mission Constructor */
const Mission = (name, shortname, cycle, startYear, endYear, opticalResolution, bands, vizParams, properties, algorithms) => {

  /* Unite params */
  const union = {
    name, shortname, cycle, startYear, endYear, opticalResolution, bands, vizParams, properties
  }

  /*
    Bind each algorithm to the collection (mission)
    as all of them are built on a currying manner.
    method = mission => (...) => {}
             ^^^^^^^^^^
  */
  const boundAlgorithms = {};
  Object.keys(algorithms).forEach(key => { boundAlgorithms[key] = algorithms[key](union) });

  return { ...union, algorithms: boundAlgorithms };
}

/* Satellite Mission Collection */
const MissionCollection = (name, provider, image, missions, enabled = false) => {

  /* Unite params */
  const union = {
    name, provider, image, missions, enabled
  }

  /* Create a summary of this Mission Collection */
  const summary = {
    cycle: union.missions.reduce((last, mission) => mission.cycle, null),

    startYear: union.missions.reduce((last, mission) => {
      return last ? Math.min(last, mission.startYear) : mission.startYear
    }, null),

    endYear: union.missions.some(mission => mission.endYear === null)
      ? null
      : union.missions.reduce((last, mission) => {
        return last ? Math.max(last, mission.endYear) : mission.endYear
      }, null),

    opticalResolution: union.missions.reduce((last, mission) => mission.opticalResolution, null)
  }

  /* Construct methods */
  const methods = {

    /* Retrieve mission by name */
    get: name => {
      const [first] = union.missions.filter(mission => mission.name === name);
      return first;
    },
  }

  return { ...union, summary, ...methods };
}

export const standard = [
  /* SENTINEL 2 */
  MissionCollection(
    'Sentinel-2',
    'ESA',
    sentinel2Thumb,
    [
      /* SENTINEL 2 */
      Mission(
        'COPERNICUS/S2',
        'S2',
        5,
        2013,
        null,
        10,
        { blue: 'B2', green: "B3", red: "B4", nir: "B8", swir: "B11" },
        { max: 3000, min: 0 },
        { cloudCoverProperty: "CLOUDY_PIXEL_PERCENTAGE" },
        {
          queryAvailable: Algorithms.Satellite.Sentinel.queryAvailable,
          getAvailable: Algorithms.Satellite.Sentinel.getAvailable,
          acquire: Algorithms.Satellite.Sentinel.acquire
        }
      )
    ],
    true
  ),

  /* LANDSATS */
  MissionCollection(
    'Landsat',
    'USGS/NASA',
    landsatThumb,
    [
      /* SENTINEL 5 */
      Mission(
        "LANDSAT/LT05/C01/T1_SR",
        'LT05',
        16,
        1984,
        2012,
        30,
        { red: "B3", green: "B2", blue: "B1", nir: "B4", swir: "B5", qa: "pixel_qa" },
        { gain: "0.1,0.1,0.1" },
        { cloudCoverProperty: 'CLOUD_COVER' },
        {
          queryAvailable: Algorithms.Satellite.Landsat.queryAvailable,
          getAvailable: Algorithms.Satellite.Landsat.getAvailable,
          acquire: Algorithms.Satellite.Landsat.acquire
        }
      ),
      /*
      /* SENTINEL 7 
      Mission(
        "LANDSAT/LE07/C01/T1_SR",
        'LE07',
        16,
        1999,
        null,
        30,
        { red: "B3", green: "B2", blue: "B1", nir: "B4", swir: "B5", qa: "pixel_qa" },
        { gain: "0.1,0.1,0.1" },
        { cloudCoverProperty: 'CLOUD_COVER' },
        {
          queryAvailable: Algorithms.Satellite.Landsat.queryAvailable,
          getAvailable: Algorithms.Satellite.Landsat.getAvailable,
          acquire: Algorithms.Satellite.Landsat.acquire
        }
      ),
      */
      /* SENTINEL 8 */
      Mission(
        "LANDSAT/LC08/C01/T1_SR",
        'LC08',
        16,
        2013,
        null,
        30,
        { red: "B4", green: "B3", blue: "B2", nir: "B5", swir: "B6", qa: "pixel_qa" },
        { gain: "0.1,0.1,0.1" },
        { cloudCoverProperty: 'CLOUD_COVER' },
        {
          queryAvailable: Algorithms.Satellite.Landsat.queryAvailable,
          getAvailable: Algorithms.Satellite.Landsat.getAvailable,
          acquire: Algorithms.Satellite.Landsat.acquire
        }
      )
    ],
    true
  )
];

const satellites = [
  {
    name: "Sentinel-2",
    provider: "ESA",
    cycle: 10,
    startYear: 2013,
    opticalResolution: 10,
    collectionName: "COPERNICUS/S2",
    image: sentinel2Thumb,
    bands: {
      blue: "B2",
      green: "B3",
      red: "B4",
      nir: "B8",
      swir: "B11"
    },
    cloudCoverProperty: "CLOUDY_PIXEL_PERCENTAGE",
    vizParams: {
      max: 4000,
      min: 128
    },
    format: properties => {
      const id = properties["system:index"];
      const label = dateToString(properties["system:time_start"]);

      return id.substr(-1) + " -> " + label;
    }
  },
  {
    name: "Landsat 5",
    provider: "USGS/NASA",
    cycle: 16,
    collectionName: "LANDSAT/LT05/C01/T1_SR",
    collectionSet: [
      "LANDSAT/LT05/C01/T1_SR",
      "LANDSAT/LE07/C01/T1_SR"
      //"LANDSAT/LC08/C01/T1_SR"
    ],
    image: landsatThumb,
    opticalResolution: 30,
    startYear: 1984,
    endYear: 2013,
    bands: {
      red: "B3",
      green: "B2",
      blue: "B1",
      nir: "B4",
      swir: "B5",
      qa: "pixel_qa"
    },
    cloudCoverProperty: "CLOUD_COVER",
    vizParams: {
      gain: "0.1,0.1,0.1"
    },
    format: properties => {
      return (
        dateToString(properties["system:time_start"]) +
        " -- " +
        asPercentage(properties["cloud"])
      );
    },
    computeGridPosition: image => {
      return {
        path: image.get("WRS_PATH"),
        row: image.get("WRS_ROW")
      };
    }
  },
  {
    name: "Sentinel-3",
    provider: "ESA",
    cycle: 99,
    collectionName: "COPERNICUS/S3/OLCI",
    image: sentinel3Thumb,
    opticalResolution: 300,
    startYear: 2016,
    bands: {
      red: "Oa11_radiance",
      green: "Oa05_radiance",
      blue: "Oa03_radiance",
      nir: "B4",
      swir: "B5"
    },
    cloudCoverProperty: "invalidPixelsPercent", //Fix
    vizParams: {
      max: 0.4,
      min: 0
    },
    format: properties => {
      return dateToString(properties["system:time_start"]);
    }
  }
];

export const Sentinel2 = satellites[0];
export const Landsat5 = satellites[1];
export const Sentinel3 = satellites[2];

export const getAll = () => {
  return satellites;
};

export const get = index => {
  return standard[index];
};
