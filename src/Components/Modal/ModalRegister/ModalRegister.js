import React, { useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../Modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateAuth } from "../../../Store/Actions/authActions";
import { Password } from "primereact/password";
import "./ModalRegister.scss";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../Utils/Loader/loader";
import { useState } from "react";
import Bouton from "../../../Utils/Bouton/Bouton";
import axios from "axios";
import { Toast } from "primereact/toast";
import { errorToast } from "../../../Services/api";

const ModalLogin = (props) => {
  const cancelToast = useRef(null);
  const [isloging, setIsLoging] = useState(false);
  const [isEqualPassword, setIsEqualPassword] = useState(false);

  const defaultValues = {
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    secretKey: "",
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

  const onSubmit = () => {
    setIsLoging(true);
    const data = getValues();
    axios
      .post(`${process.env.REACT_APP_BASE_URL_API}/api/users`, data, {
        headers: {
          accept: "application/json",
        },
      })
      .then((res) => {
        setIsLoging(false);
        props.handleAuth({
          isConnected: true,
          userConnected: res.data,
        });
      })
      .catch((error) => {
        setIsLoging(false);
        errorToast(error.response.data.detail, cancelToast);
      });
  };

  return (
    <>
      <Modal
        header="Création de compte"
        visible={props.visible}
        setVisible={props.setVisible}
        className={"modal modal-login"}
        width={"30rem"}
      >
        <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
          <Toast ref={cancelToast}></Toast>
          <div className="login__form__field">
            <h4>Prénom</h4>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Le prénom est obligatoire",
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Prénom"
                  className="login__form__field-name"
                />
              )}
            />
            {getFormErrorMessage("name")}
          </div>
          <div className="login__form__field">
            <h4>Nom</h4>
            <Controller
              name="lastname"
              control={control}
              rules={{
                required: "Le nom est obligatoire",
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Nom"
                  className="login__form__field-lastname"
                />
              )}
            />
            {getFormErrorMessage("lastname")}
          </div>
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
                minLength: {
                  value: 4,
                  message: "Le mot de passe doit faire au moins 4 caractères",
                },
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  placeholder={"Mot de passe"}
                  className="login__form__field-password"
                  feedback={true}
                />
              )}
            />
            {getFormErrorMessage("password")}
          </div>
          <div className="login__form__field">
            <h4 htmlFor="password">Confirmer le mot de passe</h4>
            <Controller
              name="confirmpassword"
              control={control}
              rules={{
                required: "Le mot de passe est obligatoire",
                validate: (value) => {
                  return value === getValues("password");
                },
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  placeholder={"Mot de passe"}
                  className={
                    isEqualPassword
                      ? "login__form__field-confirmpassword equal"
                      : "login__form__field-confirmpassword nonequal"
                  }
                  feedback={false}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setIsEqualPassword(
                      getValues("password").length > 0 &&
                        e.target.value === getValues("password")
                    );
                  }}
                />
              )}
            />
            {getFormErrorMessage("confirmpassword")}
          </div>
          <div className="login__form__field">
            <h4 htmlFor="password">{"Clé secrète"}</h4>
            <Controller
              name="secretKey"
              control={control}
              rules={{
                required: "La clé secrète est obligatoire",
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  placeholder={"Clé secrète"}
                  className={"login__form__field-secretKey"}
                  feedback={false}
                  tooltip={
                    "Cette clé doit vous être fournie par le créateur du site."
                  }
                  tooltipOptions={{ position: "top" }}
                />
              )}
            />
            {getFormErrorMessage("secretKey")}
          </div>
          <div className="login__form__button">
            <Bouton>{isloging ? <Loader /> : "Créer un compte"}</Bouton>
          </div>
        </form>
      </Modal>
    </>
  );
};

ModalLogin.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(ModalLogin);
