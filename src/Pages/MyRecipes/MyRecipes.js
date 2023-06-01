import React, { useEffect } from "react";
import "./MyRecipes.scss";
import NavBar from "../../Components/NavBar/NavBar";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { connect } from "react-redux";
import { updateRecipe } from "../../Store/Actions/recipeActions";
import PropTypes from "prop-types";

const MyRecipes = (props) => {
  useEffect(() => {
    props.handleUpdateRecipes({
      editable: true,
    });
    return () =>
      props.handleUpdateRecipes({
        editable: false,
      });
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <NavBar></NavBar>
      <RecipeContainer
        dataToCall={`/recipes/user/${props.auth.userConnected.id}`}
      ></RecipeContainer>
    </div>
  );
};

MyRecipes.propTypes = {
  auth: PropTypes.object,
  handleUpdateRecipes: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
  handleUpdateRecipes: (value) => dispatch(updateRecipe(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MyRecipes);
