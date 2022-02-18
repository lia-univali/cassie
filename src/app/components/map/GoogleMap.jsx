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
  zoomLevel = zoomLevel !== "undefined" && typeof(zoomLevel) !== "undefined" && !isNaN(parseInt(zoomLevel))? parseInt(zoomLevel) : DEFAULT_ZOOM; 
  
 
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

  const showFilePanel = function (){
    let div = document.getElementById("file_kml");
    div.style.display = div.style.display === "none" ? "block" : "none";
  }
  const readFileData = function () {
    let fileField=document.getElementById("file_import_kml");
    if(fileField.files.length===0){
      window.alert("Please select a file first.");
      return false;
    }
    const file = fileField.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        //console.log("File data:", reader.result);
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
          //console.log("coordinatesValues", coordinatesArray);
          //select area
          if(coordinatesArray.length>0){
            let overlay = Map.drawOutline(coordinatesArray);
            window.sessionStorage.setItem("coordinatesArray",coordinatesArray);
            Map.centralize( coordinatesArray[0][1], coordinatesArray[0][0] );
            showFilePanel();// hide panel for next time open collapsed
            dispatch(MapActions.completeDrawing(overlay, coordinatesArray));
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
            &nbsp;
            <Button
              color="primary"
              variant="contained"
              onClick = {showFilePanel}
            >
              Import KML
            </Button>
            <div style={{display:"none"}} id="file_kml"> 
              <fieldset style={{borderColor:"#BBB"}} id="import_kml_component">
                <legend>Arquivo KML</legend>
                  <input id="file_import_kml" accept=".kml" type="file" onChange={readFileData} />
                </fieldset>
            </div>
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
