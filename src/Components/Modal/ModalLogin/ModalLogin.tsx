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

interface Props {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setVisibleForgot: React.Dispatch<React.SetStateAction<boolean>>,
  header: string
}

interface Values {
  email: string
  password: string,
}

const ModalLogin = (props: Props) => {
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const [isloging, setIsLoging] = useState(false);

  const defaultValues: Values = {
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

  const onSubmit = async () => {
    setIsLoging(true);
    const data = getValues();

    const response = await fetchPost(`/auth`, data, true);
    if (response.error || !response.data?.token) {
      setIsLoging(false);
      errorToast("L'authentification a échoué");
      return;
    }
    const subResponse = await fetchPost(
      `/users/by_email`,
      {},
      false,
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
          <h4>Adresse email</h4>
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
          {errors.email && <small className="p-error">{errors.email.message}</small>}
        </div>
        <div className="login__form__field">
          <h4>Mot de passe</h4>
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
          {errors.password && <small className="p-error">{errors.password.message}</small>}
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
