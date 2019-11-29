import update from 'immutability-helper';

const initialState = {images: []};

const reducer = (state = initialState, action) => {
  const { parent, layer, type } = action;

  switch (type) {
  case "LOAD_IMAGE": {
    const images = update(state.images, {
      $push: [{...action.description, layers: []}]
    });

    return {...state, images};
  }

  case "INSERT_LAYER": {
    const {
      position = state.images[action.parent].layers.length,
    } = action;

    const images = update(state.images, {
      [parent]: {layers: {$splice: [[position, 1, layer]]}}
    });

    return {...state, images};
  }

  case "PREPARE_LAYER_INSERTION": {
    const images = update(state.images, {
      [parent]: {layers: {$push: [layer]}}
    });

    return {...state, images};
  }

  case "CHANGE_VISIBILITY": {
    const images = update(state.images, {
      [parent]: {layers: {[layer]: {visible: {$set: action.visible}}}}
    });

    return {...state, images};
  }

  case "LOAD_TEST_STATE":
    return initialState;

  default:
    return state;
  }
};

export default reducer;
