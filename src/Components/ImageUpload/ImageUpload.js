import { FileUpload } from "primereact/fileupload";
import React from "react";
import PropTypes from "prop-types";
import "./ImageUpload.scss";
import { errorToast, successToast } from "../../Services/api";

const ImageUpload = (props) => {
  const uploadOptions = {
    label: " ",
    icon: "pi pi-check",
    className: "bouton_valider",
  };
  const cancelOptions = {
    label: " ",
    icon: "pi pi-times",
    className: "bouton_supprimer",
  };

  const uploadHandler = ({ files }) => {
    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      props.setImage(fileReader.result);
      props.setImageName(file.name);
      successToast("L'image a bien été chargée", props.uploadToast);
    };
    fileReader.readAsDataURL(file);
  };
  return (
    <FileUpload
      name={"image"}
      className="upload_image"
      customUpload={true}
      uploadHandler={uploadHandler}
      chooseLabel="Modifier l'image"
      onClear={() => {
        props.setImage(null);
        errorToast(
          "Le fichier a bien été supprimé",
          props.cancelToast,
          "Suppression"
        );
      }}
      uploadOptions={uploadOptions}
      cancelOptions={cancelOptions}
      accept="image/*"
    ></FileUpload>
  );
};

ImageUpload.propType = {
  uploadToast: PropTypes.object,
  cancelToast: PropTypes.object,
  setImage: PropTypes.func,
  setImageName: PropTypes.func,
};

export default ImageUpload;
