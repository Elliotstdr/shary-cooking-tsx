import React, { useState } from "react";
import "./BugReport.scss";
import PropTypes from "prop-types";
import Modal from "../Modal/Modal";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import Loader from "../../Utils/Loader/loader";
import Bouton from "../../Utils/Bouton/Bouton";
import { InputText } from "primereact/inputtext";
import ImageUpload from "../ImageUpload/ImageUpload";
import { errorToast } from "../../Services/functions";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { fetchPost } from "../../Services/api";

const BugReport = (props) => {
  const [sending, setSending] = useState(false);
  const [image, setImage] = useState(null);
  const [successView, setSuccessView] = useState(false);

  const auth = useSelector((state) => state.auth);

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

  const onSubmit = async () => {
    setSending(true);
    let data = getValues();
    data.firstname = auth.userConnected.name;
    data.lastname = auth.userConnected.lastname;
    if (image) {
      data.file = image;
    }

    const response = await fetchPost(`/users/sendReport`, data);
    setSending(false);
    if (response.error) {
      errorToast("Une erreur est survenue lors de l'envoi du mail");
      return;
    }
    setSuccessView(true);
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
                  autoResize
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
                <ImageUpload image={image} setImage={setImage}></ImageUpload>
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
  reportBugModal: PropTypes.bool,
  setReportBugModal: PropTypes.func,
};

export default BugReport;
