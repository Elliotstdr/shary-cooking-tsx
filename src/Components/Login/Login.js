import React, { useState } from "react";
import Bouton from "../../Utils/Bouton/Bouton";
import "./Login.scss";
import ModalLogin from "../Modal/ModalLogin/ModalLogin";
import ModalRegister from "../Modal/ModalRegister/ModalRegister";

const Login = () => {
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [visibleModalRegister, setVisibleModalRegister] = useState(false);

  return (
    <div className="login_container">
      <div className="login_container_title">
        <h1>Bienvenue sur Shary Cooking !</h1>
      </div>
      <div className="login_container_buttons">
        <Bouton
          btnTexte={"Se connecter"}
          btnAction={() => setVisibleModalLogin(true)}
        ></Bouton>
        <Bouton
          btnTexte={"Créer un compte"}
          btnAction={() => setVisibleModalRegister(true)}
        ></Bouton>
      </div>

      {visibleModalLogin && (
        <ModalLogin
          visible={visibleModalLogin}
          setVisible={setVisibleModalLogin}
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
    </div>
  );
};

export default Login;
