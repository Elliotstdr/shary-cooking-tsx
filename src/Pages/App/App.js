import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "../Accueil/Accueil";
import Favorites from "../Favorites/Favorites";
import ShoppingList from "../ShoppingList/ShoppingList";
import Parameters from "../Parameters/Parameters";
import MyRecipes from "../MyRecipes/MyRecipes";
import CreateRecipe from "../CreateRecipe/CreateRecipe";
import { connect } from "react-redux";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

function App(props) {
  return (
    <div className="App" id="app">
      <BrowserRouter>
        {props.auth.isConnected && <NavBar></NavBar>}

        <Routes>
          <Route path="/" element={<Accueil />}></Route>
          {props.auth.isConnected && (
            <>
              <Route path="/fav" element={<Favorites />}></Route>
              <Route path="/shop" element={<ShoppingList />}></Route>
              <Route path="/param" element={<Parameters />}></Route>
              <Route path="/myrecipes" element={<MyRecipes />}></Route>
              <Route path="/create" element={<CreateRecipe />}></Route>
            </>
          )}
        </Routes>
        {props.auth.isConnected && <Footer></Footer>}
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(App);
