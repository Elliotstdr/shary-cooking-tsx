import { FileUpload } from "primereact/fileupload";
import React from "react";
import PropTypes from "prop-types";
import "./ImageUpload.scss";
import { successToast } from "../../Services/functions";

const ImageUpload = (props) => {
  const uploadHandler = ({ files }) => {
    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      props.setImage(fileReader.result);
      successToast("L'image a bien été chargée");
    };
    fileReader.readAsDataURL(file);
  };
  return (
    <FileUpload
      name={"image"}
      className="upload_image"
      customUpload={true}
      uploadHandler={uploadHandler}
      chooseLabel={props.image ? "Modifier l'image" : "Ajouter une image"}
      auto
      maxFileSize={5000000}
      accept="image/*"
    ></FileUpload>
  );
};

ImageUpload.propType = {
  setImage: PropTypes.func,
  image: PropTypes.object,
};

export default ImageUpload;
