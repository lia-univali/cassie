import { ee } from '../../services/earth-engine'
import { combineReducers, stringifyList } from '../utils'
import { TIME_START, INTERNALS, ESTEVES_LABELS } from '../../common/metadata'
import { EPOCH } from '../../common/utils'

export const calculateDistances = (transect, baseline, coastlines) => {
  const [distanceKey, idKey] = ['distance', 'withRespectTo']
  const poi = transect.intersection(baseline, 1)

  const distanceTo = coordinate =>  ee.Feature(null,
    { [distanceKey]: poi.distance(ee.Geometry.Point(coordinate)) })

  const distances = coastlines.map(coastline => {
    const asFeature = ee.Feature(coastline)

    const intersections = ee.Geometry.MultiPoint(
      transect.intersection(asFeature, 1).geometry().coordinates().flatten()).coordinates()

    const distanceReference = ee.FeatureCollection(intersections.map(distanceTo)).limit(1, distanceKey)

    const meta = ee.Dictionary({
      [idKey]: asFeature.id(),
      date: ee.Date(asFeature.get(TIME_START)),
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
 * Classificates the transect change rate using the
 * intervals proposed by Esteves and Finkl (1998)
 * @param {ee.Number} lrr the linear regression rate
 * @returns {ee.String} the classified lrr
 */
export const estevesLabelling = (lrr) => {
  const classification =
      ee.Algorithms.If(lrr.lt(-1.0), ESTEVES_LABELS['Critically Eroded'].class,
          ee.Algorithms.If(lrr.lt(-0.5), ESTEVES_LABELS['Eroded'].class,
              ee.Algorithms.If(lrr.lt(0.5), ESTEVES_LABELS['Stable'].class, ESTEVES_LABELS['Accreted'].class)))

  return ee.String(classification)
}

/**
 * Given a dictionary of a transect's distance set, calculates
 * the general DSAS Statistics (SCE, NSM, EPR, LRR)
 * and Esteves classification
 * @param {ee.Dictionary} measurement the dictionary of distances of the transect
 */
export const calculateStatistics = (measurement) => {
  /* General information */
  const distanceList = ee.Dictionary(measurement).values()
  const count = distanceList.size()

  const guess = ee.Dictionary(ee.Algorithms.If(count.gt(0), distanceList.get(0), {
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
  const regression = distanceList.map(item => {
    const cast = ee.Dictionary(item)
    const x = ee.Date(cast.get('date')).difference(ee.Date(EPOCH), 'day')
    const y = cast.getNumber('distance')
    return [x, y]
  })

  const reducers = combineReducers(ee.Reducer.linearFit(), ee.Reducer.pearsonsCorrelation())

  const trend = ee.Dictionary(regression.reduce(reducers))

  // linearFit
  const intercept = trend.getNumber('offset')
  const slope = trend.getNumber('scale')
  const lrr = ee.Number(ee.Algorithms.If(slope, slope, 0)).multiply(365)

  // pearsons-r
  const r = trend.get('correlation')
  const rsquared = ee.Number(ee.Algorithms.If(r, r, 0)).pow(2)

  // ESTEVES
  const label = estevesLabelling(lrr)

  // Dates
  const firstDate = ee.Date(earliest.get('date')).format('YYYY-MM-dd')
  const lastDate = ee.Date(latest.get('date')).format('YYYY-MM-dd')

  return ee.Dictionary({
    sce, nsm, epr, lrr,
    intercept, slope, r, rsquared, label,
    firstDate, lastDate,
    [INTERNALS]: {
      count, trend, regression
    }
  })
}

export const complementaryProperties = (transect, measurement, keepProps) => {
  const props = ee.Dictionary(ee.Algorithms.If(keepProps, transect.toDictionary(keepProps), {}))

  /* Distances properties  */
  const distanceInfo = measurement.values()

  const dates = stringifyList(distanceInfo.map((item) => ee.Date(ee.Dictionary(item).get('date')).format('YYYY-MM-dd')))
  const distances = stringifyList(distanceInfo.map((item) => ee.Dictionary(item).getNumber('distance')))

  /* Coordinates properties  */
  const coordinates = transect.geometry().coordinates()

  const start = ee.List(coordinates.get(0)),
    end = ee.List(coordinates.get(1))

  const longStart = start.getNumber(0),
    longEnd = end.getNumber(0)

  const latStart = start.getNumber(1),
    latEnd = end.getNumber(1)

  /* Summary */
  var summary = ee.Dictionary({
    longStart, longEnd,
    latStart, latEnd,
    dates, distances
  })

  return summary.combine(props)
}

/**
 * Adds information about **DSAS statistics** and **Esteves classification**
 * while adding useful properties to the transects.
 * *Adds CASSIE internals props*
 * 
 * @param {ee.List} transects the orthogonal transects
 * @param {ee.Geometry} baseline the baseline
 * @param {ee.FeatureCollection} shoreline the shorelines
 * @param {Array<String>} keepProps the array of transect properties to keep
 */
 export const generateTransectsStatistics = (transects, baseline, shorelines, keepProps) => {
  return transects.map(input => {
    const transect = ee.Feature(input)

    /* Retrieve existing internals */
    const rootInternals = ee.Dictionary(transect.get(INTERNALS))

    /**
     * Calculate DSAS, Esteves Classification
     * and add useful properties
     */
    const measurement = calculateDistances(transect, baseline, shorelines)
    const stats = calculateStatistics(measurement)
    const extra = complementaryProperties(transect, measurement, keepProps)

    /* Merge new internals */
    const internals = rootInternals
                        .combine(ee.Dictionary(stats.get(INTERNALS)))
                        .combine({ measurement })

    return transect.setMulti(extra.combine(stats).combine({ [INTERNALS]: internals }))
  })
}