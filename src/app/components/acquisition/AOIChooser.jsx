import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ee from "../../../services/earth-engine";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import GoogleMap, { DEFAULT_ZOOM } from "../map/GoogleMap";
import StepperButtons from "./StepperButtons";
import * as Map from "../../../common/map";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import TourGuider from "../tour/TourGuider";
import { useLocalStorage } from "../../../common/utils";
import { makeStyles } from "@material-ui/core/styles";
import { HelpOutlineOutlined } from "@material-ui/icons";

const isAboveThreshold = (zoom) => {
  return zoom > 4;
};

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
  center: {
    textAlign: "center",
  },
}));

const AOIChooser = ({ navigate }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const [visible, setVisible] = useState(isAboveThreshold(DEFAULT_ZOOM));
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [switchDisabled, setSwitchDisabled] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [wrs, setWrs] = useState(null); // @TODO enable this

  const changeDelimiterVisibility = (visible) => {
    /*
    if (visible) {
      Map.displayElement(wrs)
    } else {
      Map.hideElement(wrs)
    }
    */
    setVisible(visible);
  };

  const handleZoomChange = (updatedLevel) => {
    const prevVisible = isAboveThreshold(zoomLevel);
    const visible = isAboveThreshold(updatedLevel);

    if (visible !== prevVisible) {
      changeDelimiterVisibility(visible);
    }

    setZoomLevel(updatedLevel);
    setSwitchDisabled(!visible);
  };

  useEffect(() => {
    Map.onZoomChange((zoomLevel) => handleZoomChange(zoomLevel));
    Map.setDrawingControlsVisible(true);

    return () => {
      Map.onZoomChange(() => {});
    };
  }, []);

  const handleDrawing = (overlay, coordinates) => {
    setOverlay(overlay);
    setCoordinates(coordinates);

    Map.setDrawingControlsVisible(false);
  };

  const handleUndo = () => {
    overlay.setMap(null);

    setOverlay(null);
    setCoordinates(null);

    Map.setDrawingControlsVisible(true);
  };

  const handleSwitchChange = (event) => {
    changeDelimiterVisibility(event.target.checked);
  };

  const handleChoose = () => {
    dispatch(
      Acquisition.setAOI(
        overlay,
        coordinates,
        ee.Geometry.Polygon([coordinates])
      )
    );
  };

  const drawn = Boolean(coordinates);

  const steps = [
    {
      selector: "#areachooser",
      content: t("tour.acquisition.2.info"),
    },
  ];

  const [isTourOpen, setIsTourOpen] = useLocalStorage("showROITour", true);

  const classes = useStyles();

  return (
    <Box>
      <div className={classes.right}>
        <Tooltip title={t("tour.help")} aria-label="help" id="help">
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
      <div className={classes.center}>
        <FormControlLabel
          label={t("forms.acquisition.2.showDelimiters")}
          control={
            <Switch
              checked={visible}
              disabled={switchDisabled}
              onChange={handleSwitchChange}
            />
          }
        />
      </div>
      <div id={"areachooser"}>
        <GoogleMap
          style={{ width: 1000, height: 500 } /* @TODO pass as props */}
          onRegionDrawn={handleDrawing}
        />
      </div>

      <StepperButtons
        navigate={navigate}
        nextDisabled={drawn === false}
        onNext={handleChoose}
      >
        <Button
          onClick={handleUndo}
          disabled={drawn === false}
          color="secondary"
          variant="outlined"
        >
          {t("forms.acquisition.2.undo")}
        </Button>
      </StepperButtons>
      <TourGuider
        steps={steps}
        isOpen={isTourOpen}
        setIsTourOpen={setIsTourOpen}
      />
    </Box>
  );
};

export default AOIChooser;
