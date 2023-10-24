import React, { Key, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "../../Components/Login/Login";
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
import { UPDATE_SECONDARYTABLES } from "../../Store/Reducers/secondaryTablesReducer";
import { ClassIngredientType, ClassRecipe, ClassRegime, ClassType, ClassUnit } from "../../Types/class";
import { errorToast } from "../../Services/functions";

const Accueil = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const secondaryTables = useSelector((state: RootState) => state.secondaryTables);
  const dispatch = useDispatch();
  const updateSecondaryTables = (value: Partial<SecondaryState>) => {
    dispatch({ type: UPDATE_SECONDARYTABLES, value });
  };
  const [recipeUrl, setRecipeUrl] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const recipesData = useFetchGet<Recipe[]>(recipeUrl, new ClassRecipe());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (auth.isConnected) {
      setRecipeUrl("/recipes");
    }
  }, [auth.isConnected]);

  const typesData = useFetchGetConditional<Type[]>("/types", secondaryTables.types, new ClassType());
  const unitsData = useFetchGetConditional<Unit[]>("/units", secondaryTables.units, new ClassUnit());
  const regimesData = useFetchGetConditional<Regime[]>(
    "/regimes",
    secondaryTables.regimes,
    new ClassRegime()
  );
  const ingredientTypeData = useFetchGetConditional<IngredientType[]>(
    "/ingredient_types",
    secondaryTables.ingTypes,
    new ClassIngredientType()
  );

  useEffect(() => {
    if (typesData.error || unitsData.error || regimesData.error || ingredientTypeData.error) {
      errorToast("Le site a rencontré une erreur technique, veuillez revenir dans quelques minutes")
      setIsError(true)
    }
    typesData.loaded &&
      unitsData.loaded &&
      regimesData.loaded &&
      ingredientTypeData.loaded &&
      updateSecondaryTables({
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
      {auth.isConnected && !isError ? (
        <div className="accueil">
          <NavBar></NavBar>
          <div className="accueil_connected">
            <div className="first block">
              <img src={image} alt="accueil" />
              <div>
                <h1>Bienvenue sur SHARY COOKING !</h1>
                <span>Venez ajouter votre grain de sel...</span>
              </div>
            </div>
            <div className="second block">
              <div className="second_text">
                <span>
                  Partagez vos meilleures recettes, donnez vos ingrédients
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
                      (a: Recipe, b: Recipe) => b.savedByUsers.length - a.savedByUsers.length
                    )
                    .slice(0, 3)
                    .map((recipe: Recipe, index: Key) => (
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

export default Accueil;
