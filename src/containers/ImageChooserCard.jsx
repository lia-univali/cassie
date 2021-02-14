import React, { useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Box, Collapse, Divider, IconButton, Typography } from '@material-ui/core'
import { Card, CardHeader, CardContent, CardActions} from '@material-ui/core'
import { ExpandMore as MoreIcon, ExpandLess as LessIcon } from '@material-ui/icons'

import ImageChooserForm from '../components/ImageChooserForm'
import ActionList from './ActionList'
import { acquireImage } from '../store/ducks/acquisition'

const ImageChooserCard = ({ className }) => {
  const availableDates = useSelector(state => state.acquisition.availableDates)
  const satellite = useSelector(state => state.acquisition.satellite, shallowEqual)

  const dispatch = useDispatch()
  const [t] = useTranslation()

  const [expanded, setExpanded] = useState(true)

  return availableDates === undefined ? null : (
    <Card className={className} style={{ margin: 12 }}>
      <CardHeader
        title={t('forms.imageChooser.title')}
        subheader={`${availableDates.length} ${t('forms.imageChooser.resultQuantity')}`}
      />

      <Divider />

      <CardContent>
        <ImageChooserForm
          images={availableDates}
          disabledPredicate={i => false}
          onLoadRequested={i => dispatch(acquireImage(availableDates[i].name, availableDates[i].date))}
          formatter={i => satellite.get(availableDates[i].name).format}
        />
      </CardContent>

      <Divider />

      <CardActions>
        {/* @TODO has raw css */}
        <Box flex='1'>
          <Typography variant='subtitle1'>{t('forms.imageChooser.actions.title')}</Typography>
        </Box>
        <IconButton onClick={() => setExpanded(expanded => !expanded)}>
          {expanded ? <LessIcon /> : <MoreIcon />}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <ActionList name='actions' />
      </Collapse>
    </Card>
  )
}

export default ImageChooserCard
