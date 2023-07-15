import React, { useEffect, useState } from "react";
import { updateSecondaryTables } from "../../Store/Actions/secondaryTables";
import { connect } from "react-redux";
import Login from "../../Components/Login/Login";
import PropTypes from "prop-types";
import "./Accueil.scss";
import { useFetchGet, useFetchGetConditional } from "../../Services/api";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import image from "../../assets/accueilHC.jpg";
import image2 from "../../assets/accueil_second.jpg";
import image3 from "../../assets/accueil_third.jpg";
import Bouton from "../../Utils/Bouton/Bouton";
import { useNavigate } from "react-router-dom";
import Loader from "../../Utils/Loader/loader";
import RecipeCard from "../../Components/RecipeContainer/RecipeCard/RecipeCard";

const Accueil = (props) => {
  const [recipeUrl, setRecipeUrl] = useState(null);
  const navigate = useNavigate();

  const recipesData = useFetchGet(recipeUrl, props.auth.token);

  useEffect(() => {
    if (props.auth.isConnected) {
      setRecipeUrl("/recipes");
    }
  }, [props.auth.isConnected]);

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
      unitsData.loaded &&
      regimesData.loaded &&
      ingredientTypeData.loaded &&
      props.handleUpdateSecondaryTables({
        types: typesData.data,
        units: unitsData.data,
        regimes: regimesData.data,
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
    <div className="accueil_container">
      {props.auth.isConnected ? (
        <div className="accueil">
          <NavBar></NavBar>
          <div className="accueil_connected">
            <div className="first block">
              <img src={image} alt="accueil" />
              <div>
                {/* style={{ backgroundImage: `url(${image})` }} */}
                <h1>Bienvenue sur SHARY COOKING !</h1>
                <span>Venez ajouter votre grain de sel...</span>
              </div>
            </div>
            <div className="second block">
              <div className="second_text">
                <span>
                  Venez partager vos meilleurs recettes, donnez vos ingrédients
                  secrets !
                </span>
                <Bouton
                  btnTexte={"Créer une recette"}
                  btnAction={() => navigate("/create")}
                ></Bouton>
              </div>
              <img src={image2} alt="accueil" />
            </div>
            <div className="fourth block">
              <h1>Les recettes au top !</h1>
              <div className="fourth_recipes">
                {recipesData.loaded && recipesData.data ? (
                  recipesData.data
                    .sort(
                      (a, b) => b.savedByUsers.length - a.savedByUsers.length
                    )
                    .slice(0, 3)
                    .map((recipe, index) => (
                      <RecipeCard key={index} recipeItem={recipe}></RecipeCard>
                    ))
                ) : (
                  <Loader></Loader>
                )}
              </div>
            </div>
            <div className="third block">
              <img src={image3} alt="accueil" />
              <div className="third_text">
                <span>On piocherait pas une petite recette pour ce soir ?</span>
                <Bouton
                  btnTexte={"Voir la galerie de recettes"}
                  btnAction={() => navigate("/all")}
                ></Bouton>
              </div>
            </div>
          </div>
          <Footer></Footer>
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
