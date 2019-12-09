import update from 'immutability-helper';
import { imageToKey } from 'eeUtils';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case "SET_SATELLITE":
    const { satellite, satelliteIndex } = action;
    return {...state, satellite, satelliteIndex};

  case "SET_AOI":
    const { overlay, geometry, coordinates } = action;
    return {...state, overlay, geometry, coordinates};

  case "SET_DATES":
    return {...state, dates: action.dates};

  case "SET_PERIOD":
    return {...state, start: action.start, end: action.end};

  case "SET_SELECTED_IMAGES":
    const filtered = state.dates.filter((el, i) => action.selectedImages[i] === true);
    const dates = update(state.dates, {
      $set: filtered
    });

    return {...state, dates, done: true};

  default:
    return state;
  }
};

export default reducer;
