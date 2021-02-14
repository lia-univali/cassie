import { Types } from './header'

const INITIAL_STATE = {
    clientAuth: { loaded: false, loading: false, error: null },
    user: null
}

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.LOAD_CLIENT_AUTH: {
            const { clientAuth: { loaded, loading } } = state
            return loaded || loading ? { ...state } : { ...state, clientAuth: { loaded: false, loading: true, error: null } }
        }
        case Types.LOAD_CLIENT_AUTH_SUCCESS: {
            return { ...state, clientAuth: { loaded: true, loading: false, error: null } }
        }
        case Types.LOAD_CLIENT_AUTH_FAILURE: {
            const { error } = action.payload
            return { ...state, clientAuth: { loaded: false, loading: false, error } }
        }
        case Types.BEGIN: {
            return { ...state, authenticating: true, error: null }
        }
        case Types.AUTHORIZE: {
            const { name, imageUrl } = action.payload
            return { ...state, authenticating: false, user: { name, imageUrl }, error: null }
        }
        case Types.AUTHORIZE_FAILURE: {
            const { error } = action.payload
            return { ...state, authenticating: false, user: null, error }
        }
        case Types.REVOKE: {
            return { ...state, user: null }
        }
        default: return { ...state }
    }
}

export default reducer