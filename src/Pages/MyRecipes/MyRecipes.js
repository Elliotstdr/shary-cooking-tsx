import React, { useEffect } from "react";
import "./MyRecipes.scss";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { UPDATE_RECIPE } from "../../Store/Reducers/recipeReducer";

const MyRecipes = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const updateRecipe = (value) => {
    dispatch({ type: UPDATE_RECIPE, value });
  };

  useEffect(() => {
    updateRecipe({
      editable: true,
    });
    return () =>
      updateRecipe({
        editable: false,
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="myrecipes">
      <NavBar></NavBar>
      <RecipeContainer
        dataToCall={`/recipes/user/${auth.userConnected.id}`}
      ></RecipeContainer>
      <Footer></Footer>
    </div>
  );
};

export default MyRecipes;
