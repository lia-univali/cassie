import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ee from "../../../services/earth-engine";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import GoogleMap from "../map/GoogleMap";
import StepperButtons from "./StepperButtons";
import * as Map from "../../../common/map";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import TourGuider from "../tour/TourGuider";
import { useLocalStorage } from "../../../common/utils";
import HelpButton from "../core/HelpButton";

// useStyles is a hook for styling this component with Material UI's styling solution

// This is the page of the second step of the aquisition wizard
// it is supposed to get the Area of Interest (AOI) from the map
// and to save it in the storage.
// It also shows a button to start the third step.
const AOIChooser = ({ navigate }) => {
  const dispatch = useDispatch();
  // get the current language
  const [t] = useTranslation();
  const [overlay, setOverlay] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    Map.setDrawingControlsVisible(true);
    return () => {
      Map.onZoomChange(() => {});
    };
  }, []);

  // handle drawing the AOI on the map
  const handleDrawing = (overlay, coordinates) => {
    setOverlay(overlay);
    setCoordinates(coordinates);
    // disable the drawing controls, when the AOI is drawn
    Map.setDrawingControlsVisible(false);
  };

  // handle the undoing of the AOI
  const handleUndo = () => {
    overlay.setMap(null);
    setOverlay(null);
    setCoordinates(null);
    // enable the drawing controls
    Map.setDrawingControlsVisible(true);
  };

  // handle the saving of the AOI
  const handleChoose = () => {
    dispatch(
      Acquisition.setAOI(
        overlay,
        coordinates,
        ee.Geometry.Polygon([coordinates])
      )
    );
  };

  // check if the AOI is already saved
  const drawn = Boolean(coordinates);

  // defines the steps for the tour
  const steps = [
    {
      selector: "#areachooser",
      content: t("tour.acquisition.2.info"),
    },
  ];

  // create a localStorage object to check if the user has already seen the tour
  const [isTourOpen, setIsTourOpen] = useLocalStorage("showROITour", true);
  

  return (
    <Box>
      <HelpButton
        onClickFunction={() => {
          setIsTourOpen(true);
        }}
      />
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
      {
        // if the user hasn't seen the tour, show it
      }
      <TourGuider
        steps={steps}
        isOpen={isTourOpen}
        setIsTourOpen={setIsTourOpen}
      />
    </Box>
  );
};

export default AOIChooser;
