/**
 * Opens a modal with the specified parameters.
 * @see ModalRoot.js
 * @param {String} name the unique identifier of the modal
 * @param {Object} [params={}] a set of parameters to pass to the modal
 */
export const open = (name, params = {}) => {
  return { type: "OPEN_MODAL", payload: { name, params } };
}

/**
 * Closes the currently open modal.
 */
export const close = () => {
  return { type: "CLOSE_MODAL" };
}

/**
 * Clears the input parameters of the modal that were passed when opening it.
 */
export const clearParams = () => {
  return { type: "CLEAR_PARAMS" };
}

/**
 * Signals that the modal has completed its task (i.e. the user clicked on
 * a "Confirm" button). Will probably trigger a Saga that does something
 * useful with the output values.
 * @param {Object} values the output values of the modal
 */
export const complete = (values) => {
  return { type: "COMPLETE_MODAL", ...values };
}

export const reducer = (state = { params: {} }, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      const { name: currentModal, params, callback } = action.payload;
      return {
        ...state,
        currentModal,
        params,
        callback,
        mounted: true,
        shown: true,
      };
    case "CLOSE_MODAL":
      return { ...state, shown: false };
    case "CLEAR_PARAMS":
      return { ...state, params: {}, mounted: false };
    default:
      return state;
  }
}

export default reducer