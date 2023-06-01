import React from "react";
import "./Bouton.scss";
import PropTypes from "prop-types";

/**
 * Permet d'afficher les boutons blancs
 */
const Bouton = (props) => {
  return (
    <button
      className={props.className ? props.className : "btn-blanc"}
      onClick={props.btnAction}
      type={props.action}
    >
      {props.btnIcone}
      {props.btnTexte}
      {props.children}
    </button>
  );
};

Bouton.propTypes = {
  btnAction: PropTypes.func,
  btnTexte: PropTypes.string,
  children: PropTypes.any,
  btnIcone: PropTypes.any,
  action: PropTypes.string,
  className: PropTypes.string,
};

Bouton.defaultProps = {
  action: "submit",
};

export default Bouton;
