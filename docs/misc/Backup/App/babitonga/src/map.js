let Map = undefined;

export const initializeMap = (map) => {
  Map = map;
  Map.customLayers = [];
  Map.data.setStyle({strokeWeight: 0, fillOpacity: 0.03});
  Map.imageOutline = undefined;

  const shapeOptions = {
    fillColor: "#FF0000",
    fillOpacity: 0.06,
    strokeColor: "#CF0000",
    strokeOpacity: 0.6,
    strokeWeight: 0.7,
  };

  Map.drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['polygon', 'rectangle']
    },
    polygonOptions: shapeOptions,
    rectangleOptions: shapeOptions,
  });

  Map.drawingManager.setMap(Map);

  google.maps.event.addListener(Map.drawingManager, 'overlaycomplete', e => {
    if (e.type == 'polygon' || e.type == 'rectangle') {
      Map.onRegionDrawn(e.overlay, extractCoordinates(e.overlay, e.type));
    }
  });
};

export const addLayer = (overlay) => {
  Map.customLayers.push(overlay);
  Map.overlayMapTypes.push(overlay);
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
    geometry: new google.maps.Data.Polygon([toLatLng(coordinates)])
  });
};

export const addShape = (coordinateArray, color, opacity = 0.7, isMulti = false) => {
  let shape = null;
  console.log(coordinateArray);
  if (isMulti) {
    const coords = coordinateArray.map(a => (
       a.map(b => toLatLng(b))
    ));
    shape = Map.data.add({geometry: new google.maps.Data.MultiPolygon(coords)});
  } else {
    const coords = coordinateArray.map(a => toLatLng(a));
    shape = Map.data.add({geometry: new google.maps.Data.Polygon(coords)});
  }

  shape.style = {
    fillOpacity: opacity * 0.333,
    fillColor: color,
    strokeWeight: 0.8,
    strokeColor: color,
    strokeOpacity: opacity
  };

  Map.data.overrideStyle(shape, shape.style);

  return shape;
}

export const highlightShape = (shape) => {
  clearHighlight();
  Map.highlightedShape = shape;

  const delta = 1 - shape.style.fillOpacity;
  const newOpacity = shape.style.fillOpacity + (delta * 0.4);

  Map.data.overrideStyle(shape, {...shape.style,
    fillOpacity: newOpacity,
    strokeWeight: 1.5,
  });
}

export const clearHighlight = () => {
  if (Map.highlightedShape !== undefined) {
    Map.data.overrideStyle(Map.highlightedShape, Map.highlightedShape.style);
    Map.highlightedShape = undefined;
  }
}

export const removeShape = (shape) => {
  Map.data.remove(shape);
}

export const centralize = (lat, lng) => {
  Map.setCenter({lat, lng});
};

export const drawOutline = (coordinates) => {
  clearOutline();

  Map.imageOutline = new google.maps.Polygon({
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

  console.log(Map.customLayers);
}

export const toLatLng = (coordinates) => {
  return coordinates.map(coord => ({lat: coord[1], lng: coord[0]}));
}

export const toCoordinates = (latLngArray) => {
  return latLngArray.map(value => [value.lng, value.lat]);
}

export const onRegionDrawn = (handler) => {
  if (!handler) {
    handler = () => {};
  }

  Map.onRegionDrawn = handler;
}

export const setDrawingControlsVisible = (visible) => {
  Map.drawingManager.setMap(visible ? Map : null);
}

export const extractCoordinates = (object, type) => {
  if (type == 'rectangle') {
    const ne = object.getBounds().getNorthEast().toJSON();
    const sw = object.getBounds().getSouthWest().toJSON();
    const nw = {lat: ne.lat, lng: sw.lng};
    const se = {lat: sw.lat, lng: ne.lng};

    return [nw, ne, se, sw];
  } else if (type == 'polygon') {
    return object.getPath().getArray().map(value => value.toJSON());
  }
}
