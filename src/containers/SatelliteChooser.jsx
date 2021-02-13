import React from 'react'
import { useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import SatelliteCard from '../components/SatelliteCard'
import { NEXT } from './AcquisitionPage'

import { standard } from '../common/satellites'
import { setSatellite } from '../store/ducks/acquisition'

const useStyles = makeStyles(theme => ({
  content: {
    "&:not(:first-child)": {
      borderLeft: `1px solid ${theme.palette.divider}`,
    }
  }
}))

const SatelliteChooser = ({ navigate }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleChoice = (index) => {
    dispatch(setSatellite(index))
    navigate(NEXT)
  }

  const spacecrafts = standard

  return (
    <Grid container spacing={0} justify="center">
      {
        spacecrafts.map((satellite, i) => (
          <Grid item key={i} xs={4} className={classes.content}>
            <SatelliteCard
              name={satellite.name}
              provider={satellite.provider}
              image={satellite.image}
              cycle={satellite.summary.cycle}
              startYear={satellite.summary.startYear}
              endYear={satellite.summary.endYear}
              resolution={satellite.summary.opticalResolution}
              onChoose={() => handleChoice(i)}
              enabled={satellite.enabled}
            />
          </Grid>
        ))
      }
    </Grid>
  )
}

export default SatelliteChooser
