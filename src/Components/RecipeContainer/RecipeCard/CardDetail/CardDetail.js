import React from "react";
import "./CardDetail.scss";
import { useFetchGet } from "../../../../Services/api";
import Loader from "../../../../Utils/Loader/loader";
import PropTypes from "prop-types";
import default2 from "../../../../assets/default2.jpg";
import { GiKnifeFork } from "react-icons/gi";
import { BsPeople } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { BiAward } from "react-icons/bi";
import { Divider } from "primereact/divider";

const CardDetail = (props) => {
  const recipeDetail = useFetchGet(`/recipes/${props.id}`);

  return (
    <div className="cardDetail_container">
      {recipeDetail.loaded ? (
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
            <span>Créé par {recipeDetail.data.postedByUser?.name}</span>
          </div>
          <div className="cardDetail_container_group">
            <div className="cardDetail_container_time">
              <BiTimer></BiTimer> {recipeDetail.data.time}
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
            <h2 className="ingredient_title">Ingrédients :</h2>
            {recipeDetail.data.ingredients
              .sort((a, b) => a.type - b.type)
              .map((ingredient, index) => (
                <li className="cardDetail_container_ingredient" key={index}>
                  {ingredient.quantity} {ingredient.unit.label} de{" "}
                  <strong>{ingredient.label}</strong>
                </li>
              ))}
          </ul>
          {recipeDetail.data.steps
            .sort((a, b) => a.stepIndex - b.stepIndex)
            .map((step, index) => (
              <div className="cardDetail_container_block">
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

CardDetail.propType = {
  id: PropTypes.number,
};

export default CardDetail;
