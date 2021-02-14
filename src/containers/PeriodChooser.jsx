import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next'
import { first, last } from 'lodash'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import TimePeriodSelector from '../components/TimePeriodSelector'
import StepperButtons from '../components/StepperButtons'
import CloudSelector from '../components/CloudSelector'
import ActivityIndicator from './ActivityIndicator.jsx'

import { loadAvailableImages, setAvailableDates } from '../store/ducks/acquisition'
import { formatDate, formatDateDiff, datesBetween } from '../common/utils'
import { uniteMissionsDates } from '../common/algorithms'

const useStyles = makeStyles(theme => ({
  description: {
    margin: theme.spacing(7, 0, 3)
  }
}))

const PeriodChooser = ({ navigate }) => {
  const dates = useSelector(state => state.acquisition.availableDates, shallowEqual)
  const missions = useSelector(state => state.acquisition.missions, shallowEqual)
  const working = useSelector(state => state.common.working)

  const dispatch = useDispatch()
  const [t] = useTranslation()
  const classes = useStyles()

  const [cloudLevel, setCloudLevel] = useState(1)
  const [period, setPeriod] = useState([])
  const [start, end] = period

  useEffect(() => {
    dispatch(loadAvailableImages())
  }, [dispatch])

  useEffect(() => {
    if (dates) {
      setPeriod([first(dates).date, last(dates).date])
    }
  }, [dates])

  const selectDates = () => {
    return uniteMissionsDates(missions).filter(entry => entry.content <= cloudLevel);
  }

  const handleNext = () => {
    const dates = selectDates().filter(entry => entry.date >= start && entry.date <= end);

    dispatch(setAvailableDates(dates))
  }

  if (working === true || !dates) {
    return <ActivityIndicator textual />
  }

  const flatten = selectDates().map(entry => entry.date);
  const length = datesBetween(flatten, start, end).length;

  return (
    // @TODO has raw CSS
    <div className="vcenter flow-column margin-above">
      <TimePeriodSelector dates={flatten} start={start} end={end}
        onChange={(start, end) => setPeriod([start, end])}
      />

      <div className={classes.description}>
        <Typography variant="subtitle1" align="center">
          {t('forms.acquisition.3.period')}: {formatDate(start)} {t('forms.acquisition.3.to')} {formatDate(end)}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {formatDateDiff(start, end)}, {length} {t('forms.acquisition.3.imageQuantity')}
        </Typography>
      </div>

      <CloudSelector
        level={cloudLevel}
        onChange={cloudLevel => setCloudLevel(cloudLevel)}
      />

      <StepperButtons navigate={navigate} onNext={handleNext} />
    </div>
  )
}

export default PeriodChooser
