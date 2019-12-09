/**
 * Opens a snackbar to notify the user that something just happened.
 * @param {String} message the message to be displayed
 * @param {Number} [duration=3000] the time (in ms) until the message is hidden
 */
export const notify = (message, duration = 3000) => {
  return {type: "SHOW_NOTIFICATION", message, isTask: false, duration};
}

/**
 * Opens a snackbar that gives feedback to the user about an ongoing background
 * task. Does not close automatically.
 * @param {String} message the message to be displayed
 * @param {Boolean} [cancellable=false] whether or not the task is cancellable
 */
export const displayTask = (message, cancellable = false) => {
  return {type: "SHOW_NOTIFICATION", message, isTask: true, cancellable};
}

/**
 * Hides the snackbar, eliminating it from the screen.
 */
export const hideNotification = () => {
  return {type: "HIDE_NOTIFICATION"};
}
