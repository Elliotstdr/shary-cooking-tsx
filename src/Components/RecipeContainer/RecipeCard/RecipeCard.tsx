import React, { useState } from "react";
import "./RecipeCard.scss";
import default2 from "../../../assets/default2.jpg";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import PropTypes from "prop-types";
import { GiKnifeFork } from "react-icons/gi";
import { BsPeople } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { BsFillCheckCircleFill } from "react-icons/bs";
import CardDetail from "./CardDetail/CardDetail";
import Modal from "../../Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import Bouton from "../../../Utils/Bouton/Bouton";
import SlideIn from "../../../Utils/SlideIn/SlideIn";
import { errorToast, timeToString } from "../../../Services/functions";
import { GiCook } from "react-icons/gi";
import CreateRecipe from "../../../Pages/CreateRecipe/CreateRecipe";
import { UPDATE_RECIPE } from "../../../Store/Reducers/recipeReducer";
import { fetchDelete, fetchPost } from "../../../Services/api";

interface Props {
  recipeItem: Recipe,
  updateFavouriteList?: (x: number) => void
}

const RecipeCard = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const recipe = useSelector((state: RootState) => state.recipe);
  const dispatch = useDispatch();
  const updateRecipe = (value: Partial<RecipeState>) => {
    dispatch({ type: UPDATE_RECIPE, value });
  };
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleModif, setVisibleModif] = useState(false);
  const [wantToDelete, setWantToDelete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(
    props.recipeItem.savedByUsers?.some(
      (user) => user.id === auth.userConnected?.id
    )
  );

  const addToFavorites = async (actionType: string) => {
    const response = await fetchPost(
      `/recipes/${props.recipeItem.id}/users/${auth.userConnected?.id}`,
      { action: actionType }
    );
    if (response.error) {
      errorToast("Une erreur est survenue");
      return;
    }
    if (actionType === "delete" && recipe.favourite && props.updateFavouriteList) {
      props.updateFavouriteList(props.recipeItem.id);
    }
    setIsFavorite(!isFavorite);
  };

  const deleteRecipe = async () => {
    const response = await fetchDelete(`/recipes/${props.recipeItem.id}`);
    if (response.error) {
      errorToast("Une erreur est survenue, la recette n'a pas été supprimée");
      return;
    }
    setWantToDelete(false);
    window.location.reload();
  };

  const shoppingAction = () => {
    if (recipe.shopping) {
      if (
        recipe.chosenRecipes.length === 0 ||
        !recipe.chosenRecipes.some(
          (recipe) => recipe.id === props.recipeItem.id
        )
      ) {
        updateRecipe({
          chosenRecipes: [...recipe.chosenRecipes, props.recipeItem],
        });
      } else {
        updateRecipe({
          chosenRecipes: recipe.chosenRecipes.filter(
            (recipe) => recipe.id !== props.recipeItem.id
          ),
        });
      }
    }
  };
  return (
    <div
      className={`recipeCard cardHover ${recipe.chosenRecipes?.length > 0 &&
        recipe.chosenRecipes.some(
          (recipe) => recipe.id === props.recipeItem.id
        ) &&
        "chosen"
        }`}
      onClick={() => {
        shoppingAction();
      }}
    >
      {recipe.chosenRecipes?.length > 0 &&
        recipe.chosenRecipes.some(
          (recipe) => recipe.id === props.recipeItem.id
        ) && (
          <BsFillCheckCircleFill className="chosen_check"></BsFillCheckCircleFill>
        )}
      <div
        className="recipeCard__top"
        onClick={() => !recipe.shopping && setVisibleDetail(true)}
      >
        <div className="recipeCard__top__categorie">
          <span className="etiquette"> {props.recipeItem.type.label} </span>
        </div>
        <div className="recipeCard__top__image">
          <img
            src={
              props.recipeItem.imageUrl
                ? process.env.REACT_APP_BASE_URL_API + props.recipeItem.imageUrl
                : default2
            }
            alt="Fond news"
            loading="lazy"
          />
        </div>
      </div>
      <div
        className="recipeCard__corps"
        onClick={() => !recipe.shopping && setVisibleDetail(true)}
      >
        <div className="recipeCard__corps__author">
          {props.recipeItem.postedByUser.imageUrl ? (
            <img
              src={
                process.env.REACT_APP_BASE_URL_API +
                props.recipeItem.postedByUser.imageUrl
              }
              alt="ma pp"
              className="creatorPP"
            ></img>
          ) : (
            <GiCook className="cooker"></GiCook>
          )}
          <span>Créée par {props.recipeItem.postedByUser.name}</span>
        </div>
        <div className="recipeCard__corps__title">{props.recipeItem.title}</div>
        <div className="recipeCard__corps__regime">
          <span>
            <GiKnifeFork></GiKnifeFork>
            {props.recipeItem.regime.label}
          </span>
        </div>
        <div className="recipeCard__corps__number">
          <span>
            <BsPeople></BsPeople>
            {props.recipeItem.number} personnes
          </span>
        </div>
        <div className="recipeCard__corps__time">
          <span>
            <BiTimer></BiTimer>
            {timeToString(props.recipeItem.time)}
          </span>
        </div>
      </div>
      <div className="recipeCard__bottom">
        <div className="recipeCard__bottom__fav">
          {isFavorite || recipe.favourite ? (
            <AiFillStar onClick={() => addToFavorites("delete")}></AiFillStar>
          ) : (
            <AiOutlineStar
              onClick={() => addToFavorites("add")}
            ></AiOutlineStar>
          )}
        </div>
        {recipe.editable && (
          <div className="recipeCard__bottom__edit">
            <CiEdit onClick={() => setVisibleModif(true)}></CiEdit>
          </div>
        )}
        {recipe.editable && (
          <div className="recipeCard__bottom__delete">
            <RiDeleteBin6Line
              onClick={() => setWantToDelete(true)}
            ></RiDeleteBin6Line>
          </div>
        )}
      </div>
      {wantToDelete && (
        <Modal
          visible={wantToDelete}
          setVisible={setWantToDelete}
          header={"Suppression de recette"}
        >
          <div className="recipe_delete_modal">
            <div className="recipe_delete_modal_question">
              Etes vous sur de vouloir supprimer cette recette ?
            </div>
            <div className="recipe_delete_modal_buttons">
              <Bouton type={"normal"} btnAction={() => deleteRecipe()}>
                Oui
              </Bouton>
              <Bouton type={"normal"} btnAction={() => setWantToDelete(false)}>
                Non
              </Bouton>
            </div>
          </div>
        </Modal>
      )}
      {visibleDetail && (
        <SlideIn
          setVisible={setVisibleDetail}
          visible={visibleDetail}
          width={"70%"}
        >
          <CardDetail
            id={props.recipeItem.id}
            setVisible={setVisibleDetail}
            setVisibleModif={setVisibleModif}
          ></CardDetail>
        </SlideIn>
      )}
      {visibleModif && (
        <Modal
          visible={visibleModif}
          setVisible={setVisibleModif}
          header={"Modifier ma recette"}
          className={"modify_recipe_modal"}
        >
          <CreateRecipe recipe={props.recipeItem}></CreateRecipe>
        </Modal>
      )}
    </div>
  );
};

RecipeCard.propType = {
  recipeItem: PropTypes.object,
};

export default RecipeCard;
