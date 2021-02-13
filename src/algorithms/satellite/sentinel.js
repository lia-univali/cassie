import { ee } from '../../services/earth-engine'
import { mergeProperties, retrieveExtremes, getDate } from '../utils'
import { scoreCloudRatio } from '../imagery'
import * as Metadata from '../../common/metadata'

const addGridPosition = element => {
  const image = ee.Image(element);

  return image.set({ [Metadata.GRID_POSITION]: image.get('MGRS_TILE') });
};

const sliceByRevisit = (collection, startingDate, days) => {
  const start = ee.Date(startingDate).update(null, null, null, 0, 0, 0);
  const end = start.advance(days, "day");

  return collection.filterDate(start, end);
};

export const maskS2Clouds = (image) => {
  const qaBandName = 'QA60'
  const qa = image.select(qaBandName)

  const denseMask = 1 << 10,
    cirrusMask = 1 << 11

  return qa.bitwiseAnd(denseMask)
    .or(qa.bitwiseAnd(cirrusMask))
}

export const acquireFromDate = (date, mission, geometry) => {
  const slice = sliceByRevisit(
    ee.ImageCollection(mission.name).filterBounds(geometry),
    date,
    mission.cycle
  );
  const mosaicked = slice.mosaic().clip(geometry);

  const image = mosaicked.set(mergeProperties(slice));
  const ratio = scoreCloudRatio(maskS2Clouds(image), 'QA60', geometry, 60);

  return image.set('CLOUDS', ratio)
};

// Computes a list of valid dates in the region to be retrieved with acquireFromDate.
export const processCollection = (mission, geometry) => {
  const query = ee.ImageCollection(mission.name).filterBounds(geometry);

  // Retrieve the globally extreme dates (earliest and latest)
  const global = retrieveExtremes(query);

  // Compute the grid position of each image and sort in ascending order
  const enhanced = query
    .map(addGridPosition)
    .sort(Metadata.GRID_POSITION);

  // Retrieve the northeasternmost grid position within the specified bounds
  const northeasternPosition = ee
    .Image(enhanced.toList(1).get(0))
    .get(Metadata.GRID_POSITION);

  // Keep images in the slice where the satellite passed first (northeast)
  const filtered = enhanced.filter(
    ee.Filter.eq(Metadata.GRID_POSITION, northeasternPosition)
  );

  // Retrieve the extremes in the northeastern position
  const northeastern = retrieveExtremes(filtered);

  // Compute the difference in days between the earliest image in the
  // northeastern position and the globally earliest image
  const difference = northeastern.earliest
    .difference(global.earliest, "day")
    .abs();
  const remainder = ee.Number(difference).mod(mission.cycle);

  // The amount of days we need to go back is given by the reverse of the
  // difference, in terms of the duration of an orbit
  const step = ee.Number(mission.cycle).subtract(remainder);

  // Compute the date of the earliest possible image in the northeastern
  // position (whether or not it exists) by going back in time
  const earliestDate = global.earliest.advance(step.multiply(-1), "day"); // 1.21 gigawatts!

  // Compute the amount of complete orbital cycles between the earliest and
  // latest possible dates of the images in the northeastern position (whether
  // or not they exist)
  const completeCycles = ee
    .Number(earliestDate.difference(global.latest, "day").abs())
    .divide(mission.cycle)
    .ceil();

  // Generate slices of 5 (0, 5, 10, 15, ...), one for each complete cycle
  const additions = ee.List.sequence(0, null, mission.cycle, completeCycles);

  // Transform each slice into an empty image. If the slice contains at least
  // one image, we add metadata related to the correspondent orbital cycle,
  // to allow for filtering later
  const carriers = additions.map(increment => {
    const startingDate = earliestDate.advance(increment, "day");
    const collection = sliceByRevisit(query, startingDate, mission.cycle);

    const empty = ee.Algorithms.IsEqual(collection.size(), 0);
    const properties = ee.Algorithms.If(empty, {}, mergeProperties(collection));

    return ee.Image(0).set(properties);
  });

  // Keep only the images whose combined geometries contain the AOI
  const valid = ee.ImageCollection.fromImages(carriers).filter(
    ee.Filter.contains(Metadata.FOOTPRINT, geometry)
  );

  // For now only the date of the slice is important.
  return ee.List(valid.toList(valid.size()).map(getDate));
};

export const generateCloudMap = (dates, mission, geometry) => {
  const cloudList = ee.List(dates).map(date => {
    const image = ee.Image(acquireFromDate(date, mission, geometry));
    return image.get("CLOUDS");
  });

  return cloudList;
};

const queryAvailable = mission => geometry => {
  const query = processCollection(mission, geometry);
  const datesQuery = query.map(date => ee.Date(date).format("YYYY-MM-dd"));
  const cloudQuery = generateCloudMap(datesQuery, mission, geometry);

  return ee.Dictionary.fromLists(datesQuery, cloudQuery)
};

const getAvailable = mission => geometry => {
  const query = processCollection(mission, geometry);
  const datesQuery = query.map(date => ee.Date(date).format("YYYY-MM-dd"));
  const cloudQuery = generateCloudMap(datesQuery, mission, geometry);

  return ee.Dictionary.fromLists(datesQuery, cloudQuery)
};

const acquire = mission => (date, geometry) => {
  return acquireFromDate(date, mission, geometry);
}

const format = properties => {
  return (
    properties["system:time_start"] +
    " -- " +
    properties["cloud"]
  );
}

export default {
  queryAvailable,
  getAvailable,
  acquire,
  format
};
