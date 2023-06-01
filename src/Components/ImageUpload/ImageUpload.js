import { FileUpload } from "primereact/fileupload";
import React from "react";
import PropTypes from "prop-types";
import "./ImageUpload.scss";

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
      props.uploadToast.current.show({
        severity: "success",
        summary: "Succès : ",
        detail: "L'image a bien été chargée",
        life: 3000,
      });
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
        props.cancelToast.current.show({
          severity: "error",
          summary: "Suppression : ",
          detail: "Le fichier a bien été supprimé",
          life: 3000,
        });
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
