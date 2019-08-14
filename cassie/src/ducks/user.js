const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return {...state, ...action.payload, authenticating: false};
    case "BEGIN_AUTHENTICATION":
      return {...state, authenticating: true};
    default:
      return state;
  }
};

export default reducer;
