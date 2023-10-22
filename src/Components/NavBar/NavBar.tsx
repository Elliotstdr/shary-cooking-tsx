import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.scss";
import { GiKnifeFork } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { GiCook } from "react-icons/gi";
import Bouton from "../../Utils/Bouton/Bouton";
import Nav from "./Nav/Nav";
import { UPDATE_AUTH } from "../../Store/Reducers/authReducer";

const NavBar = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const [showParamMenu, setShowParamMenu] = useState(false);
  const [visibleMobile, setVisibleMobile] = useState(false);
  const navigate = useNavigate();

  const useOutsideAlerter = (ref: any, command: () => void) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
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
        {auth.userConnected?.imageUrl ? (
          <img
            src={
              process.env.REACT_APP_BASE_URL_API + auth.userConnected.imageUrl
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
              updateAuth({
                isConnected: false,
                token: null,
                userConnected: null,
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

export default NavBar;
