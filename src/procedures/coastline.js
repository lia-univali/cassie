import { computeBearing, computeDisplacement } from "../common/geodesy";
import { combineReducers, stringifyList } from "../common/eeUtils";
import { extractCoastline } from "./imagery";
import * as Metadata from "../common/metadata";
import { EPOCH } from "../common/utils";

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
 * @return {ee.FeatureCollection} a FeatureCollection of polygons
 */
export function extractCoastlines(dates, satellite, geometry, threshold, transects) {
  const [head, ...tail] = satellite.missions.map(mission => {
    const images = ee.List(
      dates
        .filter(date => date.name === mission.name)
        .map(date => mission.algorithms.acquire(date.date, geometry))
    );

    const waterSegments = images.map(image => {
      return extractCoastline(ee.Image(image), mission.bands, geometry, threshold, transects, null)
    });

    return ee.FeatureCollection(waterSegments);
  });

  let collection = head;

  tail.forEach(fc => {
    collection = collection.merge(fc)
  })

  return collection;
}

export function formatExportProperties(transect, statistics, keepProps) {
  const dsas = ee.Dictionary(statistics).select(ee.List(['sce', 'nsm', 'epr', 'lrr']))
  const props = ee.Dictionary(ee.Algorithms.If(keepProps, transect.toDictionary(keepProps), {}))

  /* Distances properties  */
  const distanceInfo = ee.Dictionary(statistics.get('distances')).values()

  const dt_vec = stringifyList(distanceInfo.map((item) => ee.Date(ee.Dictionary(item).get('date')).format('YYYY-MM-dd')))

  const dist_vec = stringifyList(distanceInfo.map((item) => ee.Dictionary(item).getNumber('distance')))

  /* Coordinates properties  */
  const coordinates = transect.geometry().coordinates()

  const start = ee.List(coordinates.get(0)),
    end = ee.List(coordinates.get(1))

  const LongStart = start.getNumber(0),
    LongEnd = end.getNumber(0)

  const LatStart = start.getNumber(1),
    LatEnd = end.getNumber(1)

  /* Trend properties */
  const trend = ee.Dictionary(statistics.get('trend'))

  const r = trend.getNumber('correlation')
  const rsquared = r.pow(2)

  const intercept = trend.getNumber('offset')
  const slope = trend.getNumber('scale')

  /* Summary */
  var summary = ee.Dictionary({
    LongStart, LongEnd,
    LatStart, LatEnd,
    r, rsquared, intercept,
    slope, dt_vec, dist_vec
  })

  return summary.combine(dsas.combine(props))
}

/**
 * Adds information about distances from the baseline to the nearest intersection
 * with the coastline polygon, for every transect in the collection.
 * @param {ee.List} transects the orthogonal transects
 * @param {ee.Geometry} baseline the baseline
 * @param {ee.FeatureCollection} coastlines the coastlines
 */
export function generateTransectsStatistics(transects, baseline, coastlines, keepProps) {
  return transects.map(transect => {
    transect = ee.Feature(transect);

    const distances = calculateDistances(transect, baseline, coastlines);
    const dsas = calculateGeneralDSAS(distances)
    const statistics = ee.Dictionary({ distances }).combine(dsas)
    const exportable = formatExportProperties(transect, statistics, keepProps)

    return transect.setMulti(statistics.combine({ 'export': exportable }));
  });
}

/**
 * Removes noises from the coastline by keeping only
 * the polygons that intersect with all transects.
 * @param coastline : ee.Geometry.MultiLineString
 * @param transects : ee.Geometry.MultiLineString
 * @returns coastline without noise in a ee.Feature(ee.Geometry.LineString)
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

    return polygonFeature.setMulti(value.combine(ee.Dictionary(stats)))
  });

  let collection = ee.FeatureCollection(fullPolygons);

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

  transects = ee.FeatureCollection(transects)
  transects = ee.Algorithms.If(
    ee.Algorithms.IsEqual(transects.size(), 0),
    ee.List([]),
    transects.toList(transects.size())
  );

  return ee.List(transects);
}

export function calculateDistances(transect, baseline, coastlines) {
  const [distanceKey, idKey] = ['distance', 'withRespectTo']
  const poi = transect.intersection(baseline, 1)

  const distances = coastlines.map(coastline => {
    const asFeature = ee.Feature(coastline)

    const intersections = ee.Geometry.MultiPoint(
      transect.intersection(asFeature, 1).geometry().coordinates().flatten()
    ).coordinates()

    const distanceReference = ee.FeatureCollection(intersections.map(coordinate => {
      return ee.Feature(null, {
        [distanceKey]: poi.distance(ee.Geometry.Point(coordinate))
      })
    })).limit(1, distanceKey)

    const meta = ee.Dictionary({
      [idKey]: asFeature.id(),
      date: ee.Date(asFeature.get(Metadata.TIME_START)),
      intersections: intersections.size()
    })

    return ee.Algorithms.If(distanceReference.size().gt(0),
      ee.Feature(distanceReference.toList(1).get(0)).setMulti(meta),
      null)
  }, true)

  const returnKeyring = collection => {
    const asList = collection.toList(collection.size())

    const keys = asList.map(feature => ee.Feature(feature).getString(idKey))
    const values = asList.map(feature => ee.Feature(feature).toDictionary())

    return ee.Dictionary.fromLists(keys, values)
  }

  return ee.Dictionary(ee.Algorithms.If(distances.size().gt(0),
    returnKeyring(distances),
    {}))
}

/**
 * Given a dictionary of a transect's distance set, calculates
 * the general DSAS Statistics: SCE, NSM, EPR, LRR.
 * @param {ee.Dictionary} distances the dictionary of distances of the transect
 */
export function calculateGeneralDSAS(distances) {
  /* General information */
  const distanceList = ee.Dictionary(distances).values()

  const guess = ee.Dictionary(ee.Algorithms.If(distanceList.size().gt(0), distanceList.get(0), {
    date: ee.Date(0), distance: ee.Number(0)
  }))

  const initialState = ee.Dictionary({
    earliest: guess,
    latest: guess,
    closest: guess,
    farthest: guess
  })

  const stats = ee.Dictionary(distanceList.slice(1).iterate((item, acc) => {
    const current = ee.Dictionary(item)
    const state = ee.Dictionary(acc)

    /* by date */
    const minByDate = ee.Dictionary(state.get('earliest'))
    const maxByDate = ee.Dictionary(state.get('latest'))

    const earliest = ee.Algorithms.If(ee.Date(current.get('date')).millis().lt(ee.Date(minByDate.get('date')).millis()),
      current, minByDate)

    const latest = ee.Algorithms.If(ee.Date(current.get('date')).millis().gt(ee.Date(maxByDate.get('date')).millis()),
      current, maxByDate)

    /* by distance */
    const minByDistance = ee.Dictionary(state.get('closest'))
    const maxByDistance = ee.Dictionary(state.get('farthest'))

    const closest = ee.Algorithms.If(current.getNumber('distance').lt(minByDistance.getNumber('distance')),
      current, minByDistance)

    const farthest = ee.Algorithms.If(current.getNumber('distance').gt(maxByDistance.getNumber('distance')),
      current, maxByDistance)

    return { earliest, latest, closest, farthest }
  }, initialState))

  const earliest = ee.Dictionary(stats.get('earliest')),
    latest = ee.Dictionary(stats.get('latest')),
    closest = ee.Dictionary(stats.get('closest')),
    farthest = ee.Dictionary(stats.get('farthest'))

  // SCE
  const sce = farthest.getNumber('distance').subtract(closest.getNumber('distance'))

  // NSM
  const nsm = latest.getNumber('distance').subtract(earliest.getNumber('distance'))

  // EPR
  const epr = nsm.divide(ee.Date(latest.get('date')).difference(earliest.get('date'), 'year'))

  // LRR
  const distribution = distanceList.map(item => {
    const cast = ee.Dictionary(item)
    const x = ee.Date(cast.get('date')).difference(ee.Date(EPOCH), 'day')
    const y = cast.getNumber('distance')
    return [x, y]
  })

  const reducers = combineReducers(ee.Reducer.linearFit(), ee.Reducer.pearsonsCorrelation())

  const trend = ee.Dictionary(distribution.reduce(reducers))
  const scale = trend.get('scale')
  const lrr = ee.Number(ee.Algorithms.If(scale, scale, 0)).multiply(365)

  return ee.Dictionary({
    sce, nsm, epr, lrr, trend, x: distribution
  })
}

export function estevesLabelling(transects) {
  const labels = ee.Dictionary({
    stable: ee.Dictionary({ class: 'Estável', color: '#43a047' }),
    accreted: ee.Dictionary({ class: 'Acrescida', color: '#1976d2' }),
    eroded: ee.Dictionary({ class: 'Erodida', color: '#ffa000' }),
    intenselyEroded: ee.Dictionary({ class: 'Intensamente Erodida', color: '#d32f2f' })
  })

  const classified = transects.map(f => {
    const lrr = ee.Number(ee.Feature(f).get('lrr'))

    const classification =
      ee.Algorithms.If(lrr.lt(-1.0), labels.get('intenselyEroded'),
        ee.Algorithms.If(lrr.lt(-0.5), labels.get('eroded'),
          ee.Algorithms.If(lrr.lt(0.5), labels.get('stable'), labels.get('accreted'))))

    return ee.Feature(f).set(classification)
  })

  return classified;
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
