import { Types } from './header'

const INITIAL_STATE = {}

export const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case Types.PUSH:
      return { ...state, [payload.identifier]: payload.data }

    default:
      return state
  }
}

export default reducer