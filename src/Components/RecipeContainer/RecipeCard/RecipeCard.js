import React, { useRef, useState } from "react";
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
import axios from "axios";
import { connect } from "react-redux";
import Bouton from "../../../Utils/Bouton/Bouton";
import { Toast } from "primereact/toast";
import SlideIn from "../../../Utils/SlideIn/SlideIn";
import { updateRecipe } from "../../../Store/Actions/recipeActions";
import { errorToast, timeToString } from "../../../Services/api";
import { GiCook } from "react-icons/gi";
import CreateRecipe from "../../../Pages/CreateRecipe/CreateRecipe";

const RecipeCard = (props) => {
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleModif, setVisibleModif] = useState(false);
  const [wantToDelete, setWantToDelete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(props.recipe.favorite);
  const cancelToast = useRef(null);
  const uploadToast = useRef(null);

  const addToFavorites = (actionType) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL_API}/api/recipes/${props.recipeItem.id}/users/${props.auth.userConnected.id}`,
        { action: actionType },
        {
          headers: {
            accept: "application/json",
          },
        }
      )
      .then(() => {
        if (actionType === "add") {
          setIsFavorite(true);
        }
        if (actionType === "delete") {
          setIsFavorite(false);
        }
      });
  };

  const deleteRecipe = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL_API}/api/recipes/${props.recipeItem.id}`
      )
      .then(() => {
        setWantToDelete(false);
        window.location.reload(false);
      })
      .catch(() =>
        errorToast(
          "Une erreur est survenue, la recette n'a pas pu etre supprimée",
          cancelToast
        )
      );
  };

  const shoppingAction = () => {
    if (props.recipe.shopping) {
      if (
        props.recipe.chosenRecipes.length === 0 ||
        !props.recipe.chosenRecipes.some(
          (recipe) => recipe.id === props.recipeItem.id
        )
      ) {
        props.handleUpdateRecipes({
          chosenRecipes: [...props.recipe.chosenRecipes, props.recipeItem],
        });
      } else {
        props.handleUpdateRecipes({
          chosenRecipes: props.recipe.chosenRecipes.filter(
            (recipe) => recipe.id !== props.recipeItem.id
          ),
        });
      }
    }
  };
  return (
    <div
      className={`recipeCard cardHover ${
        props.recipe.chosenRecipes?.length > 0 &&
        props.recipe.chosenRecipes.some(
          (recipe) => recipe.id === props.recipeItem.id
        ) &&
        "chosen"
      }`}
      style={{ minHeight: "95.5%" }}
      onClick={() => {
        shoppingAction();
      }}
    >
      <Toast ref={uploadToast}></Toast>
      <Toast ref={cancelToast}></Toast>
      {props.recipe.chosenRecipes?.length > 0 &&
        props.recipe.chosenRecipes.some(
          (recipe) => recipe.id === props.recipeItem.id
        ) && (
          <BsFillCheckCircleFill className="chosen_check"></BsFillCheckCircleFill>
        )}
      <div
        className="recipeCard__top"
        onClick={() => !props.recipe.shopping && setVisibleDetail(true)}
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
          />
        </div>
      </div>
      <div
        className="recipeCard__corps"
        onClick={() => !props.recipe.shopping && setVisibleDetail(true)}
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
          {isFavorite ||
          props.recipeItem.savedByUsers?.some(
            (user) => user.id === props.auth.userConnected.id
          ) ? (
            <AiFillStar onClick={() => addToFavorites("delete")}></AiFillStar>
          ) : (
            <AiOutlineStar
              onClick={() => addToFavorites("add")}
            ></AiOutlineStar>
          )}
        </div>
        {props.recipe.editable && (
          <div className="recipeCard__bottom__edit">
            <CiEdit onClick={() => setVisibleModif(true)}></CiEdit>
          </div>
        )}
        {props.recipe.editable && (
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
          header={"Detail de la recette"}
          setVisible={setVisibleDetail}
          visible={visibleDetail}
          width={"70%"}
        >
          <CardDetail id={props.recipeItem.id}></CardDetail>
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
  auth: PropTypes.object,
  recipe: PropTypes.object,
  recipeItem: PropTypes.object,
  handleUpdateRecipes: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  recipe: state.recipe,
});
const mapDispatchToProps = (dispatch) => ({
  handleUpdateRecipes: (value) => dispatch(updateRecipe(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);
