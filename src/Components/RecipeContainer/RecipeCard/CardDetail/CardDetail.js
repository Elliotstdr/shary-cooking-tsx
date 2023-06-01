import React from "react";
import { useFetchGet } from "../../../../Services/api";
import Loader from "../../../../Utils/Loader/loader";
import PropTypes from "prop-types";

const CardDetail = (props) => {
  const recipeDetail = useFetchGet(`/recipes/${props.id}`);

  return (
    <div className="cardDetail_container">
      {recipeDetail.loaded ? (
        <>
          <div className="cardDetail_container_author">
            Créée par {recipeDetail.data.postedByUser.name}
          </div>
          <div className="cardDetail_container_title">
            {recipeDetail.data.title}
          </div>
          <div className="cardDetail_container_time">
            Temps : {recipeDetail.data.time}
          </div>
          <div className="cardDetail_container_number">
            Pour {recipeDetail.data.number} personnes
          </div>
          <div className="cardDetail_container_infos">
            <div className="cardDetail_container_infos_type">
              Type : {recipeDetail.data.type.label}
            </div>
            <div className="cardDetail_container_infos_regime">
              Regime : {recipeDetail.data.regime.label}
            </div>
          </div>
          {recipeDetail.data.steps
            .sort((a, b) => a.stepIndex - b.stepIndex)
            .map((step, index) => (
              <div className="cardDetail_container_step" key={index}>
                {step.description}
              </div>
            ))}
          {recipeDetail.data.ingredients.map((ingredient, index) => (
            <div className="cardDetail_container_ingredient" key={index}>
              {ingredient.quantity}
              {ingredient.unit.label} de {ingredient.label}
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
