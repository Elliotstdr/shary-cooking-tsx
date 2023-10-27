import React, { useState } from "react";
import "./Footer.scss";
import { useNavigate } from "react-router-dom";
import image from "../../assets/white-hat.png";
import BugReport from "../Modal/BugReport/BugReport";

const Footer = () => {
  const navigate = useNavigate();
  const [reportBugModal, setReportBugModal] = useState(false);

  return (
    <div className="footer">
      <img src={image} alt="" className="footer__left" />
      <div className="footer__center">
        <h1 className="footer__center__top">Shary Cooking</h1>
        <div className="footer__center__bottom">
          <span onClick={() => navigate("/")}>Accueil</span>
          <span onClick={() => navigate("/create")}>Créer une recette</span>
          <span className="desktop" onClick={() => navigate("/param")}>
            Profil
          </span>
          <span onClick={() => setReportBugModal(true)}>Un problème?</span>
          <span className="desktop">Mentions légales</span>
        </div>
      </div>
      <img src={image} alt="" className="footer__right" />

      {reportBugModal && (
        <BugReport
          reportBugModal={reportBugModal}
          setReportBugModal={setReportBugModal}
        ></BugReport>
      )}
    </div>
  );
};

export default Footer;
