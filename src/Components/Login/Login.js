import React, { useState } from "react";
import Bouton from "../../Utils/Bouton/Bouton";
import "./Login.scss";
import ModalLogin from "../Modal/ModalLogin/ModalLogin";
import ModalRegister from "../Modal/ModalRegister/ModalRegister";
import image from "../../assets/accueilHC.jpg";
import ModalForgotPassword from "../Modal/ModalForgotPassword/ModalForgotPassword";

const Login = () => {
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [visibleModalRegister, setVisibleModalRegister] = useState(false);
  const [visibleModalForgot, setVisibleModalForgot] = useState(false);

  return (
    <div className="login_container">
      <img src={image} alt="background home" />
      <div className="login_container_box">
        <div className="login_container_box_title">
          <h1>Bienvenue sur Shary Cooking !</h1>
        </div>
        <div className="login_container_box_buttons">
          <Bouton
            btnTexte={"Se connecter"}
            btnAction={() => setVisibleModalLogin(true)}
          ></Bouton>
          <Bouton
            btnTexte={"Créer un compte"}
            btnAction={() => setVisibleModalRegister(true)}
          ></Bouton>
        </div>
      </div>

      {visibleModalLogin && (
        <ModalLogin
          visible={visibleModalLogin}
          setVisible={setVisibleModalLogin}
          setVisibleForgot={setVisibleModalForgot}
          header={"Se connecter"}
        ></ModalLogin>
      )}
      {visibleModalRegister && (
        <ModalRegister
          visible={visibleModalRegister}
          setVisible={setVisibleModalRegister}
          header={"Créer un compte"}
        ></ModalRegister>
      )}
      {visibleModalForgot && (
        <ModalForgotPassword
          visible={visibleModalForgot}
          setVisible={setVisibleModalForgot}
        ></ModalForgotPassword>
      )}
    </div>
  );
};

export default Login;
