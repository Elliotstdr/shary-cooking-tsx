import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import { GiKnifeFork } from "react-icons/gi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { updateAuth } from "../../Store/Actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { GiCook } from "react-icons/gi";
import Bouton from "../../Utils/Bouton/Bouton";
import { Accordion, AccordionTab } from "primereact/accordion";

const NavBar = (props) => {
  const [showParamMenu, setShowParamMenu] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="navigation">
      <ul className="menu desktop">
        <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
          <li>
            <strong>Accueil</strong>
          </li>
        </NavLink>
        <NavLink
          to="/fav"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <li>
            <strong>Favoris</strong>
          </li>
        </NavLink>
        <NavLink
          to="/myrecipes"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <li>
            <strong>Mes recettes</strong>
          </li>
        </NavLink>
      </ul>
      <Accordion
        activeIndex=""
        expandIcon="pi pi-bars"
        collapseIcon="pi pi-bars"
      >
        <AccordionTab header="Menu">
          <ul className="menu mobile">
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>
                <strong>Accueil</strong>
              </li>
            </NavLink>
            <NavLink
              to="/fav"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>
                <strong>Favoris</strong>
              </li>
            </NavLink>
            <NavLink
              to="/myrecipes"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>
                <strong>Mes recettes</strong>
              </li>
            </NavLink>
            <NavLink
              to="/shop"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>
                <strong>Ma liste de courses</strong>
              </li>
            </NavLink>
          </ul>
        </AccordionTab>
      </Accordion>
      <Bouton className="first" btnAction={() => navigate("/create")}>
        <GiKnifeFork></GiKnifeFork>Créer une recette
      </Bouton>
      <Bouton className="second" btnAction={() => navigate("/shop")}>
        <AiOutlineShoppingCart></AiOutlineShoppingCart>Ma liste de courses
      </Bouton>
      <div className="navigation_parameters">
        {props.auth.userConnected.imageUrl ? (
          <img
            src={
              process.env.REACT_APP_BASE_URL_API +
              props.auth.userConnected.imageUrl
            }
            alt="ma pp"
            onClick={() => setShowParamMenu(!showParamMenu)}
          ></img>
        ) : (
          <GiCook
            className="cooker"
            onClick={() => setShowParamMenu(!showParamMenu)}
          ></GiCook>
        )}
        <div
          className={`navigation_parameters_menu ${showParamMenu && "visible"}`}
        >
          <span onClick={() => navigate("/param")}>Mon profil</span>
          <span
            onClick={() => {
              props.handleAuth({
                isConnected: false,
                userConnected: {},
              });
              navigate("/");
            }}
          >
            Se déconnecter
          </span>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  auth: PropTypes.object,
  handleAuth: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  handleAuth: (value) => {
    dispatch(updateAuth(value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
