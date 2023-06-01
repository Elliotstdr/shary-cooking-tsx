import { UPDATE_SECONDARYTABLES } from "../Actions/secondaryTables.js";
const INITIAL_STATE = {
  types: null,
  units: null,
  regimes: null,
  ingTypes: null,
};

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
