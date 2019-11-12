import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import Button from './Button';
import Typography from '@material-ui/core/Typography';
import { space } from '../theme';

const SatelliteCard = (props) => {
  const { classes, name, image, resolution, startYear, endYear, provider, cycle, onChoose } = props;
  const endYearOrNow = endYear || new Date().getFullYear();

  return (
    <Card elevation={0} square className={classes.card}>
      <CardMedia className={classes.image}
        image={image} title={name}
      />
      <CardContent>
        <Typography variant="headline" gutterBottom>
          {name}
        </Typography>
        <div className={classes.description}>
          <Typography variant="body1">
            Resolução ótica: {resolution} metros
          </Typography>
          <Typography variant="body1">
            Período de atividade: {startYear}&mdash;{endYearOrNow}
          </Typography>
          <Typography variant="body1">
            Fornecedor: {provider}
          </Typography>
          <Typography variant="body1">
            Ciclo de captura: {cycle} dias
          </Typography>
        </div>
      </CardContent>

      <CardActions>
        <Button color="primary" onClick={onChoose}>
          Escolher
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

export default withStyles(styles)(SatelliteCard);
