import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ee from '../services/earth-engine'

import { makeStyles } from '@material-ui/core/styles'
import { Button, FormControlLabel, Switch } from '@material-ui/core'

import GoogleMap, { DEFAULT_ZOOM } from '../components/GoogleMap'
import StepperButtons from '../components/StepperButtons'
import * as Map from '../common/map'
import { setAOI } from '../store/ducks/acquisition'

const useStyles = makeStyles(theme => ({
  map: {
    width: 1000,
    height: 500,
  }
}))

const isAboveThreshold = (zoom) => {
  return zoom > 4
}

const AOIChooser = ({ navigate }) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()

  const [visible, setVisible] = useState(isAboveThreshold(DEFAULT_ZOOM))
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM)
  const [switchDisabled, setSwitchDisabled] = useState(false)
  const [overlay, setOverlay] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [wrs, setWrs] = useState(null) // @TODO enable this

  const changeDelimiterVisibility = (visible) => {
    /*
    if (visible) {
      Map.displayElement(wrs)
    } else {
      Map.hideElement(wrs)
    }
    */
    setVisible(visible)
  }

  const handleZoomChange = (updatedLevel) => {
    const prevVisible = isAboveThreshold(zoomLevel)
    const visible = isAboveThreshold(updatedLevel)

    if (visible !== prevVisible) {
      changeDelimiterVisibility(visible)
    }

    setZoomLevel(updatedLevel)
    setSwitchDisabled(!visible)
  }

  useEffect(() => {
    Map.onZoomChange(zoomLevel => handleZoomChange(zoomLevel))
    Map.setDrawingControlsVisible(true)

    return () => {
      Map.onZoomChange(() => { })
    }
  }, [])

  const handleDrawing = (overlay, coordinates) => {
    setOverlay(overlay)
    setCoordinates(coordinates)

    Map.setDrawingControlsVisible(false);
  }

  const handleUndo = () => {
    overlay.setMap(null)

    setOverlay(null)
    setCoordinates(null)

    Map.setDrawingControlsVisible(true)
  }

  const handleSwitchChange = (event) => {
    changeDelimiterVisibility(event.target.checked)
  }

  const handleChoose = () => {
    dispatch(setAOI(overlay, coordinates, ee.Geometry.Polygon([coordinates])))
  }

  const drawn = Boolean(coordinates)

  return (
    // @TODO has raw css
    <div className="vcenter flow-column">
      <FormControlLabel label={t('forms.acquisition.2.showDelimiters')}
        control={
          <Switch
            checked={visible}
            disabled={switchDisabled}
            onChange={handleSwitchChange} />
        }
      />
      <GoogleMap
        style={{ width: 1000, height: 500 }}
        onRegionDrawn={handleDrawing}
      />
      <StepperButtons navigate={navigate} nextDisabled={drawn === false} onNext={handleChoose}>
        <Button onClick={handleUndo} disabled={drawn === false} color="secondary" variant="outlined">
          {t('forms.acquisition.2.undo')}
        </Button>
      </StepperButtons>
    </div>
  )
}

export default AOIChooser
