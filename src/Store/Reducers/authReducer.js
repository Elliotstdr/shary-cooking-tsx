import { UPDATE_AUTH } from "../Actions/authActions.js";
const INITIAL_STATE = {
  isConnected: false,
  userConnected: {},
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_AUTH: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
