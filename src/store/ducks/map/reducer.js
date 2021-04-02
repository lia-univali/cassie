import update from "immutability-helper";
import { Types } from "./header";

const initialState = {
  layers: [],
  shapes: [],
  zIndex: 0,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case Types.ADD_EE_LAYER: {
      const layers = update(state.layers, {
        $splice: [[payload.position, 0, payload.identifier]],
      });

      return { ...state, layers };
    }

    case Types.ADD_SHAPES: {
      const shapes = update(state.shapes, {
        $push: [
          {
            overlays: payload.shapes,
            name: payload.name,
            group: payload.group,
            content: payload.content,
          },
        ],
      });

      return { ...state, shapes };
    }

    case Types.ADD_EE_FEATURE: {
      return { ...state, zIndex: state.zIndex + 1 };
    }

    case Types.REQUEST_DRAWING: {
      return {
        ...state,
        currentlyDrawing: true,
        drawingMessage: payload.message,
      };
    }

    case Types.COMPLETE_DRAWING:
    case Types.CANCEL_DRAWING: {
      return { ...state, currentlyDrawing: false };
    }

    case Types.COMMIT_HIGHLIGHT: {
      return { ...state, highlighted: payload.index };
    }

    case Types.COMMIT_SHAPE_REMOVAL: {
      const shapes = update(state.shapes, {
        $unset: [payload.index],
      });

      return { ...state, shapes };
    }

    default:
      return state;
  }
};

export default reducer;
