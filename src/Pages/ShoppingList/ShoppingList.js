import React, { useEffect, useState } from "react";
import "./ShoppingList.scss";
import Bouton from "../../Utils/Bouton/Bouton";
import Modal from "../../Components/Modal/Modal";
import RecipeContainer from "../../Components/RecipeContainer/RecipeContainer";
import { InputTextarea } from "primereact/inputtextarea";
import { exportRecipe, useFetchGet } from "../../Services/api";
import ShoppingListCard from "./ShoppingListCard/ShoppingListCard";
import { connect } from "react-redux";
import { updateRecipe } from "../../Store/Actions/recipeActions";
import PropTypes from "prop-types";
import image from "../../assets/HCDarkOp.jpg";
import { BiEditAlt } from "react-icons/bi";

const ShoppingList = (props) => {
  const ingredientData = useFetchGet("/ingredient_datas");

  const [visibleRecipeContainer, setVisibleRecipeContainer] = useState(false);
  const [visibleExport, setVisibleExport] = useState(false);
  const [visibleList, setVisibleList] = useState(null);
  const [stringShopping, setStringShopping] = useState("");
  const [greenButton, setGreenButton] = useState(false);

  useEffect(() => {
    props.handleUpdateRecipes({
      shopping: true,
    });
    return () =>
      props.handleUpdateRecipes({
        chosenRecipes: [],
        shopping: false,
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    !visibleRecipeContainer &&
      setVisibleExport(props.recipe.chosenRecipes.length > 0);
  }, [visibleRecipeContainer, props.recipe.chosenRecipes.length]);

  const modifyRecipeList = (word, recipe) => {
    let tempArray = [...props.recipe.chosenRecipes];
    tempArray.forEach((element) => {
      if (element.id === recipe.id) {
        element.multiplyer = word;
      }
    });
    props.handleUpdateRecipes({
      chosenRecipes: tempArray,
    });
  };

  return (
    <div className="shoppingList_container">
      {visibleExport ? (
        <div className="shoppingList_container_export">
          <div className="shoppingList_container_export_top">
            <h2 className="shoppingList_container_export_top_title">
              Mes recettes pour la liste de course
            </h2>
            <Bouton
              type={"normal"}
              btnTexte={"Modifier"}
              btnAction={() => setVisibleRecipeContainer(true)}
            >
              <BiEditAlt></BiEditAlt>
            </Bouton>
          </div>
          <div className="shoppingList_container_export_recipes">
            {props.recipe.chosenRecipes.map((recipe, index) => (
              <ShoppingListCard
                recipe={recipe}
                modifyRecipeList={(word, recipe) =>
                  modifyRecipeList(word, recipe)
                }
                key={index}
              ></ShoppingListCard>
            ))}
          </div>
          <Bouton
            type={"normal"}
            btnTexte={"Créer ma liste de course"}
            btnAction={() => {
              setStringShopping(
                exportRecipe(props.recipe.chosenRecipes, ingredientData.data)
              );
              setVisibleList(true);
              setGreenButton(false);
            }}
          ></Bouton>
        </div>
      ) : (
        <div className="shoppingList_container_home">
          <img src={image} alt="background shopping" />
          <Bouton
            btnTexte={"Choisir mes recettes"}
            btnAction={() => setVisibleRecipeContainer(true)}
          ></Bouton>
        </div>
      )}
      {visibleRecipeContainer && (
        <Modal
          visible={visibleRecipeContainer}
          setVisible={setVisibleRecipeContainer}
          header={"Je choisis mes recettes"}
          className={"choose_recipe"}
        >
          <>
            <Bouton
              type={"normal"}
              btnTexte={"Valider ma sélection"}
              btnAction={() => setVisibleRecipeContainer(false)}
            ></Bouton>
            <RecipeContainer dataToCall="/recipes"></RecipeContainer>
            <Bouton
              type={"normal"}
              btnTexte={"Valider ma sélection"}
              btnAction={() => setVisibleRecipeContainer(false)}
            ></Bouton>
          </>
        </Modal>
      )}
      {visibleList && stringShopping.length > 0 && (
        <Modal
          visible={visibleList}
          setVisible={setVisibleList}
          header={"Ma liste"}
          width={"40%"}
          className={"modal_liste_courses_modal"}
        >
          <div className="modal_liste_courses">
            <InputTextarea
              autoResize
              value={stringShopping}
              onChange={(e) => setStringShopping(e.target.value)}
            ></InputTextarea>
            <button
              className={`bouton normal ${greenButton && "copied"}`}
              onClick={() => {
                navigator.clipboard.writeText(stringShopping);
                setGreenButton(true);
              }}
            >
              {greenButton ? "Copié" : "Copier"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

ShoppingList.propTypes = {
  recipe: PropTypes.object,
  handleUpdateRecipes: PropTypes.func,
};

const mapStateToProps = (state) => ({
  recipe: state.recipe,
});
const mapDispatchToProps = (dispatch) => ({
  handleUpdateRecipes: (value) => dispatch(updateRecipe(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);
