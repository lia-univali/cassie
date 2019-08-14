import moment from 'moment';

const dateToString = (date) => {
  return moment(parseInt(date)).format("L HH:mm:ss");
}

const satellites = [
  {
    name: "Sentinel-2",
    startYear: 2013,
    opticalResolution: 10,
    collectionName: "COPERNICUS/S2",
    bands: {
      blue: "B2",
      green: "B3",
      red: "B4",
      nir: "B8",
    },
    cloudCoverProperty: "CLOUDY_PIXEL_PERCENTAGE",
    vizParams: {
      max: 4000,
      min: 128,
    },
    format: (properties) => {
      const id = properties["system:index"];
      const label = dateToString(properties["system:time_start"]);

      return id.substr(-1) + " -> " + label;
    }
  }, {
    name: "Landsat 5",
    collectionName: "LANDSAT/LT05/C01/T1",
    opticalResolution: 30,
    startYear: 1984,
    endYear: 2013,
    bands: {
      red: "B3",
      blue: "B1",
      green: "B2",
      nir: "B4",
    },
    cloudCoverProperty: "CLOUD_COVER",
    vizParams: {
      gain: "1.4, 1.5, 0.7"
    },
    format: (properties) => {
      return dateToString(properties["system:time_start"]);
    }
  }
];

export const Sentinel2 = satellites[0];

export const Landsat5 = satellites[1];

export const getAll = () => {
  return satellites;
}

export const get = (index) => {
  return satellites[index];
}
