import React, { useEffect } from "react";
import { updateSecondaryTables } from "../../Store/Actions/secondaryTables";
import { connect } from "react-redux";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import Login from "../../Components/Login/Login";
import PropTypes from "prop-types";
import "./Accueil.scss";
import NavBar from "../../Components/NavBar/NavBar";
import { useFetchGetConditional } from "../../Services/api";

const Accueil = (props) => {
  const typesData = useFetchGetConditional(
    "/types",
    props.secondaryTables.types
  );
  const unitsData = useFetchGetConditional(
    "/units",
    props.secondaryTables.units
  );
  const regimesData = useFetchGetConditional(
    "/regimes",
    props.secondaryTables.regimes
  );
  const ingredientTypeData = useFetchGetConditional(
    "/ingredient_types",
    props.secondaryTables.ingTypes
  );

  useEffect(() => {
    typesData.loaded &&
      props.handleUpdateSecondaryTables({
        types: typesData.data,
      });
    unitsData.loaded &&
      props.handleUpdateSecondaryTables({
        units: unitsData.data,
      });
    regimesData.loaded &&
      props.handleUpdateSecondaryTables({
        regimes: regimesData.data,
      });
    ingredientTypeData.loaded &&
      props.handleUpdateSecondaryTables({
        ingTypes: ingredientTypeData.data,
      });
    // eslint-disable-next-line
  }, [
    typesData.loaded,
    unitsData.loaded,
    regimesData.loaded,
    ingredientTypeData.loaded,
  ]);

  return (
    <div>
      {props.auth.isConnected ? (
        <div>
          <NavBar></NavBar>
          <RecipeContainer dataToCall="/recipes"></RecipeContainer>
        </div>
      ) : (
        <Login></Login>
      )}
    </div>
  );
};

Accueil.propTypes = {
  auth: PropTypes.object,
  secondaryTables: PropTypes.object,
  handleUpdateSecondaryTables: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  secondaryTables: state.secondaryTables,
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateSecondaryTables: (value) =>
    dispatch(updateSecondaryTables(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Accueil);
