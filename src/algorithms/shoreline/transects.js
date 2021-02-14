import { ee } from '../../services/earth-engine'
import { computeBearing, computeDisplacement } from '../geodesy'
import { INTERNALS } from '../../common/metadata'

const offsetMapper = (extent, origin, theta) => {
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

    return ee.Feature(geometry, {
      [INTERNALS]: { endpoints: geometry.coordinates() }
    });
  };
}

const transectAccumulator = (step, extent) => {
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
    const transects = offsets.map(offsetMapper(extent, b, theta));

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
 * Generates transects orthogonal to the specified polygon.
 * @param {ee.Feature} polygon a Feature describing the area to be covered
 */
 export const generateOrthogonalTransects = (coordinates, step, extent) => {
  coordinates = ee.List(coordinates)

  const first = ee.Dictionary({
    a: ee.List(coordinates.get(0)),
    remainder: 0,
    transects: []
  })

  const result = coordinates
    .slice(1)
    .iterate(transectAccumulator(step, extent), [first])

  let transects = ee
    .List(result)
    .map(dict => ee.Feature(ee.Dictionary(dict).get("transects")))
    .flatten()

  transects = ee.FeatureCollection(transects)
  transects = ee.Algorithms.If(
    ee.Algorithms.IsEqual(transects.size(), 0),
    ee.List([]),
    transects.toList(transects.size())
  )

  return ee.List(transects)
}

export const expandHorizontally = (transects, amount) => {
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
  }

  return transects.map(mapper)
}