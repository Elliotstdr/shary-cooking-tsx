import { UPDATE_RECIPE } from "../Actions/recipeActions.js";
const INITIAL_STATE = {
  chosenRecipes: [],
  editable: false,
  favorite: false,
  shopping: false,
};

const recipeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_RECIPE: {
      return {
        ...state,
        ...action.value,
      };
    }
    default:
      return state;
  }
};

export default recipeReducer;
