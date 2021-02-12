import { ee } from '../../services/earth-engine'
import * as Metadata from '../../common/metadata'

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