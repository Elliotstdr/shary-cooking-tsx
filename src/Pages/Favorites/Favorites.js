import React from "react";
import "./Favorites.scss";
import NavBar from "../../Components/NavBar/NavBar";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { connect } from "react-redux";
import { updateRecipe } from "../../Store/Actions/recipeActions";
import PropTypes from "prop-types";
import Footer from "../../Components/Footer/Footer";

const Favorites = (props) => {
  return (
    <div>
      <NavBar></NavBar>
      <RecipeContainer
        dataToCall={`/favourites/user/${props.auth.userConnected.id}`}
      ></RecipeContainer>
      <Footer></Footer>
    </div>
  );
};

Favorites.propTypes = {
  auth: PropTypes.object,
  handleUpdateRecipes: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
  handleUpdateRecipes: (value) => dispatch(updateRecipe(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
