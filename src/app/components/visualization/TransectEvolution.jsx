import React from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import EvolutionChart from '../../../components/EvolutionChart'
import { INTERNALS } from '../../../common/metadata'
import { fromEpoch } from '../../../common/utils'

const generateRegression = (slope, intercept, x) => {
  return x.map(values => {
    return values[0] * slope + intercept
  })
}

const formatted = (value, units = '', places = 4) => {
  if (units.length > 0) {
    units = ' ' + units
  }

  return isNaN(value)
          ? (Number(1).toFixed(places) + units)
          : (value.toFixed(places) + units)
}

const TransectEvolution = ({ data }) => {
  const [t] = useTranslation()

  const metadata = {
    [t('forms.transectEvolution.lrr')]: formatted(data.lrr, t('forms.transectEvolution.units.mByYr')),
    [t('forms.transectEvolution.r')]: formatted(data.r),
    [t('forms.transectEvolution.sce')]: formatted(data.sce, t('forms.transectEvolution.units.meters')),
    [t('forms.transectEvolution.nsm')]: formatted(data.nsm, t('forms.transectEvolution.units.meters')),
    [t('forms.transectEvolution.epr')]: formatted(data.epr, t('forms.transectEvolution.units.mByMonth')),
    [t('forms.transectEvolution.label')]: data.label
  }

  const sortedValues = data[INTERNALS].regression.sort()
  const regression = generateRegression(data.slope, data.intercept, sortedValues)

  return (
    <div>
      <EvolutionChart
        x={sortedValues.map(el => fromEpoch(el[0], 'days').utc().format())}
        y={sortedValues.map(el => el[1])}
        regression={regression}
        xLabel={t('forms.transectEvolution.labels.x')}
        yLabel={t('forms.transectEvolution.labels.y')}
        trendLabel={t('forms.transectEvolution.labels.trend')}
      />
      <Typography style={{ marginTop: 20 }} variant='h6' paragraph>
        {t('forms.transectEvolution.statistics')}
      </Typography>
      {
        Object.keys(metadata).map((key, i) => (
          <Typography variant='body1' key={i}>
            <b>{key}</b>: {metadata[key]}
          </Typography>
        ))
      }
    </div>
  )
}

export default TransectEvolution