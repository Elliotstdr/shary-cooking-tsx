import { FileUpload } from "primereact/fileupload";
import React from "react";
import PropTypes from "prop-types";
import "./ImageUpload.scss";
import { successToast } from "../../Services/api";
import { connect } from "react-redux";

const ImageUpload = (props) => {
  const uploadHandler = ({ files }) => {
    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onload = () => {
      props.setImage(fileReader.result);
      successToast("L'image a bien été chargée", props.auth.toast);
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ImageUpload);
