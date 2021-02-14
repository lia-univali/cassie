import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import { Card, CardActions, CardContent, CardMedia } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  image: {
    height: 180,
    margin: theme.spacing(2, 2, 0),
  },
  description: {
    paddingTop: theme.spacing(1),
  },
  card: {
    marginBottom: theme.spacing(1),
  }
}))

const SatelliteCard = ({ name, image, resolution, startYear, endYear, provider, cycle, onChoose, enabled }) => {
  const [t] = useTranslation()
  const classes = useStyles()

  const endYearOrNow = endYear || new Date().getFullYear()

  return (
    <Card elevation={0} square className={classes.card}>
      <CardMedia className={classes.image}
        image={image} title={name}
      />
      <CardContent>
        <Typography variant='h5' gutterBottom>
          {name}
        </Typography>
        <div className={classes.description}>
          <Typography variant='body1'>
            {t('forms.acquisition.1.card.opticalResolution')}: {resolution} {t('forms.acquisition.1.card.opticalResolutionUnit')}
          </Typography>
          <Typography variant='body1'>
            {t('forms.acquisition.1.card.activityPeriod')}: {startYear}&mdash;{endYearOrNow}
          </Typography>
          <Typography variant='body1'>
            {t('forms.acquisition.1.card.provider')}: {provider}
          </Typography>
          <Typography variant='body1'>
            {t('forms.acquisition.1.card.revisitTime')}: {cycle} {t('forms.acquisition.1.card.revisitTimeUnit')}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button color='primary' onClick={onChoose} disabled={!enabled}>
          {t('forms.acquisition.1.card.choose')}
        </Button>
      </CardActions>
    </Card>
  )
}

export default SatelliteCard