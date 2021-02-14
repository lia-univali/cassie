import React from 'react'

import { CircularProgress } from '@material-ui/core'

const SatelliteThumbnail = ({ url, height }) => {
  return (
    <div style={{ height: height, display: 'flex', alignItems: 'center' }}>
      {
        url &&
        <a href={url}>
          <img src={url} alt='Satellite Thumbnail' style={{ maxHeight: height }} />
        </a>
      }
      {
        !url &&
        <CircularProgress />
      }
    </div>
  )
}

export default SatelliteThumbnail