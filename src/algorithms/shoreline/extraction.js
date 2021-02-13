import { ee } from '../../services/earth-engine'
import { computeBearing, computeDisplacement } from '../geodesy'
import * as Metadata from '../../common/metadata'
import { getDate } from '../utils';

/**
 * Partitions the raster *image* using the water index
 * and the threshold function, then reduces the output
 * raster to vector, corresponding to the water body in
 * the given *image*.
 * @param {ee.Image} image 
 * @param {ee.Geometry} geometry 
 * @param {Number} scale 
 * @param {Object} bands 
 * @param {Function} thresholdFn Threshold supplier function
 * @returns {ee.Geometry} the identified water body
 */
export const identifyWaterFeature = (image, geometry, scale, bands, thresholdFn) => {
  const internalBandName = 'NDWI'

  /* Produce water index */
  const ndwi = ee.Image(image)
    .normalizedDifference([bands.green, bands.nir])
    .rename(internalBandName)

  const threshold = thresholdFn(ndwi, internalBandName, geometry, scale)

  /**
   * Partitions image and reduces to a single vector
   */
  const water = ee.Feature(
    ndwi
      .clip(geometry)
      .gt(threshold)
      .reduceToVectors({ scale, maxPixels: 1e12 })
      .filter(ee.Filter.eq('label', 1))
      .limit(1, 'count', false)
      .first()
  )

  return water.geometry()
}

/**
 * Removes noises from the shoreline by keeping only
 * the polygons that have the most intersections with
 * the transects
 * @param {ee.Geometry.MultiLineString} shoreline
 * @param {ee.Geometry.MultiLineString|ee.FeatureCollection} transects
 * @returns {ee.Feature<ee.Geometry.LineString>} shoreline without noise
 */
 export const removeShorelineNoise = (shorelines, transects) => {
  const coordinates = ee.Geometry(shorelines).coordinates()

  const guard = ee.List(
            ee.Algorithms.If(ee.Geometry(shorelines).type().compareTo('MultiLineString').eq(0),
            coordinates, [coordinates]))

  const weighted = guard.map(segment => {
    const linestring = ee.Geometry.LineString(segment)
    return ee.Feature(linestring, {
      weight: linestring.intersection(transects).coordinates().size()
    })
  })

  return ee.Feature(ee.FeatureCollection(weighted).limit(1, 'weight', false).first()).geometry()
}

/**
 * Creates a gaussian kernel controlled by *size*, *mean*
 * and *sigma*. The output kernel size is always odd.
 * @param {Number} size 
 * @param {Number} mean 
 * @param {Number} sigma 
 */
export const gaussianKernel = (size, mean, sigma) => {
  const gaussianCurve = (x, mean, sigma) => {
    const divider = ee.Number(sigma).multiply(ee.Number(2).multiply(Math.PI).sqrt())
    const exponent = ee.Number(-1).multiply(ee.Number(x).subtract(mean).pow(2).divide(ee.Number(2).multiply(ee.Number(sigma).pow(2))))
  
    return ee.Number(1).divide(divider).multiply(exponent.exp())
  }
  
  const half = ee.Number(size).divide(2).floor()

  const begin = ee.Number(0).subtract(half),
    end = ee.Number(0).add(half)

  // Get the normal distribution Y value for each X
  // in the interval
  const kernel = ee.List.sequence(begin, end).map(i => gaussianCurve(i, mean, sigma))

  const sum = kernel.reduce(ee.Reducer.sum())

  // Normalize each value, so that the sum of the list
  // will be equal to one
  const normalizedKernel = kernel.map(val => ee.Number(val).divide(sum))

  return normalizedKernel
}

/**
 * Convolves over the list *coordinates* producing local averages
 * weighted by the produced kernel of *samples*, *mean*, *sd*.
 * The result is a smoothed list (often linestring) with removed noises
 * such as pixel-induced staircase effect.
 * @param {ee.List} coordinates List containing the path
 * @param {ee.Number} samples Size of the kernel
 * @param {ee.Number} mean Center of the normal distribution
 * @param {ee.Number} sd Standard Deviation, controls the size of the bell-shaped curve
 */
export const linearGaussianFilter = (coordinates, samples = 3, mean = 0, sd = 0.75) => {
  const coordinateList = ee.List(coordinates)

  // Setup gauss distribution kernel parameters
  const kernelSize = ee.Number(samples)
  const kernelMean = ee.Number(mean)
  const kernelSd = ee.Number(sd)
  const kernel = gaussianKernel(kernelSize, kernelMean, kernelSd)

  const first = coordinateList.reduce(ee.Reducer.first()),
    last = coordinateList.reduce(ee.Reducer.last())

  const sequence = ee.List.sequence(ee.Number(0), coordinateList.length().subtract(kernelSize))

  const path = sequence.map(index => {
    // Take interval of the kernel size to apply the smoothing
    // and zip it to the kernel, so each element in the new list
    // will be a pair of a 2d point and its weight
    const interval = coordinateList.slice(ee.Number(index), ee.Number(index).add(kernelSize)).zip(kernel)

    // Map the elements, multiplying their axis values by their weight
    const gaussian = interval.map(element => {
      // Each element contains a 2d point (0) and a kernel weight (1)
      const asList = ee.List(element)

      const point = ee.List(asList.get(0))
      const weight = ee.Number(asList.get(1))

      // Now we map the two values (each point dimention), multiplying to the weight
      return point.map(value => ee.Number(value).multiply(weight))
    })

    // Sum longitude and latitude separately
    const smoothenLong = gaussian.map(point => ee.List(point).get(0)).reduce(ee.Reducer.sum())
    const smoothenLat = gaussian.map(point => ee.List(point).get(1)).reduce(ee.Reducer.sum())

    // Return final smoothen point
    return ee.List([smoothenLong, smoothenLat]);
  })

  const smoothen = ee.List([]).add(first).cat(path).add(last)

  // return original coordinates if the kernelSize is less than or equal to the length
  // of the given coordinates, otherwise return smoothen coordinates.
  return ee.Algorithms.If(coordinateList.size().lte(kernelSize), coordinateList, smoothen);
}

/**
 * Given a histogram, find the appropriate thresholds for {count} classes
 * @param {ee.Dictionary} histogram 
 * @param {Number} count 
 */
export const thresholdingAlgorithm = (histogram, count) => {
  const counts = ee.Array(ee.Dictionary(histogram).get('histogram'))
  const means = ee.Array(ee.Dictionary(histogram).get('bucketMeans'))
  
  const size = means.length().get([0])
  const total = counts.reduce(ee.Reducer.sum(), [0]).get([0])
  
  const sum = means.multiply(counts).reduce(ee.Reducer.sum(), [0]).get([0])
  const mean = sum.divide(total)

  const bss = ee.List.sequence(1, size).map((i) => {
    const aCounts = counts.slice(0, 0, i)
    const aCount = aCounts.reduce(ee.Reducer.sum(), [0]).get([0])
    const aMeans = means.slice(0, 0, i)
    const aMean = aMeans.multiply(aCounts)
      .reduce(ee.Reducer.sum(), [0]).get([0])
      .divide(aCount)
    const bCount = total.subtract(aCount)
    const bMean = sum.subtract(aCount.multiply(aMean)).divide(bCount)
    return aCount.multiply(aMean.subtract(mean).pow(2)).add(
      bCount.multiply(bMean.subtract(mean).pow(2)))
  })

  return means.sort(bss).get([-1])
}

/**
 * Selects the threshold function according to
 * the input *threshold*.
 * This will be refactored to use something other than
 * a number to choose the intended threshold function.
 * @param {Number} threshold 
 * @returns {Function} the thresholding function
 */
const selectThreshold = (threshold) => {
  switch (threshold) {
    case 0.0:
      return (image, band, _, scale) => 
        thresholdingAlgorithm(image.reduceRegion({ reducer: ee.Reducer.histogram(), scale, maxPixels: 1e12 }).get(band), 2)
    case -1.0:
      return (image, band, _, scale) =>
        thresholdingAlgorithm(image.reduceRegion({ reducer: ee.Reducer.histogram(), scale, maxPixels: 1e12 }).get(band), 3)
    default:
      return () => threshold
  }
}

/**
 * Extracts the raw shoreline of the given *image*,
 * by identifying the water feature (body) and
 * converting it into linestrings
 * @param {ee.Image} image 
 * @param {ee.Geometry} geometry 
 * @param {Number} scale 
 * @param {Object} bands 
 * @param {Function} thresholdFn
 * @returns {ee.Geometry.MultiLineString}
 */
export const extractShoreline = (image, geometry, scale, bands, thresholdFn) => {
  const waterSegment = identifyWaterFeature(image, geometry, scale, bands, thresholdFn)
  
  return ee.Geometry.MultiLineString(waterSegment.coordinates())
            .intersection(geometry.buffer(-10))
}

/**
 * Fully derives the shoreline using the satellite *image*.
 * The satellite derived shoreline is a single smoothed linestring
 * without noisy features (polygons that are not the shoreline).
 * @param {ee.Image} image
 * @param {ee.Geometry} geometry
 * @param {Number} scale
 * @param {Object} bands
 * @param {Function} threshold
 * @param {ee.FeatureCollection|ee.List} transects
 * @param {Array<String>} props
 */
export const deriveShoreline = (image, geometry, scale, bands, threshold, transects, props) => {
  const transectsGeometry = ee.FeatureCollection(transects).geometry()

  const shoreline = extractShoreline(image, geometry, scale, bands, selectThreshold(threshold))
  const enhanced = removeShorelineNoise(shoreline, transectsGeometry)
  const smoothen = linearGaussianFilter(enhanced.coordinates())

  return ee.Feature(ee.Geometry.LineString(smoothen), {
    [Metadata.TIME_START]: ee.Date(getDate(image)).format("YYYY-MM-dd")
  })
}

/**
 * Acquires and extracts shorelines given an array of dates
 * @param  {Array} dates a list containing the dates of the images to be analysed
 * @param  {Object} satellite information about the satellite
 * @param  {ee.Geometry} geometry the Area of Interest of the this  session
 * @param  {ee.Number} threshold Suggested threshold for the extraction
 * @return {ee.FeatureCollection} a FeatureCollection of polygons
 */
 export const deriveShorelines = (dates, satellite, geometry, scale, threshold, transects) => {
  const data = dates.map(value => {
    const mission = satellite.missions.find(mission => mission.name === value.name)

    return deriveShoreline(
      ee.Image(mission.algorithms.acquire(value.date, geometry)),
      geometry, scale, mission.bands, threshold, transects, null
    )
  })

  return data
}

/**
 * Expands the given *coordinates* by an amount *distance*
 * @param {} coordinates 
 * @param {} distance 
 */
export const expandCoastline = (coordinates, distance) => {
  coordinates = ee.List(coordinates)
  const neighbors = ee.List(coordinates.slice(1))

  let displacedSegments = coordinates.zip(neighbors).map(segment => {
    segment = ee.List(segment)
    const current = ee.List(segment.get(0))
    const neighbor = ee.List(segment.get(1))
    const bearing = computeBearing(
      current.get(0),
      current.get(1),
      neighbor.get(0),
      neighbor.get(1)
    )

    const p1 = computeDisplacement(
      current.get(0),
      current.get(1),
      bearing.add(Math.PI * 0.5),
      distance
    )
    const p2 = computeDisplacement(
      neighbor.get(0),
      neighbor.get(1),
      bearing.add(Math.PI * 0.5),
      distance
    )
    return ee.List([p1, p2]);
  })

  displacedSegments = rectifyJunctions(displacedSegments, coordinates)
  const combined = coordinates.reverse().splice(0, 0, displacedSegments)

  return ee.Feature(ee.Geometry.Polygon([combined]))
}

/**
 * Normalizes the junctions *segments*
 * @param {} segments 
 * @param {} originalCoordinates 
 */
const rectifyJunctions = (segments, originalCoordinates) => {
  segments = ee.List(segments)
  originalCoordinates = ee.List(originalCoordinates).slice(1)
  const neighbors = ee.List(segments.slice(1))

  let processed = ee.List.sequence({ start: 0, count: neighbors.size() }).map(
    index => {
      const currentSegment = ee.List(segments.get(index))
      const neighborSegment = ee.List(neighbors.get(index))
      const original = ee.List(originalCoordinates.get(index))

      const previous = ee.List(currentSegment.get(1))
      const next = ee.List(neighborSegment.get(0))

      const alpha = computeBearing(original.get(0), original.get(1), previous.get(0), previous.get(1))
      const beta = computeBearing(original.get(0), original.get(1), next.get(0), next.get(1))
      const difference = alpha.subtract(beta) // Angle between previous and next
      const halfDifference = difference.divide(2)
      const theta = beta.add(halfDifference)

      const adjacent = ee.Geometry.Point(original).distance(ee.Geometry.Point(next))
      const length = ee.Number(adjacent).divide(halfDifference.cos()) // cosθ = adjacent / hypotenuse

      const centroid = computeDisplacement(
        original.get(0),
        original.get(1),
        theta,
        length
      )

      return centroid
    }
  )

  const first = ee.List(ee.List(segments.get(0)).get(0)) // Start of the first segment
  const last = ee.List(ee.List(segments.get(-1)).get(1)) // End of the last segment

  processed = ee.List(processed)
  processed = processed.insert(0, ee.List([first.get(0), first.get(1)]))
  processed = processed.add(ee.List([last.get(0), last.get(1)]))

  return processed
}