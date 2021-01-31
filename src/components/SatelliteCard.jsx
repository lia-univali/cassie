import React from 'react';
import { compose } from 'redux'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import Button from './Button';
import Typography from '@material-ui/core/Typography';
import { space } from '../theme';
import { withTranslation } from 'react-i18next'

const SatelliteCard = (props) => {
  const { t, classes, name, image, resolution, startYear, endYear, provider, cycle, onChoose, enabled } = props;
  const endYearOrNow = endYear || new Date().getFullYear();

  return (
    <Card elevation={0} square className={classes.card}>
      <CardMedia className={classes.image}
        image={image} title={name}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <div className={classes.description}>
          <Typography variant="body1">
            {t('forms.acquisition.1.card.opticalResolution')}: {resolution} {t('forms.acquisition.1.card.opticalResolutionUnit')}
          </Typography>
          <Typography variant="body1">
            {t('forms.acquisition.1.card.activityPeriod')}: {startYear}&mdash;{endYearOrNow}
          </Typography>
          <Typography variant="body1">
            {t('forms.acquisition.1.card.provider')}: {provider}
          </Typography>
          <Typography variant="body1">
            {t('forms.acquisition.1.card.revisitTime')}: {cycle} {t('forms.acquisition.1.card.revisitTimeUnit')}
          </Typography>
        </div>
      </CardContent>

      <CardActions>
        <Button color="primary" onClick={onChoose} disabled={!enabled}>
          {t('forms.acquisition.1.card.choose')}
        </Button>
      </CardActions>
    </Card>
  );
}

const styles = () => ({
  image: {
    height: 180,
    margin: space(2, 2, 0),
  },
  description: {
    paddingTop: space(1),
  },
  card: {
    marginBottom: space(1),
  }
});

const enhancer = compose(
  withStyles(styles),
  withTranslation()
)

export default enhancer(SatelliteCard);
