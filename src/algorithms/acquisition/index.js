import { ee } from '../../services/earth-engine'
import { mergeProperties, addGridPosition, retrieveExtremes, getDate } from '../utils'
import { getSatelliteCollection } from '../utils'
import { scoreClouds } from '../imagery'
import * as Metadata from '../../common/metadata'

const REVISIT_DAYS = 16

const sliceByRevisit = (collection, startingDate, days) => {
  const start = ee.Date(startingDate).update(null, null, null, 0, 0, 0);
  const end = start.advance(days, "day");

  return collection.filterDate(start, end);
};

export const acquireFromDate = (date, collection, geometry) => {
  const slice = sliceByRevisit(
    ee.ImageCollection(collection).filterBounds(geometry),
    date,
    REVISIT_DAYS
  );
  const mosaicked = slice.mosaic().clip(geometry);

  const image = mosaicked.set(mergeProperties(slice));
  return scoreClouds(image, geometry, 'pixel_qa');
};

// Computes a list of valid dates in the region to be retrieved with acquireFromDate.
export const processCollection = (satellite, geometry) => {
  const query = getSatelliteCollection(satellite).filterBounds(geometry);

  // Retrieve the globally extreme dates (earliest and latest)
  const global = retrieveExtremes(query);

  // Compute the grid position of each image and sort in ascending order
  const enhanced = query
    .map(addGridPosition(satellite))
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
  const remainder = ee.Number(difference).mod(REVISIT_DAYS);

  // The amount of days we need to go back is given by the reverse of the
  // difference, in terms of the duration of an orbit
  const step = ee.Number(REVISIT_DAYS).subtract(remainder);

  // Compute the date of the earliest possible image in the northeastern
  // position (whether or not it exists) by going back in time
  const earliestDate = global.earliest.advance(step.multiply(-1), "day"); // 1.21 gigawatts!

  // Compute the amount of complete orbital cycles between the earliest and
  // latest possible dates of the images in the northeastern position (whether
  // or not they exist)
  const completeCycles = ee
    .Number(earliestDate.difference(global.latest, "day").abs())
    .divide(REVISIT_DAYS)
    .ceil();

  // Generate slices of 16 (0, 16, 32, 48, ...), one for each complete cycle
  const additions = ee.List.sequence(0, null, REVISIT_DAYS, completeCycles);

  // Transform each slice into an empty image. If the slice contains at least
  // one image, we add metadata related to the correspondent orbital cycle,
  // to allow for filtering later
  const carriers = additions.map(increment => {
    const startingDate = earliestDate.advance(increment, "day");
    const collection = sliceByRevisit(query, startingDate, REVISIT_DAYS);

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

export const generateCloudMap = (dates, collection, geometry) => {
  const cloudList = ee.List(dates).map(date => {
    const image = ee.Image(acquireFromDate(date, collection, geometry));
    return image.get("CLOUDS");
  });

  return cloudList;
};
