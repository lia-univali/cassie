import { formatDate, asPercentage } from "./utils";
import sentinel2Thumb from "resources/Sentinel-2.jpg";
import sentinel3Thumb from "resources/Sentinel-3.jpg";
import landsatThumb from "resources/Landsat.jpg";

const dateToString = date => {
  return formatDate(date, true);
};

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
  return satellites[index];
};
