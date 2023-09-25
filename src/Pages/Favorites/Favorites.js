import React, { useEffect } from "react";
import "./Favorites.scss";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { connect } from "react-redux";
import { updateRecipe } from "../../Store/Actions/recipeActions";
import PropTypes from "prop-types";
import Footer from "../../Components/Footer/Footer";
import NavBar from "../../Components/NavBar/NavBar";

const Favorites = (props) => {
  useEffect(() => {
    props.handleUpdateRecipes({
      favourite: true,
    });
    return () =>
      props.handleUpdateRecipes({
        favourite: false,
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div className="favorites">
      <NavBar></NavBar>
      <RecipeContainer
        dataToCall={`/recipes/user_fav/${props.auth.userConnected.id}`}
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
