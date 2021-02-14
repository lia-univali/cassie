import React from 'react'

import { CircularProgress, Fade, MenuItem, Typography } from '@material-ui/core'
import { ExpandMore as Expand } from '@material-ui/icons'

import LayerActions from './LayerActions'
import DropdownButton from '../core/DropdownButton'

const LayerTitle = ({ title, threshold, loading = false }) => {
  const display = threshold && <i>{` (T = ${threshold.toFixed(3)})`}</i>

  return (
    // @TODO has raw css
    <div className='flex1 vcenter'>
      <Typography variant='body1' style={{ margin: '6px 0px' }}>
        {title}{display}
      </Typography>

      <Fade in={loading} unmountOnExit>
        <CircularProgress color='secondary' size={20} thickness={6} style={{ marginLeft: 8 }} />
      </Fade>
    </div>
  )
}

const LayerViewer = ({ layer, index, parent }) => {
  const createMenu = () => {
    return (
      <DropdownButton icon={Expand}>
        <MenuItem>Limiarizar</MenuItem>
      </DropdownButton>
    )
  }

  const { threshold, title /*, visible, opacity, */ } = layer
  const loaded = Boolean(layer.overlay)

  return (
    // @TODO has raw css
    <div className='hexpand'>
      <div className='vcenter'>
        <LayerTitle title={title} threshold={threshold} loading={!loaded} />
        {
          loaded &&
          <LayerActions index={index} layer={layer} parent={parent} />
        }
      </div>
    </div>
  )
}

export default LayerViewer