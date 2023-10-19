const INITIAL_STATE = {
  chosenRecipes: [],
  editable: false,
  shopping: false,
  favourite: false,
};

export const UPDATE_RECIPE = "UPDATE_RECIPE";

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
