import duckify from "../../tools/duckify";

export const namespace = "cassie";
export const store = "imagery";

export const Types = duckify(namespace, store, [
  "PUSH_IMAGE",
  "LOAD_LAYER",
  "PUSH_LAYER",
  "SET_BASELINE",
  "TOGGLE_VISIBILITY",
  "UPDATE_OPACITY",
  "REMOVE_LAYER",
  "GENERATE_TRANSECTS",
  "COMMIT_CHANGE",
  "ANALYZE_COASTLINE",
  "REQUEST_EXPRESSION",
  "REMOVE_ELEMENT"
]);

export const Actions = {
  pushImage: (name, date, missionName) => ({
    type: Types.PUSH_IMAGE,
    payload: { name, date, missionName },
  }),

  // Retrieves the image represented by the specified layers and adds to the parent.
  // If parent is a String, a parent with be created with that name.
  loadLayer: (layer, parent = "???") => ({
    type: Types.LOAD_LAYER,
    payload: { layer, parent },
  }),

  pushLayer: (layer, parent) => ({
    type: Types.PUSH_LAYER,
    payload: { layer, parent },
  }),

  setBaseline: (coordinates) => ({
    type: Types.SET_BASELINE,
    payload: { coordinates },
  }),

  toggleVisibility: (identifier) => ({
    type: Types.TOGGLE_VISIBILITY,
    payload: { identifier },
  }),

  updateOpacity: (identifier, opacity) => ({
    type: Types.UPDATE_OPACITY,
    payload: { identifier, opacity },
  }),

  removeLayer: (identifier) => ({
    type: Types.REMOVE_LAYER,
    payload: { identifier },
  }),

  generateTransects: (identifier) => ({
    type: Types.GENERATE_TRANSECTS,
    payload: { identifier },
  }),

  analyzeCoastline: () => ({
    type: Types.ANALYZE_COASTLINE,
  }),

  requestExpression: (parent) => ({
    type: Types.REQUEST_EXPRESSION,
    payload: { parent },
  }),

  commitChange: (layer, data) => ({
    type: Types.COMMIT_CHANGE,
    payload: { layer, data },
  }),

  removeElement: (layer) => ({
    type: Types.REMOVE_ELEMENT,
    payload: { layer },
  }),
};

export default Actions;
