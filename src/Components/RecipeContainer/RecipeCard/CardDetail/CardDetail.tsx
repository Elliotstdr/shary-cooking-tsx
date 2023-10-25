import React, { Key } from "react";
import "./CardDetail.scss";
import { useFetchGet } from "../../../../Services/api";
import { timeToString } from "../../../../Services/functions";
import Loader from "../../../../Utils/Loader/loader";
import default2 from "../../../../assets/default2.jpg";
import { GiKnifeFork } from "react-icons/gi";
import { BsPeople } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { BiAward } from "react-icons/bi";
import { Divider } from "primereact/divider";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";
import { ClassRecipe } from "../../../../Types/class";

interface Props {
  id: number,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setVisibleModif: React.Dispatch<React.SetStateAction<boolean>>,
}

const CardDetail = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const recipeDetail = useFetchGet<Recipe>(`/recipes/${props.id}`, new ClassRecipe());

  return (
    <div className="cardDetail_container">
      {recipeDetail.loaded && recipeDetail.data ? (
        <>
          <div className="cardDetail_container_image">
            <img
              src={
                recipeDetail.data.imageUrl
                  ? process.env.REACT_APP_BASE_URL_API +
                  recipeDetail.data.imageUrl
                  : default2
              }
              alt="Fond news"
            />
          </div>
          <h2 className="cardDetail_container_title">
            {recipeDetail.data.title}
            {recipeDetail.data.postedByUser.id === auth.userConnected?.id && (
              <div className="recipeCard__bottom__edit">
                <CiEdit
                  onClick={() => {
                    props.setVisible(false);
                    props.setVisibleModif(true);
                  }}
                ></CiEdit>
              </div>
            )}
          </h2>
          <div className="cardDetail_container_author">
            {recipeDetail.data.postedByUser.imageUrl && (
              <img
                src={
                  process.env.REACT_APP_BASE_URL_API +
                  recipeDetail.data.postedByUser?.imageUrl
                }
                alt="ma pp"
                className="creatorPP"
              ></img>
            )}
            <span>Créée par {recipeDetail.data.postedByUser?.name}</span>
          </div>
          <div className="cardDetail_container_group">
            <div className="cardDetail_container_time">
              <BiTimer></BiTimer> {timeToString(recipeDetail.data.time)}
            </div>
            <div className="cardDetail_container_number">
              <BsPeople></BsPeople> {recipeDetail.data.number} personnes
            </div>
            <div className="cardDetail_container_infos_type">
              <GiKnifeFork></GiKnifeFork> {recipeDetail.data.type.label}
            </div>
            <div className="cardDetail_container_infos_regime">
              <BiAward></BiAward> {recipeDetail.data.regime.label}
            </div>
          </div>
          <ul className="cardDetail_container_ingredients">
            <h2 className="ingredient_title">Ingrédients</h2>
            {recipeDetail.data.ingredients
              .map((ingredient: Ingredient, index: Key) => (
                <li className="cardDetail_container_ingredient" key={index}>
                  {ingredient.unit.label === "unité"
                    ? ingredient.quantity + " "
                    : ingredient.unit.label === "un peu"
                      ? ingredient.unit.label + " de "
                      : ingredient.quantity + " " + ingredient.unit.label + " de "}
                  <strong>{ingredient.label.toLowerCase()}</strong>
                </li>
              ))}
          </ul>
          {recipeDetail.data.steps
            .sort((a: Step, b: Step) => a.stepIndex - b.stepIndex)
            .map((step: Step, index: number) => (
              <div className="cardDetail_container_block" key={index}>
                <div className="cardDetail_container_block_index">
                  {index + 1}
                </div>
                <Divider></Divider>
                <div className="cardDetail_container_block_step" key={index}>
                  {step.description}
                </div>
              </div>
            ))}
        </>
      ) : (
        <Loader></Loader>
      )}
    </div>
  );
};

export default CardDetail;
