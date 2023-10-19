const INITIAL_STATE = {
  types: null,
  units: null,
  regimes: null,
  ingTypes: null,
};

export const UPDATE_SECONDARYTABLES = "UPDATE_SECONDARYTABLES";

const secondaryTablesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SECONDARYTABLES: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default secondaryTablesReducer;
