import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grow, Paper, Typography } from "@material-ui/core";
import * as Map from "../../../common/map";
import { Actions as MapActions } from "../../../store/ducks/map";
import { DrawerHelper } from "../../../store/ducks/map/header";
export const DEFAULT_ZOOM = 9;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  boxWrapper: {
    position: "absolute",
    top: 16,
    zIndex: 10,
  },
  overlayBox: {
    padding: 16,
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  overlayText: {
    padding: "0px 16px 0px 8px",
  },
}));

const GoogleMap = ({ style, onRegionDrawn = () => {}, onLoad = () => {} }) => {
  const currentlyDrawing = useSelector((state) => state.map.currentlyDrawing);
  const drawingMessage = useSelector((state) => state.map.drawingMessage);
 
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const classes = useStyles();

  const mapRef = useRef();
  const componentRef = useRef();
 
  let zoomLevel = window.sessionStorage.getItem("zoom_level");
  zoomLevel = zoomLevel != "undefined" && typeof(zoomLevel) != "undefined" && !isNaN(parseInt(zoomLevel))? parseInt(zoomLevel) : DEFAULT_ZOOM;
  
 
  useEffect(() => {
    mapRef.current = new window.google.maps.Map(componentRef.current, {
      center: { lat: -26.285757, lng: -48.73506 },
      zoom: zoomLevel,
      scaleControl: true,
    });

    Map.initializeMap(mapRef.current);

    Map.onRegionDrawn((overlay, coordinates) => {
      onRegionDrawn(overlay, coordinates);
      DrawerHelper.lastGenaratedOverlay=overlay;
      dispatch(MapActions.completeDrawing(overlay, coordinates));
    });

    onLoad(mapRef.current);
  }, []);

  return (
    <div className={classes.wrapper} style={{ ...style }}>
      <Grow in={currentlyDrawing === true}>
        <div className={classes.boxWrapper}>
          <Paper className={classes.overlayBox}>
            <Typography variant="body1" className={classes.overlayText}>
              {drawingMessage}
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => dispatch(MapActions.cancelDrawing())}
            >
              {t("forms.map.cancel")}
            </Button>
          </Paper>
        </div>
      </Grow>
      <div
        ref={(r) => (componentRef.current = r)}
        className={classes.map}
      ></div>
    </div>
  );
};

export default GoogleMap;
