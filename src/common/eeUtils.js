import { ee } from '../services/earth-engine'
import moment from "moment"
import pick from "lodash/pick"
import * as Indices from "./indices"

export const combineReducers = (...reducers) => {
  let group = null

  for (const reducer of reducers) {
    if (group === null) {
      group = reducer
    } else {
      group = group.combine(reducer, "", true)
    }
  }

  return group
}

export const stringifyList = (list) => {
  const flatten = ee.List(list).flatten()

  const returnContent = () => {
    const rtail = flatten.slice(0, -1).iterate((cur, acc) => {
      return ee.String(acc).cat(ee.String(cur)).cat(', ')
    }, ee.String('"['))

    const rhead = ee.String(rtail).cat(list.get(-1)).cat(']"')

    return rhead
  }

  return ee.Algorithms.If(flatten.size().gt(0), returnContent(), ee.String('"[]"'))
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

  console.log("Applying", expression)

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

    let root = ee.ImageCollection(head)

    // tail.forEach(
    //   collection => (root = root.merge(ee.ImageCollection(collection)))
    // )

    return root
  }

  return ee.ImageCollection(collectionSet)
}

export const simplify = amount => feature => {
  return ee.Feature(feature).simplify(amount)
}