import React from "react";
import "./AllRecipes.scss";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";

const AllRecipes = () => {
  return (
    <div className="allRecipes">
      <NavBar></NavBar>
      <RecipeContainer dataToCall="/recipes"></RecipeContainer>
      <Footer></Footer>
    </div>
  );
};

export default AllRecipes;
