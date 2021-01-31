import Algorithms from '../procedures'
import sentinel2Thumb from "../resources/Sentinel-2.jpg";
import landsatThumb from "../resources/Landsat.jpg";

/* Single Satellite Mission Constructor */
const Mission = (name, shortname, cycle, startYear, endYear, opticalResolution, bands, vizParams, properties, algorithms, fallbackMission = null) => {

  /* Unite params */
  const union = {
    name, shortname, cycle, startYear, endYear, opticalResolution, bands, vizParams, properties, fallbackMission
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

export const fallback = {
  landsat7_t2_toa: Mission(
    'LANDSAT/LE07/C01/T2_TOA',
    'LE07',
    16,
    1999,
    null,
    30,
    { red: "B3", green: "B2", blue: "B1", nir: "B4", swir: "B5", qa: "BQA" },
    {},
    { cloudCoverProperty: 'CLOUD_COVER' },
    {
      queryAvailable: Algorithms.Satellite.LandsatTOA.queryAvailable,
      getAvailable: Algorithms.Satellite.LandsatTOA.getAvailable,
      acquire: Algorithms.Satellite.LandsatTOA.acquire
    }
  ),
  landsat8_t2_toa: Mission(
    'LANDSAT/LC08/C01/T2_TOA',
    'LC08',
    16,
    2013,
    null,
    30,
    { red: "B4", green: "B3", blue: "B2", nir: "B5", swir: "B6", qa: "BQA" },
    {},
    { cloudCoverProperty: 'CLOUD_COVER' },
    {
      queryAvailable: Algorithms.Satellite.LandsatTOA.queryAvailable,
      getAvailable: Algorithms.Satellite.LandsatTOA.getAvailable,
      acquire: Algorithms.Satellite.LandsatTOA.acquire
    }
  )
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
        },
        fallback.landsat7_t2_toa
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
        },
        fallback.landsat8_t2_toa
      )
    ],
    true
  )
];

export const get = index => {
  return standard[index];
};