import React, { useEffect } from "react";
import "./Favorites.scss";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Components/Footer/Footer";
import NavBar from "../../Components/NavBar/NavBar";
import { UPDATE_RECIPE } from "../../Store/Reducers/recipeReducer";

const Favorites = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const updateRecipe = (value) => {
    dispatch({ type: UPDATE_RECIPE, value });
  };

  useEffect(() => {
    updateRecipe({
      favourite: true,
    });
    return () =>
      updateRecipe({
        favourite: false,
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="favorites">
      <NavBar></NavBar>
      <RecipeContainer
        dataToCall={`/recipes/user_fav/${auth.userConnected.id}`}
      ></RecipeContainer>
      <Footer></Footer>
    </div>
  );
};

export default Favorites;
