import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import SatelliteCard from "./SatelliteCard";
import { NEXT } from "../../pages/AcquisitionPage";
import { standard } from "../../../common/satellites";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import ReactGA from "react-ga";

const useStyles = makeStyles((theme) => ({
  content: {
    "&:not(:first-child)": {
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
  },
  grid: {
    margin: theme.spacing(2),
  },
}));

const SatelliteChooser = ({ navigate }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleChoice = (index) => {
    ReactGA.event({
      category: 'Acquisition',
      action: 'ChooseSatellite',
      value: index
    });
    dispatch(Acquisition.setSatellite(index));
    navigate(NEXT);
  };

  const spacecrafts = standard;

  return (
    <Grid container spacing={3} justify="center" className={classes.grid}>
      {spacecrafts.map((satellite, i) => (
        <Grid item key={i} xs={4}>
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
      ))}
    </Grid>
  );
};

export default SatelliteChooser;
