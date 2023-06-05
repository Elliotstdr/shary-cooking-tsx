import React from "react";
import "./SlideIn.scss";
import { Sidebar } from "primereact/sidebar";

const SlideIn = (props) => {
  return (
    <Sidebar
      className={`sidebar ${props.className}`}
      visible={props.visible}
      onHide={() => props.setVisible(false)}
      position="left"
      showCloseIcon
      closeOnEscape
      style={{ width: props.width ? props.width : "fit-content" }}
    >
      {props.children}
    </Sidebar>
  );
};

export default SlideIn;
