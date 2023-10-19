import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Password } from "primereact/password";
import "./ModalLogin.scss";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../Utils/Loader/loader";
import { useState } from "react";
import Bouton from "../../../Utils/Bouton/Bouton";
import { errorToast } from "../../../Services/functions";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";
import { fetchPost } from "../../../Services/api";

const ModalLogin = (props) => {
  const dispatch = useDispatch();
  const updateAuth = (value) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const [isloging, setIsLoging] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    !props.visible && setIsLoging(false);
  }, [props.visible]);
  // variables du formulaire
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
    setIsLoging(true);
    const data = getValues();

    const response = await fetchPost(`/auth`, data, true);
    if (response.error) {
      setIsLoging(false);
      errorToast("L'authentification a échoué");
      return;
    }
    const subResponse = await fetchPost(
      `/users/by_email`,
      {},
      null,
      response.data.token
    );
    setIsLoging(false);
    if (subResponse.error) {
      errorToast("L'authentification a échoué");
      return;
    }
    updateAuth({
      isConnected: true,
      token: response.data.token,
      userConnected: subResponse.data,
      newLogTime: new Date().getTime(),
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
        <div className="login__form__field">
          <h4 htmlFor="email">Adresse email</h4>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "L'email est obligatoire",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                placeholder="Adresse email"
                className="login__form__field-email"
                type="email"
              />
            )}
          />
          {getFormErrorMessage("email")}
        </div>
        <div className="login__form__field">
          <h4 htmlFor="password">Mot de passe</h4>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Le mot de passe est obligatoire",
            }}
            render={({ field }) => (
              <Password
                {...field}
                placeholder={"Mot de passe"}
                className="login__form__field-password"
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("password")}
        </div>
        <div
          className="forgot_password"
          onClick={() => {
            props.setVisible(false);
            props.setVisibleForgot(true);
          }}
        >
          Mot de passe oublié ?
        </div>
        <div className="login__form__button">
          {isloging ? <Loader /> : <Bouton>Se connecter</Bouton>}
        </div>
      </form>
    </Modal>
  );
};

ModalLogin.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  setVisibleForgot: PropTypes.func,
};

export default ModalLogin;
