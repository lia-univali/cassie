import React from 'react';
import { compose } from 'redux';
import { withAcquisition } from 'actions';
import { getAll } from 'common/satellites';
import SatelliteCard from 'components/SatelliteCard';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { NEXT } from './AcquisitionPage';

class SatelliteChooser extends React.Component {
  createCards() {
    const spacecrafts = getAll();
    const { classes } = this.props;

    return spacecrafts.map((satellite, i) => (
      <Grid item key={i} xs={4} className={classes.content}>
        <SatelliteCard
          name={satellite.name}
          image={satellite.image}
          resolution={satellite.opticalResolution}
          startYear={satellite.startYear}
          endYear={satellite.endYear}
          provider={satellite.provider}
          cycle={satellite.cycle}
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
    console.log(this.props);
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
  withStyles(styles, {withTheme: true}),
  withAcquisition()
);

export default enhancer(SatelliteChooser);
