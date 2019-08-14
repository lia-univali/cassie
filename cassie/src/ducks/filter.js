const initialState = {
  clouds: 10,
  expanded: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_FILTER":
      return {...state,
        [action.name]: action.value
      };
    case "TOGGLE_FILTERS_EXPANDED":
      return {...state, expanded: !state.expanded};
    default:
      return state;
  }
}

export default reducer;
