import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid } from "@material-ui/core";
import SatelliteCard from "./SatelliteCard";
import { NEXT } from "../../pages/AcquisitionPage";
import { standard } from "../../../common/satellites";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import TourGuider from "../tour/TourGuider";
import { useLocalStorage } from "../../../common/utils";
import HelpButton from "../core/HelpButton";

// useStyles is a hook for the styles module
const useStyles = makeStyles((theme) => ({
  content: {
    "&:not(:first-child)": {
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
  },
  grid: {
    margin: theme.spacing(2),
  }
}));

// this is the page of the first step of the acquisition wizard
// is is supposed to get the satellite name and the provider
// and save it on the storage
// then the user can go to the next step
const SatelliteChooser = ({ navigate }) => {
  const dispatch = useDispatch();
  // custom styles
  const classes = useStyles();
  // get the language
  const [t] = useTranslation();

  // defines the steps for the tour
  const steps = [
    {
      selector: "#satellitechooser",
      content: t("tour.acquisition.1.info"),
    },
    {
      selector: "#Landsat_props",
      content: t("tour.acquisition.1.Landsat.info"),
    },
    {
      selector: "#Sentinel-2_props",
      content: t("tour.acquisition.1.Sentinel-2.info"),
    },
  ];

  // create a localStorage object to check if the user has already seen the tour
  const [isTourOpen, setIsTourOpen] = useLocalStorage(
    "showSatelliteTour",
    true
  );

  // handle the sattelite chooser and also send an event to Google Analytics
  const handleChoice = (index) => {
    ReactGA.event({
      category: "Acquisition",
      action: "ChooseSatellite",
      value: index,
    });
    dispatch(Acquisition.setSatellite(index));
    // go to the next step
    navigate(NEXT);
  };

  // the satellites from common/satellites.js
  const satellites = standard;

  return (
    <Box>
      <HelpButton
        onClickFunction={() => {
          setIsTourOpen(true);
        }}
      />
      <Grid
        container
        spacing={3}
        justify="center"
        id="satellitechooser"
        className={classes.grid}
      >
        {
          // map the satellites to satellite cards
          satellites.map((satellite, i) => (
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
          ))
        }
        {
          // the tour
          // if the user has already seen the tour, then the tour is not shown
        }
        <TourGuider
          steps={steps}
          isOpen={isTourOpen}
          setIsTourOpen={setIsTourOpen}
        />
      </Grid>
    </Box>
  );
};

export default SatelliteChooser;
