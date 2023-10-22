const INITIAL_STATE: SecondaryState = {
  types: null,
  units: null,
  regimes: null,
  ingTypes: null,
};

export const UPDATE_SECONDARYTABLES = "UPDATE_SECONDARYTABLES";

const secondaryTablesReducer = (state = INITIAL_STATE, action: any): SecondaryState => {
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
