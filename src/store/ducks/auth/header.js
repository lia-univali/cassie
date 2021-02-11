import duckify from '../../tools/duckify';

export const namespace = 'cassie'
export const store = 'auth'

export const Types =
    duckify(namespace, store, ['LOAD_CLIENT_AUTH', 'LOAD_CLIENT_AUTH_SUCCESS', 'LOAD_CLIENT_AUTH_FAILURE',
        'BEGIN', 'AUTHORIZE', 'AUTHORIZE_FAILURE', 'REVOKE'])

export const Actions = {

    loadClientAuth: (onSuccess = () => { }) => ({
        type: Types.LOAD_CLIENT_AUTH, payload: { onSuccess }
    }),

    loadClientAuthSuccess: () => ({
        type: Types.LOAD_CLIENT_AUTH_SUCCESS
    }),

    loadClientAuthFailure: (error) => ({
        type: Types.LOAD_CLIENT_AUTH_FAILURE, payload: { error }
    }),

    /**
     * Begins the authentication process, attempting to log in via the OAuth client
     * ID and via popup if the first fails. Accepts a callback to run after the
     * auth process succeeds. The callback is useful to redirect the page.
     * @param {Function} [callback = () => {}]
     */
    begin: (callback = () => { }) => ({
        type: Types.BEGIN, payload: { callback }
    }),

    /**
     * Feeds the system with information about the user, such as name and picture.
     * @param {String} name
     * @param {String} imageUrl
     */
    authorize: (name, imageUrl) => ({
        type: Types.AUTHORIZE, payload: { name, imageUrl }
    }),

    authorizeFailure: (error) => ({
        type: Types.AUTHORIZE_FAILURE, payload: { error }
    }),

    /**
     * Signs out of the current user's account, revoking all permissions granted
     * to the system. Runs callback after completition
     * @param {Function} [callback = () => {}]
     */
    revoke: (callback = () => { }) => ({
        type: Types.REVOKE, payload: { callback }
    })
}

export default Actions