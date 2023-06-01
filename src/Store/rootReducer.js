import { combineReducers } from "redux";
import authReducer from "./Reducers/authReducer";
import secondaryTablesReducer from "./Reducers/secondaryTablesReducer";
import recipeReducer from "./Reducers/recipeReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  secondaryTables: secondaryTablesReducer,
  recipe: recipeReducer,
});

export default rootReducer;
