import React, { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { push } from 'connected-react-router'
import { Redirect, Switch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Divider, Grid, Paper, Step, StepLabel, Stepper, Typography } from '@material-ui/core'

import SatelliteChooser from './SatelliteChooser'
import AOIChooser from './AOIChooser'
import PeriodChooser from './PeriodChooser'
import ImageListRefiner from './ImageListRefiner'
import Footer from '../components/Footer'

import { getAcquisitionParameters } from '../selectors'
import { Actions as Auth } from '../store/ducks/auth'

export const PREVIOUS = -1
export const FIRST = 0
export const NEXT = 1
export const FINALIZE = 2

const STEPS = [
  {
    label: 'forms.acquisition.1.title',
    content: 'forms.acquisition.1.description',
    component: SatelliteChooser,
  },
  {
    label: 'forms.acquisition.2.title',
    content: 'forms.acquisition.2.description',
    requires: "satellite",
    component: AOIChooser,
  },
  {
    label: 'forms.acquisition.3.title',
    content: 'forms.acquisition.3.description',
    requires: "geometry",
    component: PeriodChooser,
  },
  {
    label: 'forms.acquisition.4.title',
    content: 'forms.acquisition.4.description',
    requires: "availableDates",
    component: ImageListRefiner,
  }
]

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    flexFlow: "column",
    flexGrow: 1,
  },
  header: {
    backgroundColor: theme.palette.primary[400],
    padding: theme.spacing(6, 0, 16),
  },
  title: {
    color: "white",
  },
  content: {
    width: 1000,
    marginTop: theme.spacing(-9),
  },
  instructions: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  }
}))

const AcquisitionPage = (props) => {
  const acquisitionData = useSelector(getAcquisitionParameters, shallowEqual)

  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()

  const { match } = props

  const stepAttendsRequirements = () => {
    const { params } = match

    const hasStep = params.step !== undefined
    const step = hasStep ? params.step - 1 : 0

    const stepData = STEPS[step]
    return (!("requires" in stepData) || stepData.requires in acquisitionData)
  }

  useEffect(() => {
    dispatch(Auth.begin())

    if (!stepAttendsRequirements()) {
      navigate(FIRST)
    }
  }, [dispatch])

  const extractPath = (hasStep) => {
    return hasStep ? match.url.substring(0, match.url.lastIndexOf("/")) : match.url
  }

  const navigate = (direction) => {
    const path = extractPath(true)
    const { step } = match.params

    if (direction === NEXT || direction === PREVIOUS) {
      dispatch(push(`${path}/${parseInt(step, 10) + direction}`))
    } else if (direction === FIRST) {
      dispatch(push(`${path}/1`))
    } else if (direction === FINALIZE) {
      dispatch(push("/main/processing"))
    }
  }

  const renderStep = (props, Component) => {
    if (stepAttendsRequirements()) {
      return <Component {...props} navigate={direction => navigate(direction)} />
    }

    return null
  }

  const makeRoutes = (hasStep) => {
    const path = extractPath(hasStep)

    return STEPS.map((el, i) => {
      const id = i + 1
      const Component = el.component

      return (
        <Route key={id} path={`${path}/${id}`} render={props => renderStep({ ...props, ...acquisitionData }, Component)} />
      )
    }).concat(
      <Redirect key={0} from={path} to={path + "/1"} />
    )
  }

  const hasStep = match.params.step !== undefined
  const step = hasStep ? match.params.step - 1 : 0

  return (
    // @TODO has raw css
    <div className={classes.wrapper}>
      <Grid container spacing={0} justify="center">
        <Grid item xs={12} className={classes.header}>
          <div>
            <Typography variant="h4" align="center" className={classes.title}>
              {t('forms.acquisition.title')}
            </Typography>
          </div>
        </Grid>
        <Grid item className="vcenter flow-column">
          <Paper className={classes.content} elevation={1}>
            <Stepper activeStep={step}>
              {
                STEPS.map((el, i) => (
                  <Step key={i}>
                    <StepLabel>{t(el.label)}</StepLabel>
                  </Step>
                ))
              }
            </Stepper>
            <Typography variant="subtitle1" align="center" className={classes.instructions}>
              {t(STEPS[step].content)}
            </Typography>
            <Divider />
            <Switch>
              {makeRoutes(hasStep)}
            </Switch>
          </Paper>
        </Grid>
      </Grid>

      <Footer />
    </div>
  )
}

export default AcquisitionPage
