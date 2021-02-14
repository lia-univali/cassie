import pick from 'lodash/pick'
import { ee } from '../../services/earth-engine'
import * as Metadata from '../../common/metadata'
import * as Indices from '../../common/indices'

export const addGridPosition = satellite => {
  return element => {
    const image = ee.Image(element)
    const rawPosition = satellite.computeGridPosition(image)
    const position = ee.Number(rawPosition.path).multiply(100).add(ee.Number(rawPosition.row))

    return image.set({ [Metadata.GRID_POSITION]: position })
  }
}

export const getDate = image => {
  return ee.Date(ee.Image(image).get(Metadata.TIME_START))
}

export const mergeFootprints = (collection) => {
  return ee.FeatureCollection(collection).geometry()
}

export const retrieveExtremes = collection => {
  const dateSorted = collection.sort(Metadata.TIME_START).toList(collection.size())

  // Retrieve the earliest and latest images in the collection
  return {
    earliest: getDate(ee.Image(dateSorted.get(0))),
    latest: getDate(ee.Image(dateSorted.get(-1))),
  }
}

export const mergeProperties = collection => {
  const sensorKey = "SENSOR_ID"

  // Date of the earliest image in the collection
  const first = ee.List(collection.sort(Metadata.TIME_START).toList(1)).get(0)
  const date = getDate(first)
  // const sensor = ee.Image(first).get(sensorKey);

  return {
    [Metadata.NAME]: date.format("'IMG_'YYYY-MM-dd"),
    [Metadata.FOOTPRINT]: mergeFootprints(collection),
    [Metadata.TIME_START]: date,
    [sensorKey]: "TM",
  }
}

export const combineReducers = (...reducers) => {
  let group = null

  for (const reducer of reducers) {
    if (group === null) {
      group = reducer
    } else {
      group = group.combine(reducer, '', true)
    }
  }

  return group
}

export const stringifyList = (subject) => {
  return ee.String('[').cat(ee.List(subject).join(',')).cat(']')
}

export const generateVisualizationParams = mission => {
  const { red, green, blue } = mission.bands
  return {
    ...mission.vizParams,
    bands: [red, green, blue]
  }
}

export const evaluate = query => {
  return query.evaluate.bind(query)
}

export const applyExpression = (image, expressionOrLabel, bands) => {
  const index = Indices.all().find(index => index.label === expressionOrLabel)

  const expression = index !== undefined ? index.expression : expressionOrLabel

  return image.expression(expression, {
    RED: image.select(bands.red),
    GREEN: image.select(bands.green),
    BLUE: image.select(bands.blue),
    NIR: image.select(bands.nir),
    SWIR: image.select(bands.swir)
  })
}

export const imageToKey = image => {
  return JSON.stringify(pick(image, "id", "version"))
}

export const getSatelliteCollection = satellite => {
  const { collectionSet } = satellite

  if (Array.isArray(collectionSet)) {
    const [head, ...tail] = collectionSet

    return ee.ImageCollection(head)
  }

  return ee.ImageCollection(collectionSet)
}

export const simplify = amount => feature => {
  return ee.Feature(feature).simplify(amount)
}