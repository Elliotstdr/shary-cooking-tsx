import React from "react";
import "./SlideIn.scss";
import { Sidebar } from "primereact/sidebar";

interface Props {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  className?: string,
  children?: any,
  width?: string
}

const SlideIn = (props: Props) => {
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
