import ShpWrite from 'shp-write'

/*
  All hereby code was taken and adapted from shp-write lib
  in order to fit this project's requirements.
*/

/* Filter by shape type and adapt it to the shapefile format */
const filterType = (type, esriType) => {
  return (gj) => {
    const oftype = gj.features.filter(isType(type));
    return {
      geometries:
        esriType === "POLYGON"
          ? [oftype.map(fetchCoordinates)]
          : esriType === "POLYLINE"
          ? oftype.map(f => [
              fetchCoordinates(f)
            ]) /* shp-write doesn't handle linestring properly */
          : oftype.map(fetchCoordinates),
      properties: oftype.map(fetchProperties),
      type: esriType
    }
  }
}

/* Take coordinates from feature */
const fetchCoordinates = t => {
  if (
    t.geometry.coordinates[0] !== undefined &&
    t.geometry.coordinates[0][0] !== undefined &&
    t.geometry.coordinates[0][0][0] !== undefined
  ) {
    return t.geometry.coordinates[0]
  } else {
    return t.geometry.coordinates
  }
}

/* Take properties from feature */
const fetchProperties = t => {
  return t.properties
}

const isType = t =>  f => {
  return f.geometry.type === t
}

const take = {
  Points: filterType("Point", "POINT"),
  Lines: filterType("LineString", "POLYLINE"),
  Polygons: filterType("Polygon", "POLYGON")
}

const segregate = gj => {
  const segregated = [take.Points(gj), take.Lines(gj), take.Polygons(gj)]
  
  const filtered = segregated.filter(
    feature => feature.geometries.length && feature.geometries[0].length
  )

  return filtered
}

export default { ...ShpWrite, segregate }