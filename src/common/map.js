import React from 'react';
import ReactDOM from 'react-dom';
import FeatureInfo from '../app/components/visualization/FeatureInfo';

let Map = undefined;
const STYLE_KEY = "customStyle";
const HIGHLIGHTED_KEY = "highlighted"

let shapeId = 0;
let infoWindow;

export const initializeMap = (map) => {
  infoWindow = new window.google.maps.InfoWindow({ content: "Hello world!" });
  Map = map;

  Map.customLayers = [];
  Map.data.setStyle(feature => {
    const style = feature.getProperty(STYLE_KEY);
    if (feature.getProperty(HIGHLIGHTED_KEY) === true) {
      return { ...style, strokeWeight: style.strokeWeight + 4 };
    }

    return style;
  });

  Map.imageOutline = undefined;

  const shapeOptions = {
    fillColor: "#00B3A1",
    fillOpacity: 0.2,
    strokeColor: "#003832",
    strokeOpacity: 1,
    strokeWeight: 0.5,
  };

  Map.drawingManager = new window.google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['polygon', 'rectangle', 'polyline']
    },
    polygonOptions: shapeOptions,
    rectangleOptions: shapeOptions,
    polylineOptions: {
      strokeColor: "#00B3A1",
      strokeOpacity: 1,
      strokeWeight: 2.75,
      geodesic: true,
    }
  });

  Map.drawingManager.setMap(Map);

  window.google.maps.event.addListener(Map.drawingManager, 'overlaycomplete', e => {
    console.log(e);
    if (Map.regionDrawnHandler) {
      Map.regionDrawnHandler(e.overlay, toCoordinates(extractCoordinates(e.overlay, e.type)));
    }
  });

  Map.addListener('zoom_changed', () => {
    if (Map.zoomChangeHandler) {
      Map.zoomChangeHandler(Map.getZoom());
    }
  });

  Map.data.addListener("click", event => {
    const properties = {};
    event.feature.forEachProperty((value, name) => properties[name] = value);
    infoWindow.setPosition(event.latLng);

    infoWindow.setContent('<div id="infowindow">hello world!</div>');
    infoWindow.open(Map);

    console.log(event.feature);

    window.google.maps.event.addListenerOnce(infoWindow, 'domready', e => {
      ReactDOM.render(<FeatureInfo data={properties} />, document.getElementById("infowindow"));
    });
  });

  setDrawingControlsVisible(false);
};

export const addLayer = (overlay, index) => {
  Map.customLayers.splice(index, 0, overlay);
  Map.overlayMapTypes.insertAt(index, overlay);

  return index;
};

export const removeLayer = (index) => {
  Map.customLayers.splice(index, 1);
  Map.overlayMapTypes.removeAt(index);
};

export const replaceLayer = (index, overlay) => {
  Map.customLayers[index] = overlay;
  Map.overlayMapTypes.setAt(index, overlay);
};

// Expects an array of coordinates of the form [lng, lat].
export const addPolygon = (coordinates) => {
  Map.data.add({
    geometry: new window.google.maps.Data.Polygon([toLatLng(coordinates)])
  });
};

export const addShape = (geoJson, color = "#FF0000", opacity = 0.5, type) => {
  geoJson.uid = shapeId++;
  const shape = Map.data.addGeoJson(geoJson, { idPropertyName: "uid" })[0];

  shape.setProperty(STYLE_KEY, {
    fillOpacity: opacity,
    fillColor: color,
    strokeWeight: geoJson.geometry.type === "LineString" ? 1.666 : 0.666,
    strokeColor: color,
    strokeOpacity: opacity,
  });

  if (type !== undefined) {
    shape.setProperty("featureType", type);
  }

  return shape;
}

export const highlightShape = (shape) => {
  shape.setProperty(HIGHLIGHTED_KEY, true);
}

export const clearHighlight = (shape) => {
  shape.setProperty(HIGHLIGHTED_KEY, false);
}

export const removeShape = (shape) => {
  Map.data.remove(shape);
}

export const centralize = (lat, lng) => {
  Map.setCenter({ lat, lng });
};

export const drawOutline = (coordinates) => {
  clearOutline();

  Map.imageOutline = new window.google.maps.Polygon({
    paths: toLatLng(coordinates),
    fillOpacity: 0,
    strokeWeight: 1,
    strokeColor: '#AAAAAA',
    strokeOpacity: 0.8
  });

  Map.imageOutline.setMap(Map);
};

export const clearOutline = () => {
  if (Map.imageOutline) {
    Map.imageOutline.setMap(null);
  }
}

export const setOpacity = (layer, value) => {
  Map.customLayers[layer].setOpacity(value);
}

export const toLatLng = (coordinates) => {
  return coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
}

export const toCoordinates = (latLngArray) => {
  return latLngArray.map(value => [value.lng, value.lat]);
}

export const loadGeoJSON = (data) => {
  Map.data.addGeoJson(data);
}

export const loadWRSLayer = () => {
  const layer = new window.google.maps.FusionTablesLayer({
    map: Map,
    query: {
      select: 'geometry',
      from: process.env.API_KEY
    },
    styles: [{
      polygonOptions: {
        fillOpacity: 0.03,
        strokeOpacity: 0.5,
        strokeWeight: 0.5,
      }
    }]
  });

  return layer;
}

export const getZoomLevel = () => {
  return Map.getZoom();
}

export const displayElement = element => {
  element.setMap(Map);
}

export const hideElement = element => {
  element.setMap(null);
}

export const onZoomChange = (handler) => {
  Map.zoomChangeHandler = handler;
}

export const onRegionDrawn = (handler) => {
  Map.regionDrawnHandler = handler;
}

export const setDrawingControlsVisible = (visible) => {
  Map.drawingManager.setOptions({
    drawingControl: visible,
  });

  if (!visible) {
    setDrawingMode(null);
  }
}

export const setDrawingMode = (mode) => {
  console.log(mode);
  Map.drawingManager.setDrawingMode(mode);
}

export const extractCoordinates = (object, type) => {
  if (type === 'rectangle') {
    const ne = object.getBounds().getNorthEast().toJSON();
    const sw = object.getBounds().getSouthWest().toJSON();
    const nw = { lat: ne.lat, lng: sw.lng };
    const se = { lat: sw.lat, lng: ne.lng };

    return [nw, ne, se, sw];
  } else if (type === 'polygon' || type === 'polyline') {
    return object.getPath().getArray().map(value => value.toJSON());
  }
}
