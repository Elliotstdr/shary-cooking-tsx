import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../Modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateAuth } from "../../../Store/Actions/authActions";
import { Password } from "primereact/password";
import "./ModalForgotPassword.scss";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../Utils/Loader/loader";
import { useState } from "react";
import Bouton from "../../../Utils/Bouton/Bouton";
import axios from "axios";
import { errorToast, successToast } from "../../../Services/api";

const ModalForgotPassword = (props) => {
  const [error, setError] = useState(null);
  const [isloging, setIsLoging] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(true);
  const [oldValues, setOldValues] = useState(null);

  const defaultValues = {
    email: "",
    secretKey: "",
    resetKey: "",
    newPassword: "",
  };

  useEffect(() => {
    !props.visible && setIsLoging(false);
  }, [props.visible]);
  // variables du formulaire
  const { getValues, handleSubmit, control, reset } = useForm({
    defaultValues,
  });

  const onSubmit = () => {
    const data = getValues();

    if (isSendingMail && data.email !== "" && data.secretKey !== "") {
      setIsLoging(true);
      const sendMailData = {
        email: data.email,
        secretKey: data.secretKey,
      };
      sendMail(sendMailData);
      setError(null);
    } else if (
      !isSendingMail &&
      oldValues &&
      data.resetKey !== "" &&
      data.newPassword !== ""
    ) {
      setIsLoging(true);
      const dataForReset = {
        resetKey: data.resetKey,
        newPassword: data.newPassword,
        email: oldValues.email,
      };
      resetPassword(dataForReset);
      setError(null);
    } else {
      setError("Certaines informations ne sont pas remplies");
    }
  };

  const sendMail = (data) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL_API}/api/users/mailReset`, data)
      .then((res) => {
        setOldValues(data);
        reset();
        setIsLoging(false);
        setIsSendingMail(false);
        successToast(res.data, props.auth.toast);
      })
      .catch((error) => {
        setIsLoging(false);
        errorToast(error.response.data["hydra:description"], props.auth.toast);
      });
  };

  const resetPassword = (data) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL_API}/api/users/resetPassword`,
        data
      )
      .then((res) => {
        reset();
        setIsLoging(false);
        setIsSendingMail(true);
        props.setVisible(false);
        props.handleAuth({
          isConnected: true,
          token: res.data[1],
          userConnected: res.data[0],
          newLogTime: new Date().getTime(),
        });
      })
      .catch((error) => {
        setIsLoging(false);
        errorToast(error.response.data["hydra:description"], props.auth.toast);
      });
  };

  return (
    <Modal
      header="Connexion"
      visible={props.visible}
      setVisible={props.setVisible}
      className={"modal modal-login"}
      width={"20rem"}
    >
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        {isSendingMail ? (
          <>
            <div className="login__form__field">
              <h4 htmlFor="email">Adresse email</h4>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="Adresse email"
                    className="login__form__field-email"
                    type="email"
                  />
                )}
              />
            </div>
            <div className="login__form__field">
              <h4 htmlFor="secretKey">{"Clé secrète"}</h4>
              <Controller
                name="secretKey"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    placeholder={"Clé secrète"}
                    className={"login__form__field-secretKey"}
                    feedback={false}
                    autoComplete="new-password"
                    tooltip={
                      "Cette clé doit vous être fournie par le créateur du site."
                    }
                    tooltipOptions={{ position: "top" }}
                  />
                )}
              />
            </div>
            {error && <small className="p-error">{error}</small>}
            <div className="login__form__button">
              {isloging ? <Loader /> : <Bouton>Réinitialiser</Bouton>}
            </div>
          </>
        ) : (
          <>
            <div className="login__form__field">
              <h4 htmlFor="resetKey">Clé de réinitialisation :</h4>
              <Controller
                name="resetKey"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    feedback={false}
                    autoComplete="new-password"
                    placeholder="Clé de réinitialisation"
                    className="login__form__field-resetKey"
                  />
                )}
              />
            </div>
            <div className="login__form__field">
              <h4 htmlFor="newPassword">Nouveau mot de passe</h4>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    autoComplete="new-password"
                    placeholder={"mot de passe"}
                    className={"login__form__field-newPassword"}
                    feedback={false}
                  />
                )}
              />
            </div>
            <div
              className="send_new_mail"
              onClick={() => oldValues && sendMail(oldValues)}
            >
              Renvoyer le mail
            </div>
            {error && <small className="p-error">{error}</small>}
            <div className="login__form__button">
              {isloging ? <Loader /> : <Bouton>Changer de mot de passe</Bouton>}
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

ModalForgotPassword.propTypes = {
  auth: PropTypes.object,
  handleAuth: PropTypes.func,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  handleAuth: (value) => {
    dispatch(updateAuth(value));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalForgotPassword);
