import { ee } from '../../services/earth-engine'
import { combineReducers, stringifyList } from '../utils'
import * as Metadata from '../../common/metadata'
import { EPOCH } from '../../common/utils'

const ESTEVES_LABELS = {
  stable: { class: 'Stable', color: '#43a047' },
  accreted: { class: 'Accreted', color: '#1976d2' },
  eroded: { class: 'Eroded', color: '#ffa000' },
  criticallyEroded: { class: 'Critically Eroded', color: '#d32f2f' }
}

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
export const calculateGeneralDSAS = (distances) => {
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

export const estevesLabelling = (transects) => {
  const classified = transects.map(f => {
      const lrr = ee.Number(ee.Feature(f).get('lrr'))

      const classification =
          ee.Algorithms.If(lrr.lt(-1.0), ESTEVES_LABELS.criticallyEroded,
              ee.Algorithms.If(lrr.lt(-0.5), ESTEVES_LABELS.eroded,
                  ee.Algorithms.If(lrr.lt(0.5), ESTEVES_LABELS.stable, ESTEVES_LABELS.accreted)))

      return ee.Feature(f).set(classification)
  })

  return classified
}

export const formatExportProperties = (transect, statistics, keepProps) => {
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
 * @param {ee.FeatureCollection} shoreline the shorelines
 */
 export const generateTransectsStatistics = (transects, baseline, shorelines, keepProps) => {
  return transects.map(transect => {
    transect = ee.Feature(transect)

    const distances = calculateDistances(transect, baseline, shorelines)
    const dsas = calculateGeneralDSAS(distances)
    const statistics = ee.Dictionary({ distances }).combine(dsas)
    const exportable = formatExportProperties(transect, statistics, keepProps) // @TODO maybe unnecessary

    return transect.setMulti(statistics.combine({ 'export': exportable }))
  })
}