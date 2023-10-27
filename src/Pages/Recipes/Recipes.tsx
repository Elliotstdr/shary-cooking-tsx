import React, { useEffect } from "react";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../Components/Footer/Footer";
import NavBar from "../../Components/NavBar/NavBar";
import { UPDATE_RECIPE } from "../../Store/Reducers/recipeReducer";

interface Props {
  mine?: boolean
  favourite?: boolean
}

const Recipes = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateRecipe = (value: Partial<RecipeState>) => {
    dispatch({ type: UPDATE_RECIPE, value });
  };

  useEffect(() => {
    updateRecipe({
      editable: props.mine,
      favourite: props.favourite,
    });
    return () =>
      updateRecipe({
        editable: props.mine,
        favourite: props.favourite,
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="recipes">
      <NavBar></NavBar>
      <RecipeContainer
        dataToCall={
          props.favourite
            ? `/recipes/user_fav/${auth.userConnected?.id}`
            : props.mine
              ? `/recipes/user/${auth.userConnected?.id}`
              : "/recipes"
        }
      ></RecipeContainer>
      <Footer></Footer>
    </div>
  );
};

export default Recipes;
