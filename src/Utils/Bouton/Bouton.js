import React from "react";
import "./Bouton.scss";
import PropTypes from "prop-types";

const Bouton = (props) => {
  return (
    <button className="bouton" onClick={props.btnAction}>
      {props.children}
      {props.btnTexte}
    </button>
  );
};

Bouton.propTypes = {
  btnAction: PropTypes.func,
  btnTexte: PropTypes.string,
  children: PropTypes.any,
};

export default Bouton;
