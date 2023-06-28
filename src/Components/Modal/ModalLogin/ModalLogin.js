import React, { useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../Modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { updateAuth } from "../../../Store/Actions/authActions";
import { Password } from "primereact/password";
import "./ModalLogin.scss";
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

  const onSubmit = () => {
    setIsLoging(true);
    const data = getValues();
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL_API}/api/users/loginCheck`,
        data,
        {
          headers: {
            accept: "application/json",
          },
        }
      )
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
        header="Connexion"
        visible={props.visible}
        setVisible={props.setVisible}
        className={"modal modal-login"}
        width={"20rem"}
      >
        <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
          <Toast ref={cancelToast}></Toast>
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
          <div className="login__form__button">
            {isloging ? <Loader /> : <Bouton>Se connecter</Bouton>}
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
