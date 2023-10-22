import React from "react";
import "./Bouton.scss";
import PropTypes from "prop-types";

interface Props {
  className?: string,
  type?: string,
  btnAction?: React.MouseEventHandler<HTMLButtonElement>,
  children?: any,
  btnTexte?: string
}

const Bouton = (props: Props) => {
  return (
    <button
      className={`bouton ${props.className} ${props.type}`}
      onClick={props.btnAction}
    >
      {props.children}
      {props.btnTexte}
    </button>
  );
};

Bouton.propTypes = {
  btnAction: PropTypes.func,
  btnTexte: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.any,
};

Bouton.defaultProps = {
  type: "slide",
  className: "",
};

export default Bouton;
