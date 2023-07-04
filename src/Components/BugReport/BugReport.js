import React, { useRef, useState } from "react";
import "./BugReport.scss";
import PropTypes from "prop-types";
import Modal from "../Modal/Modal";
import { Controller, useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import Loader from "../../Utils/Loader/loader";
import Bouton from "../../Utils/Bouton/Bouton";
import { InputText } from "primereact/inputtext";
import ImageUpload from "../ImageUpload/ImageUpload";
import axios from "axios";
import { errorToast } from "../../Services/api";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { connect } from "react-redux";

const BugReport = (props) => {
  const toast = useRef(null);
  const [sending, setSending] = useState(false);
  const [image, setImage] = useState(null);
  const [successView, setSuccessView] = useState(false);

  const defaultValues = {
    title: "",
    message: "",
    file: null,
  };

  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const onSubmit = () => {
    setSending(true);
    let data = getValues();
    console.log(props);
    data.firstname = props.auth.userConnected.name;
    data.lastname = props.auth.userConnected.lastname;
    if (image) {
      data.file = image;
    }

    axios
      .post(`${process.env.REACT_APP_BASE_URL_API}/api/users/sendReport`, data)
      .then(() => {
        setSuccessView(true);
      })
      .catch(() =>
        errorToast("Une erreur est survenue lors de l'envoi du mail", toast)
      )
      .finally(() => setSending(false));
  };

  return (
    <Modal
      header="Report de bug"
      visible={props.reportBugModal}
      setVisible={props.setReportBugModal}
      className={"modal modal-bug"}
    >
      {!successView ? (
        <form className="bug__form" onSubmit={handleSubmit(onSubmit)}>
          <Toast ref={toast}></Toast>
          <div className="bug__form__field">
            <h4 htmlFor="title">Intitulé du problème :</h4>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Le titre est obligatoire",
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Problème quand je clique sur le bouton ..."
                  className="bug__form__field-title"
                />
              )}
            />
            {getFormErrorMessage("title")}
          </div>
          <div className="bug__form__field">
            <h4 htmlFor="message">Description :</h4>
            <Controller
              name="message"
              control={control}
              rules={{
                required: "La description est obligatoire",
              }}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  placeholder="Où? Quand? Comment?"
                  className="bug__form__field-message"
                  feedback={false}
                />
              )}
            />
            {getFormErrorMessage("message")}
          </div>
          <div className="bug__form__field file">
            <h4 htmlFor="file">Capture d'écran :</h4>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  uploadToast={toast}
                  cancelToast={toast}
                  image={image}
                  setImage={setImage}
                ></ImageUpload>
              )}
            />
          </div>
          <div className="bug__form__button">
            {sending ? <Loader /> : <Bouton>Envoyer mon rapport</Bouton>}
          </div>
        </form>
      ) : (
        <div className="success_view">
          <div className="success_message">
            Mail envoyé ! Merci de votre retour !
          </div>
          <BsFillCheckCircleFill className="chosen_check"></BsFillCheckCircleFill>
        </div>
      )}
    </Modal>
  );
};

BugReport.propTypes = {
  auth: PropTypes.object,
  reportBugModal: PropTypes.bool,
  setReportBugModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(BugReport);
