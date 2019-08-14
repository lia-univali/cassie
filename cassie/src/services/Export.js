import ShpWrite from "./Shapefile";

/* FeatureCollection */
const table = {
  /* Export collection to user's computer */
  toDevice: {
    /* Export as Shapefile */
    asShapefile: (collection, name) => {
      ShpWrite.download(collection, {
        folder: name,
        types: {
          point: "points",
          polygon: "polygons",
          line: "lines"
        }
      });

      console.log("called");
    } // shp
  } // toDevice
};

export default { table };
