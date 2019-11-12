import React from 'react';
import { compose } from 'redux';
import { withAcquisition } from '../actions';
import { standard, getAll } from '../common/satellites';
import SatelliteCard from '../components/SatelliteCard';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { NEXT } from './AcquisitionPage';

class SatelliteChooser extends React.Component {
  createCards() {
    const spacecrafts = standard;
    const { classes } = this.props;

    return spacecrafts.map((satellite, i) => (
      <Grid item key={i} xs={4} className={classes.content}>
        <SatelliteCard
          name={satellite.name}
          provider={satellite.provider}
          image={satellite.image}
          cycle={satellite.summary.cycle}
          startYear={satellite.summary.startYear}
          endYear={satellite.summary.endYear}
          resolution={satellite.summary.opticalResolution}
          onChoose={() => this.handleChoice(i)}
        />
      </Grid>
    ));
  }

  handleChoice(index) {
    this.props.acquisition.setSatellite(index);
    this.props.navigate(NEXT);
  }

  render() {
    const { classes, theme } = this.props;

    return (
      <Grid container spacing={0} justify="center">
        {this.createCards()}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  content: {
    "&:not(:first-child)": {
      borderLeft: `1px solid ${theme.palette.divider}`,
    }
  }
});

const enhancer = compose(
  withStyles(styles, { withTheme: true }),
  withAcquisition()
);

export default enhancer(SatelliteChooser);
