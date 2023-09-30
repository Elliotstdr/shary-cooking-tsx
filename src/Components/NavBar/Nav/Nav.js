import React from "react";
import "./Nav.scss";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const Nav = (props) => {
  return (
    <ul className={`menu ${props.className}`}>
      <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
        <li>
          <strong>Accueil</strong>
        </li>
      </NavLink>
      <NavLink
        to="/all"
        className={(nav) => (nav.isActive ? "nav-active" : "")}
      >
        <li>
          <strong>Gallerie</strong>
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
  );
};

Nav.propTypes = {
  className: PropTypes.string,
};

export default Nav;
