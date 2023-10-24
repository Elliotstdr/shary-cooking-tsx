import React from "react";
import "./Bouton.scss";

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

Bouton.defaultProps = {
  type: "slide",
  className: "",
};

export default Bouton;
