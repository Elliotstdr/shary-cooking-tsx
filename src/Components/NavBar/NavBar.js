import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import neutralUser from "../../assets/neutralUser.png";
import { GiKnifeFork } from "react-icons/gi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { updateAuth } from "../../Store/Actions/authActions";
import { connect } from "react-redux";

const NavBar = (props) => {
  const navigate = useNavigate();
  return (
    <div className="navigation">
      <ul>
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
      <button className="btn-bleu" onClick={() => navigate("/create")}>
        <GiKnifeFork></GiKnifeFork>Créer une recette
      </button>
      <button className="btn-bleu" onClick={() => navigate("/shop")}>
        <AiOutlineShoppingCart></AiOutlineShoppingCart>Faire ma liste de courses
      </button>
      <div className="navigation_parameters">
        <img
          src={
            props.auth.userConnected.imageUrl
              ? process.env.REACT_APP_BASE_URL_API +
                props.auth.userConnected.imageUrl
              : neutralUser
          }
          alt="ma pp"
        ></img>
        <div className="navigation_parameters_menu">
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  handleAuth: (value) => {
    dispatch(updateAuth(value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
