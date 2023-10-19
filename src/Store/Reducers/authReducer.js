const INITIAL_STATE = {
  isConnected: false,
  token: null,
  userConnected: {},
  newLogTime: null,
  toast: null,
};

export const UPDATE_AUTH = "UPDATE_AUTH";

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
