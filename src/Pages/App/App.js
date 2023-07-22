import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "../Accueil/Accueil";
import AllRecipes from "../AllRecipes/AllRecipes";
import Favorites from "../Favorites/Favorites";
import ShoppingList from "../ShoppingList/ShoppingList";
import Parameters from "../Parameters/Parameters";
import MyRecipes from "../MyRecipes/MyRecipes";
import CreateRecipe from "../CreateRecipe/CreateRecipe";
import { connect } from "react-redux";
import { updateAuth } from "../../Store/Actions/authActions";
import axios from "axios";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

const App = (props) => {
  const toast = useRef(null);
  const interval = useRef(0);
  const timer = 60 * 1000; // 1 minute
  useEffect(() => {
    if (props.auth.isConnected) {
      interval.current = setInterval(() => {
        checkToken();
      }, timer); // Commence toutes les minutes l'écoute si connecté
    } else {
      clearInterval(interval.current);
      interval.current = 0; // Stoppe l'écoute si déco
    }
    return () => {
      clearInterval(interval.current);
      interval.current = 0;
    }; // Stoppe l'écoute si quitte la page

    // eslint-disable-next-line
  }, [props.auth.isConnected, props.auth.token]);

  const checkToken = () => {
    const decodedPayload = atob(props.auth.token.split(".")[1]);
    const payloadObject = JSON.parse(decodedPayload);
    if (payloadObject.exp * 1000 - new Date().getTime() < 0) {
      // Si le token expire on logout
      logOut();
    } else if (payloadObject.exp * 1000 - new Date().getTime() < 5 * timer) {
      // Si le token expire dans moins de 5 minutes on le refresh
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL_API}/api/users/loginCheck`,
          { email: props.auth.userConnected.email },
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${props.auth.token}`,
            },
          }
        )
        .then((token) => {
          props.handleAuth({
            token: token.data,
          });
        });
    }
  };

  const checkActivity = () => {
    if (props.auth.isConnected) {
      // Si la dernière action de l'utilisateur était il y a plus d'une heure on logout
      if (new Date().getTime() - props.auth.newLogTime > 60 * 60 * 1000) {
        logOut();
      } else {
        // Sinon on met à jour l'heure de sa dernière action
        props.handleAuth({
          newLogTime: new Date().getTime(),
        });
      }
    } else if (props.auth.newLogTime) {
      props.handleAuth({
        newLogTime: null,
      });
    }
  };

  // Fonction de logout
  const logOut = () => {
    window.location.href = "/";
    props.handleAuth({
      isConnected: false,
      newLogTime: null,
      token: null,
      userConnected: {},
    });
  };

  // Au (re)chargement de la page on check l'activité du user et l'état de son token s'il est connecté
  useEffect(() => {
    checkActivity();
    if (props.auth.isConnected) {
      checkToken();
    }
    props.handleAuth({
      toast: toast,
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App" id="app" onClick={() => checkActivity()}>
      <BrowserRouter>
        <Toast ref={toast}></Toast>
        <Routes>
          <Route path="/" element={<Accueil />}></Route>
          {props.auth.isConnected && (
            <>
              <Route path="/all" element={<AllRecipes />}></Route>
              <Route path="/fav" element={<Favorites />}></Route>
              <Route path="/shop" element={<ShoppingList />}></Route>
              <Route path="/param" element={<Parameters />}></Route>
              <Route path="/myrecipes" element={<MyRecipes />}></Route>
              <Route path="/create" element={<CreateRecipe />}></Route>
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
  handleAuth: (value) => {
    dispatch(updateAuth(value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
