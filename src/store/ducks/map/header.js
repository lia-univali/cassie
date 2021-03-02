import duckify from '../../tools/duckify'

export const namespace = 'cassie'
export const store = 'map'

export const Types =
  duckify(namespace, store, ['ADD_EE_LAYER', 'ADD_EE_FEATURE', 'REMOVE_SHAPE', 'REMOVE_SHAPE_GROUP', 'CHANGE_OPACITY',
    'REQUEST_DRAWING', 'CANCEL_DRAWING', 'COMPLETE_DRAWING', 'CENTRALIZE_MAP', 'ADD_SHAPES', 'HIGHLIGHT', 'CLEAR_HIGHLIGHT',
    'COMMIT_HIGHTLIGHT', 'COMMIT_SHAPE_REMOVAL'])

export const Actions = {
  addEELayer: (overlay, identifier, position) => ({
    type: Types.ADD_EE_LAYER, payload: { overlay, identifier, position }
  }),
  addEEFeature: (feature, name, color = '#FF0000', opacity = 1, group) => ({
    type: Types.ADD_EE_FEATURE, payload: { feature, name, color, opacity, group }
  }),
  changeOpacity: (identifier, opacity) => ({
    type: Types.CHANGE_OPACITY, payload: { identifier, opacity }
  }),
  cancelDrawing: () => ({
    type: Types.CANCEL_DRAWING
  }),
  completeDrawing: (overlay, coordinates) => ({
    type: Types.COMPLETE_DRAWING, payload: { overlay, coordinates }
  }),
  requestDrawing: (drawingType, message) => ({
    type: Types.REQUEST_DRAWING, payload: { drawingType, message }
  }),
  addShapes: (shapes, name, group = 'all', content = null) => ({
    type: Types.ADD_SHAPES, payload: { shapes, name, group, content }
  }),
  highlight: (index) => ({
    type: Types.HIGHLIGHT, payload: { index }
  }),
  clearHighlight: () => ({
    type: Types.CLEAR_HIGHLIGHT
  }),
  commitHighlight: (index) => ({
    type: Types.COMMIT_HIGHLIGHT, payload: { index }
  }),
  commitShapeRemoval: (index) => ({
    type: Types.COMMIT_SHAPE_REMOVAL, payload: { index }
  }),
  removeShape: (index) => ({
    type: Types.REMOVE_SHAPE, payload: { index }
  }),
  removeShapeGroup: (group) => ({
    type: Types.REMOVE_SHAPE_GROUP, payload: { group }
  }),
  centralizeMap: (coordinates) => ({
    type: Types.CENTRALIZE_MAP, payload: { coordinates }
  })
}

export default Actions