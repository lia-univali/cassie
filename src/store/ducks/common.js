const INITIAL_STATE = {
  working: false,
  jobs: 0,
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'BEGIN_EVALUATION':
      return { ...state, jobs: state.jobs + 1, working: true };
    case 'END_EVALUATION':
      return { ...state, jobs: state.jobs - 1, working: state.jobs === 1 ? false : true };
    default:
      return state;
  }
};

export default reducer