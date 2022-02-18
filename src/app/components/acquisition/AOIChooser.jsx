import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ee from "../../../services/earth-engine";
import {
  Box,
  Button,
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
  let saveZoomChange= function(){
    let zoom=Map.getZoomLevel();
    if(typeof(zoom)!=="undefined" && zoom !=="undefined"){
      window.sessionStorage.setItem("zoom_level",zoom);
    }
  }
  window.sessionStorage.removeItem("zoom_level");//clear previous saved zoom (aquisition -first use case)
  setInterval(saveZoomChange,5000);
  useEffect(() => {
    Map.setDrawingControlsVisible(true); 
    return () => {
      Map.onZoomChange(() => {
        saveZoomChange();
      });
    };
  }, []);

  //test default poligonon
  //https://geojson.io/
  /*
 let defaultCoordinates=[
  [-48.5841129271845, -26.19084941178084], 
  [-48.579735562072194, -26.193853088887273],
  [-48.58540038751165, -26.19400712152275],
  [-48.5841129271845, -26.19084941178084]];

  
  setTimeout(()=>{
    let overlayFixed=Map.drawOutline(defaultCoordinates);
    setOverlay(overlayFixed);
    setCoordinates(defaultCoordinates);
    Map.setDrawingControlsVisible(false);
  },3000);
*/
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
  
  const readFileData = function () {
        let fileField=document.getElementById("file_import_kml");
        if(fileField.files.length===0){
          window.alert("Please select a file first.");
          return false;
        }
        const file = fileField.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            console.log("File data:", reader.result);
            const fileContent=reader.result;
            const kmlTokenBegin="<coordinates>";
            const kmlTokenEnd="</coordinates>";
            let isKml=fileContent.indexOf(kmlTokenBegin)!==-1;
            if (isKml){
              let coordinatesString=fileContent.split(kmlTokenBegin)[1].split(kmlTokenEnd)[0];
              let coordinatesArrayStrings=coordinatesString.split(" ").map(el=>el.trim());
              let coordinatesArray=[];
              coordinatesArrayStrings.forEach(el=>{
                if(el.trim() !== "" ){
                  let coordinatesValues=el.split(",");
                  coordinatesValues=coordinatesValues.map(el=>parseFloat(el));
                  if(!isNaN(coordinatesValues[0])){
                    coordinatesArray.push([coordinatesValues[0],coordinatesValues[1]]);
                  }
                }
              });
              console.log("coordinatesValues", coordinatesArray);
              //select area
              if(coordinatesArray.length>0){
                let overlayFixed=Map.drawOutline(coordinatesArray);
                setOverlay(overlayFixed);
                setCoordinates( coordinatesArray );
                Map.centralize( coordinatesArray[0][1], coordinatesArray[0][0] );
                Map.setDrawingControlsVisible(false);
                window.alert("KML file processed.");
              }else{
                window.alert("No valid coordinates were found in the KML file.");
              }
            }else{
                window.alert("It was not possible to interpret the selected file.");
            }            
        }, false);
         if (file) {
            reader.readAsText(file);
        }
      }   
      
      const handleDisplayImportKML= function (){
        let comp = document.getElementById("import_kml_component");
        comp.style.display= comp.style.display==="none"?"block":"none";
      }
    
  return (
    <Box>
      <Button onClick={handleDisplayImportKML} style={{cursor:"pointer", color:"#26a69a"}}>{t("forms.acquisition.2.importTitle")}</Button>
      <fieldset style={{borderColor:"#BBB", display:"none"}} id="import_kml_component">
        <legend> {t("forms.acquisition.2.importLegend")}</legend>
          <input id="file_import_kml" accept=".kml" type="file" onChange={readFileData}  />
        </fieldset>
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
