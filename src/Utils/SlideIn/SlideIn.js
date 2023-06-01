import React from "react";
import "./SlideIn.scss";
import ReactDOM from "react-dom";
import { CgCloseO } from "react-icons/cg";

const SlideIn = (props) => {
  const portalRoot = document.getElementById("app");
  return ReactDOM.createPortal(
    <div className={`slidein ${props.classname}`} id="slidein">
      <div className="slidein_modal">
        <div className="slidein_modal_header">
          <span>{props.header}</span>
          <CgCloseO
            onClick={() => props.setVisible(false)}
            className="close"
          ></CgCloseO>
        </div>
        <div className="slidein_modal_content">{props.children}</div>
      </div>
    </div>,
    portalRoot
  );
};

export default SlideIn;
