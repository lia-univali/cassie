import pick from 'lodash/pick';

function createPipe(reducerName, callback) {
  return function(state, withinReducer = false) {
    const actualState = withinReducer ? state : state[reducerName];
    return callback(actualState);
  }
}

export function getAcquisitionParameters(state) {
  return pick(state.acquisition, 'geometry', 'satellite', 'availableDates', 'start', 'end');
}

export function getImageryIdentifiers(state) {
  return pick(state.imagery, 'imageId', 'layerId');
}

export function getImageryMetadata(state) {
  return Object.values(state.imagery.images).map(im => pick(im, "name", "date"));
}

export function isDialogOpen(dialogName) {
  return function(state) {
    return state.dialog.dialogs.has(dialogName);
  }
}

export function retrieveShape(index) {
  return function(state) {
    return state.map.shapes[index];
  }
}

export function retrieveShapeByName(name) {
  return function(state) {
    return state.map.shapes.filter(shape => shape.name === name)[0];
  }
}

export function retrieveShapeGroup(group) {
  return function(state) {
    return state.map.shapes.map((el, i) => el.group === group ? i : null).filter(el => el !== null);
  }
}

export function retrieveHighlightedShape(state) {
  return state.map.shapes[state.map.highlighted];
}

export function computeInsertionIndex(parent) {
  return function(state) {
    const { layers } = state.imagery.images[parent];
    const keys = Object.keys(layers);

    if (keys.length === 0) {
      return state.map.layers.length;
    }

    const last = keys.sort().reverse()[0];
    const func = findLayerIndex(last);

    return func(state) + 1;
  }
}

export function findLayerIndex(identifier) {
  return createPipe('map', state => {
    for (let i = 0; i < state.layers.length; i++) {
      if (parseInt(identifier, 10) === state.layers[i]) {
        return i;
      }
    }

    return null;
  });
}

export function findLayerParent(identifier) {
  return createPipe('imagery', state => {
    for (let i = 0; i < Object.keys(state.images).length; i++) {
      for (const j of Object.keys(state.images[i].layers)) {
        if (parseInt(identifier, 10) === parseInt(j, 10)) {
          return i;
        }
      }
    }

    return null;
  });
}

export function getLayer(identifier) {
  return createPipe('imagery', state => {
    const f = findLayerParent(identifier);
    const parent = f(state, true);

    return state.images[parent].layers[identifier];
  });
}
