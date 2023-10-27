import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "../Accueil/Accueil";
import ShoppingList from "../ShoppingList/ShoppingList";
import Parameters from "../Parameters/Parameters";
import CreateRecipe from "../CreateRecipe/CreateRecipe";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { UPDATE_AUTH } from "../../Store/Reducers/authReducer";
import Recipes from "../Recipes/Recipes";

const App = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const toast = useRef(null);
  const interval = useRef<any>(0);
  const timer = 60 * 1000; // 1 minute
  useEffect(() => {
    if (auth.isConnected) {
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
  }, [auth.isConnected, auth.token]);

  const checkToken = () => {
    if (!auth.token) {
      logOut();
      return;
    }
    const decodedPayload = atob(auth.token.split(".")[1]);
    const payloadObject = JSON.parse(decodedPayload);
    if (payloadObject.exp * 1000 - new Date().getTime() < 0) {
      // Si le token expire on logout
      logOut();
    } else if (payloadObject.exp * 1000 - new Date().getTime() < 5 * timer) {
      // Si le token expire dans moins de 5 minutes on le refresh
      axios
        .post(
          `${process.env.REACT_APP_BASE_URL_API}/api/users/loginCheck`,
          { email: auth.userConnected?.email },
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        .then((token) => {
          updateAuth({
            token: token.data,
          });
        });
    }
  };

  const checkActivity = () => {
    if (auth.isConnected) {
      // Si la dernière action de l'utilisateur était il y a plus d'une heure on logout
      if (auth.newLogTime && new Date().getTime() - auth.newLogTime > 60 * 60 * 1000) {
        logOut();
      } else {
        // Sinon on met à jour l'heure de sa dernière action
        updateAuth({
          newLogTime: new Date().getTime(),
        });
      }
    } else if (auth.newLogTime) {
      updateAuth({
        newLogTime: null,
      });
    }
  };

  // Fonction de logout
  const logOut = () => {
    window.location.href = "/";
    updateAuth({
      isConnected: false,
      newLogTime: null,
      token: null,
      userConnected: null,
    });
  };

  // Au (re)chargement de la page on check l'activité du user et l'état de son token s'il est connecté
  useEffect(() => {
    checkActivity();
    if (auth.isConnected) {
      checkToken();
    }
    updateAuth({
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
          {auth.isConnected && (
            <>
              <Route path="/all" element={<Recipes />}></Route>
              <Route path="/fav" element={<Recipes favourite />}></Route>
              <Route path="/myrecipes" element={<Recipes mine />}></Route>
              <Route path="/shop" element={<ShoppingList />}></Route>
              <Route path="/param" element={<Parameters />}></Route>
              <Route path="/create" element={<CreateRecipe />}></Route>
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
