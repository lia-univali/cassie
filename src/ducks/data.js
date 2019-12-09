import lastItem from 'lodash/last';

const initialState = {
  selectedImage: null,
  images: [],
  layers: [],
  bounds: [
    [-48.880920410156, -26.46319686677676],
    [-48.435974121093, -26.48778221323811],
    [-48.394775390625, -26.07158645317097],
    [-48.886413574218, -26.07158645317097]
  ],
};

const tryDecrement = (value, removedValue) => {
  return value > removedValue ? value - 1 : value;
};

const tryIncrement = (value, addedValue) => {
  return value > addedValue ? value + 1 : value;
};

const modifyArray = (array, index, mutator) => {
  return array.map((value, i) => {
    if (i !== index) return value;

    return mutator(value);
  });
}

const reducer = (state = initialState, action) => {
  let images = [].concat(state.images.slice());
  let layers = [].concat(state.layers.slice());

  switch (action.type) {
  case "STORE_AREA_SERIES_DATA":
    return {...state, areaSeriesData: action.payload};
  case "UPDATE_STATUS":
    const status = action.status ? action.status : state.status;
    return {...state, working: action.working, cancellable: action.cancellable, status};
  case "SATELLITE_DATA_FETCHED":
    return {...state, satelliteData: action.data, timeInfo: action.timeInfo};
  case "SELECT_IMAGE":
    return {...state, selectedImage: action.index};
  case "ADD_LAYER":
    {
      const { parentIndex } = action.layer;
      const current = images[parentIndex].layers;
      let last = -1;

      if (layers.length > 0) { // The state contains at least one layer
        if (current.length === 0) { // This is the first layer of the image
          last = lastItem(images[parentIndex - 1].layers);
        } else {
          last = lastItem(current);
        }
      }

      // Increment who is after
      images.forEach((image, index) => {
        images[index].layers = image.layers.map(layer => tryIncrement(layer, last));
      });

      images[parentIndex].layers = current.concat(last + 1);
      layers.splice(last + 1, 0, action.layer);
    }

    return {...state, layers, images};
  case "REMOVE_LAYER":
    {
      const { parentIndex } = layers[action.index];
      const indexInParent = images[parentIndex].layers.indexOf(action.index);
      // Remove the specified layer from the parent image
      images[parentIndex].layers.splice(indexInParent, 1);
    }

    // Remove the actual layer
    layers.splice(action.index, 1);

    // Reduce the values of the layers whose identifiers were greater than the removed layer
    images.forEach((image, index) => {
      images[index].layers = image.layers.map(layer => tryDecrement(layer, action.index));
    });
    return {...state, layers, images};
  case "REMOVE_IMAGE":
    layers.forEach((layer, index) => {
      layers[index].parentIndex = tryDecrement(layer.parentIndex, action.index);
    });
    images.splice(action.index, 1);
    return {...state, layers, images};
  case "CREATE_IMAGE_PANEL":
    const newImages = images.concat({...action.payload, layers: []});
    return {...state, images: newImages};
  case "INCLUDE_LAYER":
    images[action.parentIndex].usedIndices.push(action.expressionIndex);

    return {...state, images};
  case "UPDATE_VISIBILITY":
    layers = modifyArray(layers, action.layer, v => ({...v, visible: action.visible}));

    return {...state, layers};
  case "UPDATE_OPACITY":
    layers = modifyArray(layers, action.layer, v => ({...v, opacity: action.opacity}));

    return {...state, layers};
  case "UPDATE_THRESHOLD":
  case "CLEAR_THRESHOLD":
    layers[action.layer].threshold = action.threshold;
    return {...state, layers};
  case "CHANGE_LAYER_TITLE":
    layers[action.layer].title = action.title;
    return {...state, layers};
  case "PLACE_OVERLAY":
    layers[action.layer].specialOverlay = action.overlay;
    return {...state, layers};
  case "RESET_SATELLITE_DATA":
    return {...state, satelliteData: undefined};
  case "SET_SPACECRAFT":
    return {...state,
      spacecraft: action.spacecraft,
      spacecraftIndex: action.spacecraftIndex,
    };
  case "SET_REGION":
  case "REMOVE_REGION":
    return {...state, region: action.payload};
  case "SET_DETECTED_REGIONS":
  case "CLEAR_DETECTED_REGIONS":
    return {...state, detectedRegions: action.payload};
  case "ASSIGN_SHAPES":
    const newRegions = {...state.detectedRegions, shapes: action.shapes};

    return {...state, detectedRegions: newRegions};
  case "HIGHLIGHT_REGION":
    return {...state, highlightedRegion: action.payload};
  default:
    return state;
  }
};

export default reducer;
