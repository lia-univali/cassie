import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import ee from '../../../services/earth-engine' // @TODO remove this!

import { Box, Grid, Grow } from '@material-ui/core'

import GoogleMap from '../../../components/GoogleMap'
import ImageChooserCard from '../../../containers/ImageChooserCard'
import { ShapeList } from '../../components'
import LoadedImagesAccordion from '../../../containers/LoadedImagesAccordion'

import { addEEFeature, centralizeMap } from '../../../store/ducks/map'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxHeight: "calc(100vh - 64px)",
    flexGrow: 1,
    position: 'relative',
  },
  mapContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flexFlow: 'column',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
    '& > *': {
      pointerEvents: 'none',
      '& > *': {
        pointerEvents: 'auto',
      }
    }
  }
}))

const ProcessingPage = () => {
  const isDrawing = useSelector(state => state.map.currentlyDrawing)
  const coordinates = useSelector(state => state.acquisition.coordinates)

  const dispatch = useDispatch()
  const classes = useStyles()

  const displayROI = () => {
    if (coordinates) {
      const feature = ee.Feature(ee.Geometry.Polygon([coordinates]))
      const border = feature.buffer(15).difference(feature)

      dispatch(addEEFeature(border, 'forms.map.roi', "#00A391", 0.6))
      dispatch(centralizeMap(coordinates))
    }
  }

  return (
    <Box className={classes.wrapper}>
      <Grow in={!isDrawing} unmountOnExit>
        <Grid container justify="center" spacing={0} className={classes.mapOverlay}>
          <Grid item xs={9} className={classes.mapContainer}>
            <ShapeList />
            <ImageChooserCard />
          </Grid>
          <Grid item xs={3}>
            <LoadedImagesAccordion />
          </Grid>
        </Grid>
      </Grow>

      <GoogleMap
        onLoad={displayROI}
        style={{ position: 'absolute' }}
      />
    </Box>
  );
}

export default ProcessingPage
