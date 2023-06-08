import React from "react";
import "./Footer.scss";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <span onClick={() => navigate("/")}>Accueil</span>
      <span onClick={() => navigate("/create")}>Créer une recette</span>
      <span onClick={() => navigate("/param")}>Profil</span>
      <span className="desktop">Mentions légales</span>
      <span className="desktop">Contact</span>
    </div>
  );
};

export default Footer;
