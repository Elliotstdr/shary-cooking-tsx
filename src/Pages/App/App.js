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
import { useEffect } from "react";
import axios from "axios";

function App(props) {
  useEffect(() => {
    updateStorage();
    // eslint-disable-next-line
  }, []);

  const updateStorage = () => {
    const hour = 3600 * 1000;
    const now = new Date().getTime();
    if (props.auth.isConnected) {
      if (
        now - props.auth.newLogTime > hour ||
        now - props.auth.logTime > 2 * hour
      ) {
        window.location.href = "/";
        props.handleAuth({
          isConnected: false,
          logTime: null,
          newLogTime: null,
          token: null,
          userConnected: {},
        });
      } else {
        if (now - props.auth.logTime > hour) {
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
                logTime: now,
                token: token.data,
              });
            });
        }
        props.handleAuth({
          newLogTime: now,
        });
      }
    } else {
      props.handleAuth({
        logTime: null,
        newLogTime: null,
      });
    }
  };

  return (
    <div className="App" id="app" onClick={() => updateStorage()}>
      <BrowserRouter>
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
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
  handleAuth: (value) => {
    dispatch(updateAuth(value));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
