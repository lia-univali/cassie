import React from 'react'

import { Box, CircularProgress, Fade, Typography } from '@material-ui/core'

import LayerActions from './LayerActions'

const LayerViewer = ({ layer, index, parent }) => {
  const { title, overlay /*, threshold, visible, opacity, */ } = layer
  const loaded = Boolean(overlay)

  return (
    <Box width='100%' display='flex' alignItems='center'>
      <Box display='flex' alignItems='center' flex={1}>
        <Typography variant='body1' style={{ margin: '6px 0px' }}>
          {title}
        </Typography>
        <Fade in={!loaded} unmountOnExit>
          <CircularProgress color='secondary' size={20} thickness={6} style={{ marginLeft: 8 }} />
        </Fade>
      </Box>
      {
        loaded &&
        <LayerActions index={index} layer={layer} parent={parent} />
      }
    </Box>
  )
}

export default LayerViewer