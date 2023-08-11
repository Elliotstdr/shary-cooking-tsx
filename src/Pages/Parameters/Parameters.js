import React, { useEffect, useState } from "react";
import "./Parameters.scss";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import Bouton from "../../Utils/Bouton/Bouton";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import axios from "axios";
import { connect } from "react-redux";
import { updateAuth } from "../../Store/Actions/authActions";
import PropTypes from "prop-types";
import { errorToast, successToast } from "../../Services/api";
import Loader from "../../Utils/Loader/loader";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const Parameters = (props) => {
  const [isModifying, setIsModifying] = useState(false);
  const [showMDP, setShowMDP] = useState(false);
  const [isEqualPassword, setIsEqualPassword] = useState(false);
  const [image, setImage] = useState(null);

  const defaultValues = {
    name: props.auth.userConnected.name,
    lastname: props.auth.userConnected.lastname,
    email: props.auth.userConnected.email,
    password: "",
    confirmPassword: "",
    oldPassword: "",
    image: null,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm({ defaultValues });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const setFields = () => {
    let data = getValues();
    for (var key in data) {
      if (!data[key] || data[key]?.length === 0) {
        delete data[key];
      }
    }
    if (getValues("password") === "") {
      delete data.oldPassword;
    }
    delete data.confirmPassword;

    if (image) {
      data.image = image;
    }

    return data;
  };

  const onSubmit = () => {
    setIsModifying(true);
    const data = setFields();

    axios
      .put(
        `${process.env.REACT_APP_BASE_URL_API}/api/users/${props.auth.userConnected.id}`,
        data,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${props.auth.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data[1]) {
          props.handleAuth({
            token: res.data[1],
          });
        }
        setShowMDP(false);
        setValue("oldPassword", "");
        setValue("password", "");
        setValue("confirmPassword", "");
        let tempArray = { ...props.auth.userConnected };
        tempArray.email = data.email;
        tempArray.name = data.name;
        tempArray.lastname = data.lastname;
        tempArray.imageUrl = res.data[0];
        props.handleAuth({
          userConnected: tempArray,
        });
        successToast("Votre profil a bien été mis à jour", props.auth.toast);
        setIsModifying(false);
      })
      .catch(() =>
        errorToast(
          "Une erreur est survenue lors de la modification de votre profil",
          props.auth.toast
        )
      );
  };

  return (
    <div className="parameters">
      <NavBar></NavBar>
      <form className="param__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="param__form__field">
          <h4 htmlFor="image">Photo</h4>
          {props.auth.userConnected.imageUrl && (
            <div className="param_profile_picture">
              <img
                src={
                  process.env.REACT_APP_BASE_URL_API +
                  props.auth.userConnected.imageUrl
                }
                alt="Fond news"
              />
            </div>
          )}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload image={image} setImage={setImage}></ImageUpload>
            )}
          />
          {getFormErrorMessage("image")}
        </div>
        <div className="param__form__field">
          <h4 htmlFor="name">Prénom</h4>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Le prénom est obligatoire",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                value={getValues("name")}
                placeholder="Fanny"
                className="param__form__field-name"
              />
            )}
          />
          {getFormErrorMessage("name")}
        </div>
        <div className="param__form__field">
          <h4 htmlFor="lastname">Nom</h4>
          <Controller
            name="lastname"
            control={control}
            rules={{
              required: "Le nom est obligatoire",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                value={getValues("lastname")}
                placeholder="Lefebvre"
                className="param__form__field-lastname"
              />
            )}
          />
          {getFormErrorMessage("lastname")}
        </div>
        <div className="param__form__field">
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
                value={getValues("email")}
                placeholder="Adresse email"
                className="param__form__field-email"
                type="email"
              />
            )}
          />
          {getFormErrorMessage("email")}
        </div>
        <Bouton
          type={"normal"}
          btnAction={(e) => {
            e.preventDefault();
            setShowMDP(!showMDP);
          }}
        >
          Modifier le mot de passe
        </Bouton>
        {showMDP && (
          <div>
            <Divider></Divider>
            <div className="param__form__field">
              <h4 htmlFor="oldPassword">Précédent mot de passe</h4>
              <Controller
                name="oldPassword"
                control={control}
                rules={{
                  required:
                    getValues("password").length > 0
                      ? "L'ancien mot de passe est obligatoire"
                      : false,
                }}
                render={({ field }) => (
                  <Password
                    autoComplete="new-password"
                    {...field}
                    placeholder={"Ancien mot de passe"}
                    className="param__form__field-oldPassword"
                    feedback={false}
                  />
                )}
              />
              {getFormErrorMessage("oldPassword")}
            </div>
            <div className="param__form__field">
              <h4 htmlFor="password">Nouveau mot de passe</h4>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Password
                    autoComplete="new-password"
                    {...field}
                    placeholder={"Mot de passe"}
                    className="param__form__field-password"
                    feedback={false}
                  />
                )}
              />
              {getFormErrorMessage("password")}
            </div>
            <div className="param__form__field">
              <h4 htmlFor="password">Confirmer le mot de passe</h4>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required:
                    getValues("password").length > 0
                      ? "L'ancien mot de passe est obligatoire"
                      : false,
                  validate: (value) =>
                    value === getValues("password") ||
                    getValues("password") === "" ||
                    "Les mots de passe ne sont pas identiques",
                }}
                render={({ field }) => (
                  <Password
                    autoComplete="new-password"
                    {...field}
                    placeholder={"Mot de passe"}
                    className={
                      isEqualPassword
                        ? "param__form__field-confirmpassword equal"
                        : "param__form__field-confirmpassword nonequal"
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
              {getFormErrorMessage("confirmPassword")}
            </div>
          </div>
        )}
        <Divider></Divider>
        {isModifying ? (
          <Loader></Loader>
        ) : (
          <Bouton>Valider mes modifications</Bouton>
        )}
      </form>
      <Footer></Footer>
    </div>
  );
};

Parameters.propTypes = {
  auth: PropTypes.object,
  handleAuth: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
  handleAuth: (value) => {
    dispatch(updateAuth(value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Parameters);
