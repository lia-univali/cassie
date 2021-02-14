import { ee } from '../../services/earth-engine'

const EARTHS_RADIUS = 6371000

const toDegrees = (lng, lat) => {
  lat = lat.multiply(180 / Math.PI)
  lng = lng.multiply(180 / Math.PI)
  return [lng.add(540).mod(360).subtract(180), lat]
}

const toRadians = (value) => {
  return ee.Number(value).multiply(Math.PI / 180)
}

export const computeDisplacement = (lng, lat, theta, distance) => {
  lat = toRadians(lat)
  lng = toRadians(lng)
  theta = ee.Number(theta)
  distance = ee.Number(distance)

  const delta = distance.divide(EARTHS_RADIUS)
  const latLeft = lat.sin().multiply(delta.cos())
  const latRight = lat.cos().multiply(delta.sin()).multiply(theta.cos())
  const newLat = latLeft.add(latRight).asin()

  const lngY = theta.sin().multiply(delta.sin()).multiply(lat.cos())
  const lngX = delta.cos().subtract(lat.sin().multiply(newLat.sin()))
  const newLng = lng.add(lngX.atan2(lngY))

  return toDegrees(newLng, newLat)
}

export const computeBearing = (lng1, lat1, lng2, lat2) => {
  lat1 = toRadians(lat1)
  lat2 = toRadians(lat2)
  lng1 = toRadians(lng1)
  lng2 = toRadians(lng2)

  const deltaLng = lng2.subtract(lng1)
  const y = deltaLng.sin().multiply(lat2.cos())

  const rightTerm = lat1.sin().multiply(lat2.cos()).multiply(deltaLng.cos())
  const x = lat1.cos().multiply(lat2.sin()).subtract(rightTerm)

  return x.atan2(y)
}
