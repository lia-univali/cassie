import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Divider, IconButton, Tooltip, Typography } from '@material-ui/core'
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core'
import { AddCircleOutline as Add, ExpandMore as ExpandIcon } from '@material-ui/icons'

import LayerViewer from './LayerViewer'
import { Actions as Imagery } from '../store/ducks/imagery'


const ImageViewer = ({ image, index }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()

  const hasLayers = image && image.layers && Object.keys(image.layers).length > 0

  return (
    <Accordion defaultExpanded style={{ margin: '1px 1px' }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography variant='body1' className='word-breakable'>
          {image.name}
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        {/* @todo has raw css */}
        <div className='hexpand vcenter flow-column'>
          {
            !hasLayers &&
            <p>{t('forms.imageryOverlay.loading')}</p>
          }
          {
            hasLayers &&
            Object.keys(image.layers).reverse().map((id, i) => (
              <LayerViewer key={i} layer={image.layers[id]} index={id} parent={index} />
            ))
          }
        </div>
      </AccordionDetails>
      <Divider />
      <Tooltip title={t('forms.imageryOverlay.hint')} placement='top'>
        <IconButton onClick={() => dispatch(Imagery.requestExpression(index))}>
          <Add />
        </IconButton>
      </Tooltip>
    </Accordion>
  )
}

export default ImageViewer
