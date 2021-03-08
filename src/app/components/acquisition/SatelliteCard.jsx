import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import { Card, CardActions,CardActionArea, CardContent, CardMedia } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  image: {
    height: 180,
  },
  description: {
    paddingTop: theme.spacing(1),
  },
  card: {
    marginBottom: theme.spacing(1),
  }
}))

const SummaryDataField = ({title, value, unit}) => {
  return(
    <Typography variant='body1'>
      <b>{title}: </b>
      {value} {unit}
    </Typography>
  )
}

const SatelliteCard = ({ name, image, resolution, startYear, endYear, provider, cycle, onChoose, enabled }) => {
  const [t] = useTranslation()
  const classes = useStyles()

  const endYearOrNow = endYear || new Date().getFullYear()

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image={image}
        title={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <SummaryDataField title={t('forms.acquisition.1.card.opticalResolution')} value={resolution} unit={t('forms.acquisition.1.card.opticalResolutionUnit')}/>
          <SummaryDataField title={t('forms.acquisition.1.card.activityPeriod')} value={startYear+'-'+endYearOrNow}/>
          <SummaryDataField title={t('forms.acquisition.1.card.provider')} value={provider} />
          <SummaryDataField title={t('forms.acquisition.1.card.revisitTime')} value={cycle} unit={t('forms.acquisition.1.card.revisitTimeUnit')}/>
        </Typography>
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