import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { Roles } from './constants.js';

const middleware = applyMiddleware(thunk, createLogger());

const modalReducer = (state={params:{}}, action) => {
  switch (action.type) {
  case "OPEN_MODAL":
    return {...state,
      currentModal: action.payload.name,
      shown: true,
      params: action.payload.params,
      callback: action.payload.callback
    };
  case "CLOSE_MODAL":
    return {...state, shown: false};
  case "CLEAR_PARAMS":
    return {...state, params: {}};
  }

  return state;
};

const initialFilters = {
  clouds: 20,
  expanded: false,
};

const filterReducer = (state=initialFilters, action) => {
  switch (action.type) {
    case "UPDATE_FILTER":
      return {...state,
        [action.payload.name]: action.payload.value
      };
    case "TOGGLE_FILTERS_EXPANDED":
      return {...state, expanded: !state.expanded};
    default:
      return state;
  }
}

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

const reducer = (state=initialState, action) => {
  const images = [].concat(state.images);
  const layers = [].concat(state.layers);

  switch (action.type) {
  case "STORE_VEGETATION_DATA":
    return {...state, vegetationData: action.payload};
  case "SET_AUTHENTICATION_STATE":
    return {...state, authenticated: action.payload.authenticated};
  case "UPDATE_STATUS":
    const status = action.payload.status ? action.payload.status : state.status;
    return {...state, working: action.payload.working, status};
  case "SATELLITE_DATA_FETCHED":
    return {...state, satelliteData: action.payload.data, timeInfo: action.payload.timeInfo};
  case "SELECT_IMAGE":
    return {...state, selectedImage: action.payload.index};
  case "ADD_LAYER":
    images[action.payload.parentIndex].layers.push(layers.length);
    images[action.payload.parentIndex][action.payload.role] = layers.length;
    layers.push(action.payload);
    return {...state, layers, images};
  case "REMOVE_LAYER":
    const { parentIndex, role } = layers[action.payload.index];
    const indexInParent = images[parentIndex].layers.indexOf(action.payload.index);
    // Remove the specified layer from the parent image
    images[parentIndex].layers.splice(indexInParent, 1);
    delete images[parentIndex][role];
    layers.splice(action.payload.index, 1);

    images.forEach((image, index) => {
      // Reduce the values of the layers whose identifiers were greater than the removed layer
      images[index].layers = image.layers.map(layer => tryDecrement(layer, action.payload.index));

      Object.keys(Roles).forEach(key => {
        images[index][key] = tryDecrement(images[index][key], action.payload.index);
      });
    });
    return {...state, layers, images};
  case "REMOVE_IMAGE":
    layers.forEach((layer, index) => {
      layers[index].parentIndex = tryDecrement(layer.parentIndex, action.payload.index);
    });
    images.splice(action.payload.index, 1);
    return {...state, layers, images};
  case "LOAD_IMAGE":
    action.payload.layers = [];
    images.push(action.payload);
    return {...state, images};
  case "UPDATE_VISIBILITY":
    layers[action.payload.layer].visible = action.payload.visible;
    return {...state, layers};
  case "UPDATE_OPACITY":
    layers[action.payload.layer].opacity = action.payload.value;
    return {...state, layers};
  case "UPDATE_THRESHOLD":
    layers[action.payload.layer].threshold = action.payload.value;
    layers[action.payload.layer].thresholdIndex = action.payload.thresholdIndex;
    layers[action.payload.layer].thresholdedImage = action.payload.thresholdedImage;
    layers[action.payload.layer].thresholdedOverlay = action.payload.thresholdedOverlay;
    return {...state, layers};
  case "CHANGE_LAYER_TITLE":
    layers[action.payload.layer].title = action.payload.title;
    return {...state, layers};
  case "RESET_SATELLITE_DATA":
    return {...state, satelliteData: undefined};
  case "SET_SPACECRAFT":
    return {...state,
      satelliteData: undefined,
      spacecraft: action.payload.spacecraft,
      spacecraftIndex: action.payload.spacecraftIndex,
    };
  case "SET_REGION":
    return {...state, region: action.payload};
  case "SET_DETECTED_REGIONS":
    return {...state, detectedRegions: action.payload};
  case "CLEAR_DETECTED_REGIONS":
    return {...state, detectedRegions: undefined};
  }
  return state;
};

export const store = createStore(combineReducers({
  data: reducer,
  modal: modalReducer,
  filters: filterReducer,
}), middleware);
