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
	notes: []
}

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case Types.DISPLAY: {
			return { ...state, notes: [ ...state.notes, { ...action.payload }] }
		}
		case Types.UPDATE: {
			const { data: { options, ...rest } } = action.payload || { data: {} }
			return { ...state,
					notes: state.notes.map(note => (
							action.payload && (action.payload.key === note.key)
								? { ...note, ...rest, options: { ...note.options, ...options } }
								: { ...note }
					))
			}
		}
		case Types.DISMISS: {
			return {
					...state,
					notes: state.notes.map(note => (
							action.payload && (action.payload.dismissAll || action.payload.key === note.key)
									? { ...note, dismissed: true }
									: { ...note }
					))
			}
		}
		case Types.ERASE: {
			return { ...state, notes: state.notes.filter(note => action.payload.key !== note.key) }
		}
		default: return { ...state }
	}
}

export default reducer