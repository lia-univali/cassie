import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import SatelliteCard from "./SatelliteCard";
import { NEXT } from "../../pages/AcquisitionPage";
import { standard } from "../../../common/satellites";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import ReactGA from "react-ga";
import Tour from "reactour";
import { useTranslation } from "react-i18next";

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
  const [t] = useTranslation();
  const steps = [
    {
      selector: "#satellitechooser",
      content: t("forms.acquisition.1.tour.info"),
    },
    {
      selector: "#Landsat_props",
      content: t("forms.acquisition.1.tour.Landsat.info"),
    },
    {
      selector: "#Sentinel-2_props",
      content: t("forms.acquisition.1.tour.Sentinel-2.info"),
    },
  ];
  const [isTourOpen, setIsTourOpen] = useState(true);

  const handleChoice = (index) => {
    ReactGA.event({
      category: "Acquisition",
      action: "ChooseSatellite",
      value: index,
    });
    dispatch(Acquisition.setSatellite(index));
    navigate(NEXT);
  };

  const spacecrafts = standard;

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      id="satellitechooser"
      className={classes.grid}
    >
      {spacecrafts.map((satellite, i) => (
        <Grid item key={i} xs={4} id={satellite.name}>
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
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        lastStepNextButton={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsTourOpen(false)}
          >
            Done!
          </Button>
        }
      />
    </Grid>
  );
};

export default SatelliteChooser;
