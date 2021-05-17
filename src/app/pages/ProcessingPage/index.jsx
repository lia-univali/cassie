import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ee from "../../../services/earth-engine"; // @TODO remove this!

import { Box, Grid, Grow } from "@material-ui/core";

import GoogleMap from "../../components/map/GoogleMap";
import ImageChooserCard from "../../components/map/ImageChooserCard";
import ActionsCard from "../../components/map/ActionsCard";
import { ShapeList } from "../../components";
import LoadedImagesAccordion from "../../components/map/LoadedImagesAccordion";

import { Actions as Map } from "../../../store/ducks/map";
import { useTranslation } from "react-i18next";
import TourGuider from "../../components/tour/TourGuider";
import { useLocalStorage } from "../../../common/utils";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxHeight: "100vh",
    flexGrow: 1,
    position: "relative",
  },
  mapContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flexFlow: "column",
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: "none",
    "& > *": {
      pointerEvents: "none",
      "& > *": {
        pointerEvents: "auto",
      },
    },
  },
  margin: {
    margin: "5px",
  },
  right: {
    textAlign: "right",
  },
}));

const ProcessingPage = () => {
  const isDrawing = useSelector((state) => state.map.currentlyDrawing);
  const coordinates = useSelector((state) => state.acquisition.coordinates);

  const dispatch = useDispatch();
  const classes = useStyles();

  const displayROI = () => {
    if (coordinates) {
      const feature = ee.Feature(ee.Geometry.Polygon([coordinates]));
      const border = feature.buffer(15).difference(feature);

      dispatch(Map.addEEFeature(border, "forms.map.roi", "#00A391", 0.6));
      dispatch(Map.centralizeMap(coordinates));
    }
  };

  const [t] = useTranslation();
  const steps = [
    {
      selector: "#mapScreen",
      content: t("tour.map.start"),
    },
    {
      selector: "#imageChooserForm",
      content: t("tour.map.imageChooser.info"),
    },
    {
      selector: "#imageChooserSelect",
      content: t("tour.map.imageChooser.select"),
    },
    {
      selector: "#imageChooserLoadButton",
      content: t("tour.map.imageChooser.click"),
    }
  ];
  const [isTourOpen, setIsTourOpen] = useLocalStorage(
    "showMapTour",
    true
  );

  return (
    <Box className={classes.wrapper}>
      <Grow in={!isDrawing} unmountOnExit>
        <Grid
          container
          justify="center"
          spacing={0}
          id="mapScreen"
          className={classes.mapOverlay}
        >
          <Grid item xs={9} className={classes.mapContainer}>
            <ShapeList />
            <ImageChooserCard />
            <ActionsCard />
          </Grid>
          <Grid item xs={3}>
            <LoadedImagesAccordion />
          </Grid>
        </Grid>
      </Grow>

      <GoogleMap onLoad={displayROI} style={{ position: "absolute" }} />
      <TourGuider
        steps={steps}
        isOpen={isTourOpen}
        setIsTourOpen={setIsTourOpen}
      />
    </Box>
  );
};

export default ProcessingPage;
