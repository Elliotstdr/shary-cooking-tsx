import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.scss";
import { GiKnifeFork } from "react-icons/gi";
import { updateAuth } from "../../Store/Actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { GiCook } from "react-icons/gi";
import Bouton from "../../Utils/Bouton/Bouton";
import Nav from "./Nav/Nav";

const NavBar = (props) => {
  const [showParamMenu, setShowParamMenu] = useState(false);
  const [visibleMobile, setVisibleMobile] = useState(false);
  const navigate = useNavigate();

  const useOutsideAlerter = (ref, command) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          command();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }; // eslint-disable-next-line
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setShowParamMenu(false));

  const menuRef = useRef(null);
  useOutsideAlerter(menuRef, () => setVisibleMobile(false));

  return (
    <div className="navigation">
      <Nav className="desktop"></Nav>
      <div className="navigation__mobile" ref={menuRef}>
        <div
          className="navigation__mobile__header"
          onClick={() => setVisibleMobile(!visibleMobile)}
        >
          <div className="pi pi-bars"></div>
          Menu
        </div>
        <Nav className={`mobile ${visibleMobile ? "visible" : "hidden"}`}></Nav>
      </div>
      <Bouton className="first" btnAction={() => navigate("/create")}>
        <GiKnifeFork></GiKnifeFork>Créer une recette
      </Bouton>
      <div className="navigation_parameters" ref={wrapperRef}>
        {props.auth.userConnected.imageUrl ? (
          <img
            src={
              process.env.REACT_APP_BASE_URL_API +
              props.auth.userConnected.imageUrl
            }
            alt="ma pp"
            onClick={() => setShowParamMenu(!showParamMenu)}
          ></img>
        ) : (
          <GiCook
            className="cooker"
            onClick={() => setShowParamMenu(!showParamMenu)}
          ></GiCook>
        )}
        <div
          className={`navigation_parameters_menu ${showParamMenu && "visible"}`}
        >
          <span onClick={() => navigate("/param")}>Mon profil</span>
          <span
            onClick={() => {
              props.handleAuth({
                isConnected: false,
                token: null,
                userConnected: {},
                newLogTime: null,
              });
              navigate("/");
            }}
          >
            Se déconnecter
          </span>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
