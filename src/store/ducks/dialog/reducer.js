import { Types } from './header'
import update from 'immutability-helper'

const INITIAL_STATE = {
  dialogs: new Set()
}

export const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case Types.OPEN: {
      return {
        ...state,
        dialogs: update(state.dialogs, { $add: [payload.name] })
      }
    }
    case Types.CLOSE: {
      return {
        ...state,
        dialogs: update(state.dialogs, { $remove: [payload.name] })
      }
    }
    default: return state
  }
}

export default reducer