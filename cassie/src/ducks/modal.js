const reducer = (state={params:{}}, action) => {
  switch (action.type) {
  case "OPEN_MODAL":
    const { name: currentModal, params, callback } = action.payload;
    return {...state,
      currentModal,
      params,
      callback,
      mounted: true,
      shown: true,
    };
  case "CLOSE_MODAL":
    return {...state, shown: false};
  case "CLEAR_PARAMS":
    return {...state, params: {}, mounted: false};
  default:
    return state;
  }
};

export default reducer;
