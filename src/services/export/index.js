import ShpWrite from './shapefile'
import JSZip from 'jszip'

const defaultOptions = {
  device: {
    shapefile: (
      name = 'layers',
      point = 'points',
      polygon = 'polygons',
      line = 'lines'
    ) => ({
      folder: name,
      types: {
        point,
        polygon,
        line
      }
    }),

    shapefileGroup: (group = 'layers', ...names) => ({
      folder: group,
      names
    })
  }
}

/*  Common exportation tool, when the data type doesn't matter 
    to the method. */
const any = {
  /* User's computer */
  toDevice: {
    /* triggers download */
    trigger: (blob, filename) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  } /* toDevice */
}

/* Export DataView based shapefile ({shp, .shx, .dbf}) */
const shapefile = {
  toDevice: {
    asZippedFolder: (shapefiles, options) => {
      const zip = new JSZip()
      const layers = zip.folder(options.folder)

      shapefiles.forEach((shapefile, i) => {
        layers.file(options.names[i] + '.shp', shapefile.shp.buffer, {
          binary: true
        })
        layers.file(options.names[i] + '.shx', shapefile.shx.buffer, {
          binary: true
        })
        layers.file(options.names[i] + '.dbf', shapefile.dbf.buffer, {
          binary: true
        })
      })

      zip.generateAsync({ type: 'blob', compression: 'STORE' }).then(zipped => {
        any.toDevice.trigger(zipped, options.folder + '.zip')
      })
    }
  } /* toDevice */
}

/* FeatureCollection */
const table = {
  /* Export (convert) a feature collection into a shapefile */
  toShapefile: {
    one: collection => {
      const [shapes] = ShpWrite.segregate(collection)
      const buffer = []

      /* ShpWrite uses callback even though the function is synchronous */
      ShpWrite.write(
        shapes.properties,
        shapes.type,
        shapes.geometries,
        (err, res) => {
          /* err is always null */
          buffer.push(res)
        }
      )

      const [shapefile] = buffer

      return shapefile
    },

    many: collections => {
      return collections.map(collection => {
        return table.toShapefile.one(collection)
      })
    }
  } /* toShapefile */,

  toDevice: {
    asShapefile: (collection, options = defaultOptions.device.shapefile()) => {
      ShpWrite.download(collection, options)
    },

    asShapefileGroup: (
      collections,
      options = defaultOptions.device.shapefileGroup()
    ) => {
      const shapefiles = table.toShapefile.many(collections)

      shapefile.toDevice.asZippedFolder(shapefiles, options)
    }
  } /* toDevice */
}

export default { defaultOptions, any, shapefile, table }