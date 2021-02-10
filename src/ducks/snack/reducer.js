import { Types } from './header'

/**
 * Each Snack item is a notification with:
 * id
 * type
 * message
 * duration
 * cancellable
 * onClose
 */

const INITIAL_STATE = {
    data: { open: false, type: 'default', message: '', duration: null }
}

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.DISPLAY: {
            return { ...state, data: { ...action.payload, open: true } }
        }
        case Types.UPDATE: {
            return { ...state, data: { ...state.data, ...action.payload, open: true } }
        }
        case Types.DISMISS: {
            return { ...state, data: { ...state.data, open: false } }
        }
        default: return { ...state }
    }
}

export default reducer