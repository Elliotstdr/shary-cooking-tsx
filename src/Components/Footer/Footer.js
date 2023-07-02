import React from "react";
import "./Footer.scss";
import { useNavigate } from "react-router-dom";
import image from "../../assets/white-hat.png";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <img src={image} alt="" className="footer__left" />
      <div className="footer__center">
        <h1 className="footer__center__top">Shary Cooking</h1>
        <div className="footer__center__bottom">
          <span onClick={() => navigate("/")}>Accueil</span>
          <span onClick={() => navigate("/create")}>Créer une recette</span>
          <span onClick={() => navigate("/param")}>Profil</span>
          <span className="desktop">Mentions légales</span>
          <span className="desktop">Contact</span>
        </div>
      </div>
      <img src={image} alt="" className="footer__right" />
    </div>
  );
};

export default Footer;
