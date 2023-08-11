import React from "react";
import "./CardDetail.scss";
import { timeToString, useFetchGet } from "../../../../Services/api";
import Loader from "../../../../Utils/Loader/loader";
import PropTypes from "prop-types";
import default2 from "../../../../assets/default2.jpg";
import { GiKnifeFork } from "react-icons/gi";
import { BsPeople } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import { BiAward } from "react-icons/bi";
import { Divider } from "primereact/divider";
import { CiEdit } from "react-icons/ci";
import { connect } from "react-redux";

const CardDetail = (props) => {
  const recipeDetail = useFetchGet(`/recipes/${props.id}`, props.auth.token);

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
            {recipeDetail.data.postedByUser.id ===
              props.auth.userConnected.id && (
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
              .sort((a, b) => a.type - b.type)
              .map((ingredient, index) => (
                <li className="cardDetail_container_ingredient" key={index}>
                  {ingredient.unit.label !== "unité"
                    ? ingredient.quantity + " " + ingredient.unit.label + " de "
                    : ingredient.quantity + " "}
                  <strong>{ingredient.label.toLowerCase()}</strong>
                </li>
              ))}
          </ul>
          {recipeDetail.data.steps
            .sort((a, b) => a.stepIndex - b.stepIndex)
            .map((step, index) => (
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

CardDetail.propType = {
  id: PropTypes.number,
  auth: PropTypes.object,
  setVisible: PropTypes.func,
  setVisibleModif: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CardDetail);
