import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, IconButton } from "@material-ui/core";
import SatelliteCard from "./SatelliteCard";
import { NEXT } from "../../pages/AcquisitionPage";
import { standard } from "../../../common/satellites";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import ReactGA from "react-ga";
import { useTranslation } from "react-i18next";
import TourGuider from "../tour/TourGuider";
import { useLocalStorage } from "../../../common/utils";
import { HelpOutlineOutlined } from "@material-ui/icons";
import { Tooltip } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  content: {
    "&:not(:first-child)": {
      borderLeft: `1px solid ${theme.palette.divider}`,
    },
  },
  grid: {
    margin: theme.spacing(2),
  },
  margin: {
    margin: "5px",
  },
  right: {
    textAlign: "right",
  },
}));

const SatelliteChooser = ({ navigate }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [t] = useTranslation();
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

  const [isTourOpen, setIsTourOpen] = useLocalStorage(
    "showSatelliteTour",
    true
  );

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
    <Box>
      <div className={classes.right}>
        <Tooltip title={t("tour.help")} aria-label="help" id='help'>
          <IconButton
            aria-label="help"
            className={classes.margin}
            size="medium"
            onClick={() => {
              setIsTourOpen(true);
            }}
          >
            <HelpOutlineOutlined color="primary" fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </div>

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
