import React from 'react'

import { Box, CircularProgress } from '@material-ui/core'

const SatelliteThumbnail = ({ url, height }) => {
  return (
    <Box height={height} >
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
    </Box>
  )
}

export default SatelliteThumbnail