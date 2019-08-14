const initialState = {
  open: false,
  message: "",
  duration: null,
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
  case "SHOW_NOTIFICATION":
    return {...state, open: true,
      message: action.message,
      isTask: action.isTask,
      duration: action.duration
    };
  case "HIDE_NOTIFICATION":
    return {...state, open: false}
  default:
    return state;
  }
};

export default reducer;
