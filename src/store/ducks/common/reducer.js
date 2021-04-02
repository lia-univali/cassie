import { Types } from "./header";

const INITIAL_STATE = {
  working: false,
  jobs: 0,
};

export const reducer = (state = INITIAL_STATE, { type }) => {
  switch (type) {
    case "EVALUATE":
      return { ...state, jobs: state.jobs + 1, working: true };
    case "DONE":
      return {
        ...state,
        jobs: state.jobs - 1,
        working: state.jobs === 1 ? false : true,
      };
    default:
      return state;
  }
};

export default reducer;
