export const CLIENT_ID = '1084163887653-eouc04vh3k3r2lp5h4s20oimbq8aicb8.apps.googleusercontent.com';

/**
 * Begins the authentication process, attempting to log in via the OAuth client
 * ID and via popup if the first fails. If the destination is not null, the user
 * will be redirected to the specified URL upon a successful login.
 * @param {String} [destination=null] the URL to redirect the user to
 */
export const login = (destination = null) => {
  return {type: "BEGIN_AUTHENTICATION", destination};
}

/**
 * Signs out of the current user's account, revoking all permissions granted
 * to the system. Reloads the page upon completion.
 */
export const logout = () => {
  return {type: "LOGOUT"};
}

/**
 * Feeds the system with information about the user, such as name and picture.
 * @param {Object} payload the data to be stored
 */
export const loadUser = (payload) => {
  return {type: "LOAD_USER", payload}
}

/**
 * Updates the entire Redux state tree with the specified state. Please be
 * careful when using this.
 * @param {Object} state the new Redux state
 */
export const replaceEntireState = (state) => {
  return {type: "REPLACE_ENTIRE_STATE", state};
}
