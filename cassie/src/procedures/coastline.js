import { computeBearing, computeDisplacement } from "common/geodesy";
import { evaluate } from "../common/sagaUtils";
import { combineReducers } from "common/eeUtils";
import { extractOcean, smoothLineString } from "./imagery";
import { acquireFromDate } from "./acquisition";
import * as Metadata from "common/metadata";
import { EPOCH } from "common/utils";
import { getSatelliteCollection } from "../common/eeUtils";

const ee = window.ee;

function offsetMapper(offsets, extent, origin, theta, areaOfInterest) {
  return offset => {
    const centre = computeDisplacement(
      origin.get(0),
      origin.get(1),
      theta,
      offset
    );

    const h = extent.divide(2);

    const alpha = theta.add(Math.PI * 0.5);
    const beta = alpha.add(Math.PI);

    const [alphaLng, alphaLat] = computeDisplacement(
      centre[0],
      centre[1],
      alpha,
      h
    );
    const [betaLng, betaLat] = computeDisplacement(
      centre[0],
      centre[1],
      beta,
      h
    );

    const geometry = ee.Geometry.LineString([
      betaLng,
      betaLat,
      alphaLng,
      alphaLat
    ]);

    return ee.Feature(geometry, { endpoints: geometry.coordinates() });
  };
}

function transectAccumulator(step, extent) {
  step = ee.Number(step);
  extent = ee.Number(extent);

  return (current, last) => {
    const list = ee.List(last);
    const lastElement = ee.Dictionary(list.get(-1));

    const a = ee.List(current);
    const b = ee.List(lastElement.get("a"));

    const theta = computeBearing(a.get(0), a.get(1), b.get(0), b.get(1)).add(
      Math.PI
    );
    const hypot = ee.Geometry.Point(a).distance(ee.Geometry.Point(b));
    const previousRemainder = ee.Number(lastElement.get("remainder"));

    const offsets = ee.List.sequence(
      step.subtract(previousRemainder),
      hypot,
      step
    );
    const transects = offsets.map(offsetMapper(offsets, extent, b, theta));

    const rawRemainder = ee.Algorithms.If(
      ee.Algorithms.IsEqual(offsets.size(), 0), // If the space between the transects is greater than the length of the segment
      previousRemainder.add(hypot), // Then increment the previous remainder by the entire length of the segment
      hypot.subtract(offsets.get(-1)) // Otherwise the remainder is the difference between the last offset and the length of the segment
    );

    const remainder = ee.Number(rawRemainder);

    return list.add(
      ee.Dictionary({
        a,
        b,
        remainder,
        transects,
        theta,
        hypot,
        offsets
      })
    );
  };
}

/**
 * Extracts oceans (representing coastlines) from a set of images.
 * @param  {Array} dates a list containing the dates of the images to be analysed
 * @param  {Object} satellite information about the satellite
 * @param  {ee.Geometry} geometry the Area of Interest of the this  session
 * @return {ee.FeatureCollection} a collection of polygons
 */
export function computeCoastlines(dates, satellite, geometry, threshold = 0) {
  const collection = getSatelliteCollection(satellite);

  const images = ee.List(
    dates.map(date => acquireFromDate(date, collection, geometry))
  );

  const oceans = images.map(image => {
    image = ee.Image(image).clip(geometry);
    const ocean = extractOcean(image, satellite, geometry, threshold);
    // const smoothen = smoothPolygon(ocean.geometry());
    return ocean;
  });

  return ee.FeatureCollection(oceans);
}

/**
 * Adds information about distances from the baseline to the nearest intersection
 * with the coastline polygon, for every transect in the collection.
 * @param {ee.List} transects the orthogonal transects
 * @param {ee.FeatureCollection} coastlines the coastlines
 */
export function addDistances(transects, coastlines) {
  return transects.map(transect => {
    transect = ee.Feature(transect);
    const distances = computeDistances(transect, coastlines);

    const x = ee.List(ee.Dictionary(distances).values()).map(dict => {
      dict = ee.Dictionary(dict);
      const input = ee.Date(dict.get("date")).difference(ee.Date(EPOCH), "day");
      const output = dict.get("distance");
      return [input, output];
    });

    // Shoreline Change Envelope

    const byDistance = ee
      .List(ee.Dictionary(distances).values())
      .map(dict => ee.Dictionary(dict).get("distance"));

    const closest = ee.Number(byDistance.reduce(ee.Reducer.min()));
    const farthest = ee.Number(byDistance.reduce(ee.Reducer.max()));

    const sce = farthest.subtract(closest);

    let sortedDistances = ee
      .FeatureCollection(
        ee.List(ee.Dictionary(distances).values()).map(record => {
          const dict = ee.Dictionary(record);
          return ee.Feature(null, {
            date: dict.get("date"),
            distance: dict.get("distance")
          });
        })
      )
      .sort("date")
      .toList(
        ee
          .Dictionary(distances)
          .values()
          .size()
      );

    const firstRecord = ee
      .Feature(sortedDistances.reduce(ee.Reducer.first()))
      .toDictionary(ee.List(["date", "distance"]));
    const firstDate = ee.Date(firstRecord.get("date"));

    const lastRecord = ee
      .Feature(sortedDistances.reduce(ee.Reducer.last()))
      .toDictionary(ee.List(["date", "distance"]));
    const lastDate = ee.Date(lastRecord.get("date"));

    const nsm = ee
      .Number(lastRecord.get("distance"))
      .subtract(ee.Number(firstRecord.get("distance")));

    const epr = nsm.divide(lastDate.difference(firstDate, "month"));

    const reducers = combineReducers(
      ee.Reducer.linearFit(),
      ee.Reducer.pearsonsCorrelation()
    );
    const trend = ee.Dictionary(x.reduce(reducers));
    const lrr = ee.Number(trend.get("scale")).multiply(365);

    return transect.set({ distances, x, trend, sce, nsm, epr, lrr });
  });
}

/**
 * Removes noises from the coastline by keeping only
 * the polygons that intersect with all transects.
 * @param coastline : ee.Geometry.MultiLineString
 * @param transects : ee.Geometry.MultiLineString
 * @returns coastline without noise in a ee.Geometry.MultiLineString
 */
export function removeCoastlineNoise(coastline, transects) {
  const coastlineAsCollection = ee
    .FeatureCollection(
      coastline
        .coordinates()
        .map(line => {
          const geom = ee.Geometry.LineString(line);
          return ee.Feature(geom, {
            intersections: geom.intersection(transects).coordinates().size()
          });
        })
    )
    .sort('intersections', false)

  return ee.Feature(coastlineAsCollection.first())
}

export function mapToSummary(transects, coastlines, areaOfInterest) {
  const coastlineList = ee.List(coastlines.toList(coastlines.size()));
  const coastlineIds = coastlineList.map(feature => ee.Feature(feature).id());
  const coastlineTable = ee.Dictionary.fromLists(coastlineIds, coastlineList);

  // Create a MultiLineString Geometry from transects list of Features
  const transectsAsGeometry = ee.Geometry.MultiLineString(
    transects.map(transect =>
      ee
        .Feature(transect)
        .geometry()
        .coordinates()
    )
  );

  const distances = ee
    .List(transects)
    .map(transect => {
      return ee.Dictionary(ee.Feature(transect).get("distances")).values();
    })
    .flatten();

  let transformed = distances.iterate((current, last) => {
    current = ee.Dictionary(current);
    const dict = ee.Dictionary(last);

    const emptyDict = ee.Dictionary({ distances: ee.List([]) });

    const key = current.get("withRespectTo");
    const value = current.get("distance");
    const feature = ee.Feature(coastlineTable.get(key));

    let target = ee.Dictionary(
      ee.Algorithms.If(dict.contains(key), dict.get(key), emptyDict)
    );
    const targetList = ee.List(target.get("distances"));

    target = target.combine(
      ee.Dictionary({
        distances: targetList.add(value),
        date: feature.get(Metadata.TIME_START)
      })
    );

    return dict.set(key, target);
  }, ee.Dictionary({}));

  transformed = ee.Dictionary(transformed);

  const fullPolygons = ee.List(transformed.keys()).map(key => {
    const value = ee.Dictionary(transformed.get(key));

    const distances = ee.List(value.get("distances"));
    const stats = distances.reduce(
      combineReducers(ee.Reducer.mean(), ee.Reducer.stdDev())
    );

    let polygonFeature = ee.Feature(coastlineTable.get(key));
    let coastStrings = ee.Geometry.MultiLineString(polygonFeature.geometry().coordinates());

    coastStrings = ee.Geometry.MultiLineString(coastStrings.intersection(areaOfInterest.buffer(-10)).coordinates());

    let withoutNoise = ee.Feature(
      removeCoastlineNoise(coastStrings, transectsAsGeometry)
    );

    const smoothen = smoothLineString(withoutNoise)

    return ee.Feature(
      smoothen,
      value.combine(ee.Dictionary(stats))
    );
  });

  let collection = ee.FeatureCollection(fullPolygons);
  // collection = collection.map((feature) => (
  //   ee.Algorithms.If(ee.Feature(feature).geometry(),
  //     ee.Feature(feature),
  //     null)
  // ), true)

  return collection.sort("date");
}

/**
 * Generates transects orthogonal to the specified polygon.
 * @param {ee.Feature} polygon a Feature describing the area to be covered
 */
export function generateOrthogonalTransects(
  coordinates,
  step,
  extent,
  areaOfInterest
) {
  coordinates = ee.List(coordinates);

  const first = ee.Dictionary({
    a: ee.List(coordinates.get(0)),
    remainder: 0,
    transects: []
  });

  const result = coordinates
    .slice(1)
    .iterate(transectAccumulator(step, extent), [first]);
  let transects = ee
    .List(result)
    .map(dict => ee.Feature(ee.Dictionary(dict).get("transects")))
    .flatten();

  if (areaOfInterest !== undefined) {
    const propertyName = "AOI_CONTAINS";
    transects = ee.FeatureCollection(transects).map(transect => {
      transect = ee.Feature(transect);
      const contained = areaOfInterest.contains(transect.geometry());
      return transect.set({ [propertyName]: contained });
    });
    transects = transects.filter(ee.Filter.eq(propertyName, true));
    transects = ee.Algorithms.If(
      ee.Algorithms.IsEqual(transects.size(), 0),
      ee.List([]),
      transects.toList(transects.size())
    );
  }

  return ee.List(transects);
}

export function computeDistances(transect, polygonCollection) {
  // Map polygons, drop those which don't intersect the transect.
  const polygonsThatIntersect = polygonCollection.map(
    polygon =>
      ee.Algorithms.If(
        transect
          .intersection(polygon, 1)
          .geometry()
          .coordinates(),
        polygon,
        null
      ),
    true
  ); // by passing "true" as the second parameter, map
  // won't add the returned nulls to the returned collection

  const polygonList = ee.List(
    polygonsThatIntersect.toList(polygonsThatIntersect.size())
  );

  const distances = polygonList.map(polygon => {
    polygon = ee.Feature(polygon);

    const intersection = transect.intersection(polygon, 1);
    const points = ee.Geometry.MultiPoint(
      intersection
        .geometry()
        .coordinates()
        .flatten()
    );

    const middle = transect.centroid();

    const key = "distance_from_midpoint";
    const withDistance = points.coordinates().map(point => {
      point = ee.Geometry.Point(point);
      const distance = middle.distance(point, 1);

      return ee.Feature(point, { [key]: distance });
    });

    const setDistance = target => {
      target = ee.Dictionary(target);
      const sorted = ee.FeatureCollection(withDistance).limit(1, key); // O(n) maybe?
      const closest = ee.Feature(ee.List(sorted.toList(1)).get(0));
      const distance = middle.distance(closest);

      return target.combine({
        distance,
        closest: closest.geometry().coordinates()
      });
    };

    const setFakeDistance = target => {
      return ee
        .Dictionary(target)
        .combine({ distance: transect.length(1).divide(2) });
    };

    const intersections = ee.Number(withDistance.size()); // Each intersection generates two points
    const dict = ee.Dictionary({
      intersections,
      //intersects: transect.containedIn(polygon, 1),
      withRespectTo: polygon.id(),
      date: polygon.get(Metadata.TIME_START)
    });

    return setDistance(dict);
  });

  const ids = ee
    .List(polygonsThatIntersect.toList(polygonsThatIntersect.size()))
    .map(feature => {
      return ee.Feature(feature).id();
    });

  return ee.Dictionary.fromLists(ids, distances);
}

export function expandHorizontally(transects, amount) {
  amount = ee.Number(amount).divide(2);

  const mapper = transect => {
    transect = ee.Feature(transect);

    const coords = transect.geometry().coordinates();
    const a = ee.List(coords.get(0));
    const b = ee.List(coords.get(1));

    const theta = computeBearing(a.get(0), a.get(1), b.get(0), b.get(1)).add(
      Math.PI
    );
    const alpha = theta.add(Math.PI * 0.5);
    const beta = theta.subtract(Math.PI * 0.5);

    const a1 = computeDisplacement(a.get(0), a.get(1), alpha, amount);
    const a2 = computeDisplacement(a.get(0), a.get(1), beta, amount);

    const b1 = computeDisplacement(b.get(0), b.get(1), alpha, amount);
    const b2 = computeDisplacement(b.get(0), b.get(1), beta, amount);

    const rectangle = ee.Feature(ee.Geometry.Polygon([[a1, a2, b2, b1]]));
    return rectangle.copyProperties(transect);
  };

  return transects.map(mapper);
}

export const expandCoastline = (coordinates, direction, distance) => {
  coordinates = ee.List(coordinates);
  const neighbors = ee.List(coordinates.slice(1));

  let displacedSegments = coordinates.zip(neighbors).map(segment => {
    segment = ee.List(segment);
    const current = ee.List(segment.get(0));
    const neighbor = ee.List(segment.get(1));
    const bearing = computeBearing(
      current.get(0),
      current.get(1),
      neighbor.get(0),
      neighbor.get(1)
    );

    const p1 = computeDisplacement(
      current.get(0),
      current.get(1),
      bearing.add(Math.PI * 0.5),
      distance
    );
    const p2 = computeDisplacement(
      neighbor.get(0),
      neighbor.get(1),
      bearing.add(Math.PI * 0.5),
      distance
    );
    return ee.List([p1, p2]);
  });

  displacedSegments = rectifyJunctions(displacedSegments, coordinates);
  const combined = coordinates.reverse().splice(0, 0, displacedSegments);

  return ee.Feature(ee.Geometry.Polygon([combined]));
};

const rectifyJunctions = (segments, originalCoordinates) => {
  segments = ee.List(segments);
  originalCoordinates = ee.List(originalCoordinates).slice(1);
  const neighbors = ee.List(segments.slice(1));

  let processed = ee.List.sequence({ start: 0, count: neighbors.size() }).map(
    index => {
      const currentSegment = ee.List(segments.get(index));
      const neighborSegment = ee.List(neighbors.get(index));
      const original = ee.List(originalCoordinates.get(index));

      const previous = ee.List(currentSegment.get(1));
      const next = ee.List(neighborSegment.get(0));

      const alpha = computeBearing(
        original.get(0),
        original.get(1),
        previous.get(0),
        previous.get(1)
      );
      const beta = computeBearing(
        original.get(0),
        original.get(1),
        next.get(0),
        next.get(1)
      );
      const difference = alpha.subtract(beta); // Angle between previous and next
      const halfDifference = difference.divide(2);
      const theta = beta.add(halfDifference);

      const adjacent = ee.Geometry.Point(original).distance(
        ee.Geometry.Point(next)
      );
      const length = ee.Number(adjacent).divide(halfDifference.cos()); // cosθ = adjacent / hypotenuse

      const centroid = computeDisplacement(
        original.get(0),
        original.get(1),
        theta,
        length
      );

      return centroid;
    }
  );

  const first = ee.List(ee.List(segments.get(0)).get(0)); // Start of the first segment
  const last = ee.List(ee.List(segments.get(-1)).get(1)); // End of the last segment

  processed = ee.List(processed);
  processed = processed.insert(0, ee.List([first.get(0), first.get(1)]));
  processed = processed.add(ee.List([last.get(0), last.get(1)]));
  return processed;
};
