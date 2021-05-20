import update from "immutability-helper";
import { Types } from "./header";
import * as Selectors from "../../../selectors";

const INITIAL_STATE = {
  images: {},
  imageId: 0,
  layerId: 0,
};

const alterLayer = (state, parent, layer, data) => {
  return update(state.images, {
    [parent]: {
      layers: {
        [layer]: {
          $merge: data,
        },
      },
    },
  });
};

// return { ...state, layers: state.images[parent].layers.filter(lay => lay !== layer ) }
const removeLayer = (state, parent, layer) => {
  const images = update(state.images, {
    [parent]: {
      layers: {
        $unset: [layer]
      }
    }
  })
  return { ...state, images }
  // let layers = state.images[parent].layers;
  // return update(state.images[parent], Object.keys(layers).filter(lay => lay !== layer).reduce((acc, cur) => ({ ...acc, [cur]: layers[cur] }), {}));
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.PUSH_IMAGE: {
      const images = update(state.images, {
        [state.imageId]: {
          $set: {
            name: action.payload.name,
            date: action.payload.date,
            missionName: action.payload.missionName,
            layers: {},
          },
        },
      });

      return { ...state, images, imageId: state.imageId + 1 };
    }

    case Types.PUSH_LAYER: {
      const images = update(state.images, {
        [action.payload.parent]: {
          layers: { [state.layerId]: { $set: action.payload.layer } },
        },
      });

      return { ...state, images, layerId: state.layerId + 1 };
    }
    case Types.REMOVE_ELEMENT: {
      const parent = Selectors.findLayerParent(action.payload.layer)(
        state,
        true
      );
      const images = removeLayer(
        state,
        parent,
        action.payload.layer
      );
      console.log('remove_element in imagery reducer')
      console.log(parent)
      return { ...state, images };
    }

    case Types.COMMIT_CHANGE: {
      const parent = Selectors.findLayerParent(action.payload.layer)(
        state,
        true
      );
      const images = alterLayer(
        state,
        parent,
        action.payload.layer,
        action.payload.data
      );

      return { ...state, images };
    }

    case Types.SET_BASELINE: {
      return { ...state, baseline: action.payload.baseline };
    }

    default:
      return state;
  }
};

export default reducer;
