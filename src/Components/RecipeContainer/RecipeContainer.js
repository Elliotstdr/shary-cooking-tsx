import React, { useEffect, useRef, useState } from "react";
import RecipeCard from "./RecipeCard/RecipeCard";
import "./RecipeContainer.scss";
import SearchBar from "../SearchBar/SearchBar";
import { useFetchGet } from "../../Services/api";
import { Paginator } from "primereact/paginator";
import Loader from "../../Utils/Loader/loader";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";

const RecipeContainer = (props) => {
  const auth = useSelector((state) => state.auth);
  const recipe = useSelector((state) => state.recipe);
  const rows = 12;
  const [first, setFirst] = useState(0);
  const ref = useRef(null);
  const recipesData = useFetchGet(props.dataToCall);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [boxFavorites, setBoxFavorites] = useState(false);
  const [boxMine, setBoxMine] = useState(false);
  const [startData, setStartData] = useState([]);

  useEffect(() => {
    if (recipesData.loaded) {
      setFilteredRecipes(recipesData.data);
      setStartData(recipesData.data);
    }
  }, [recipesData.loaded, recipesData.data]);

  useEffect(() => {
    if (recipesData.loaded && recipesData.data) {
      let tempArray = [...recipesData.data];
      if (boxFavorites) {
        tempArray = tempArray.filter((recipe) =>
          recipe.savedByUsers.some(
            (element) => element.id === auth.userConnected.id
          )
        );
      }
      if (boxMine) {
        tempArray = tempArray.filter(
          (recipe) => recipe.postedByUser.id === auth.userConnected.id
        );
      }
      setStartData(tempArray);
    }
    // eslint-disable-next-line
  }, [boxFavorites, boxMine]);

  const updateFavouriteList = (recipeId) => {
    setFilteredRecipes(
      filteredRecipes.filter((recipe) => recipe.id !== recipeId)
    );
  };

  return (
    <div className="recipeContainer" ref={ref}>
      {props.checkboxes && (
        <div className="shopping_list_checkboxes">
          <Checkbox
            onChange={(e) => setBoxFavorites(e.checked)}
            checked={boxFavorites}
          ></Checkbox>
          <span>Favoris</span>
          <Checkbox
            onChange={(e) => setBoxMine(e.checked)}
            checked={boxMine}
          ></Checkbox>
          <span>Mes recettes</span>
        </div>
      )}
      <div className="recipeContainer_searchbar">
        <SearchBar
          startData={startData}
          setFilteredRecipes={setFilteredRecipes}
        ></SearchBar>
        <Accordion
          activeIndex=""
          expandIcon="pi pi-sliders-h"
          collapseIcon="pi pi-sliders-h"
        >
          <AccordionTab header="Filtrer">
            <SearchBar
              startData={startData}
              setFilteredRecipes={setFilteredRecipes}
            ></SearchBar>
          </AccordionTab>
        </Accordion>
      </div>
      <div className="recipeContainer_cards">
        {recipesData.loaded ? (
          filteredRecipes.length > 0 ? (
            filteredRecipes
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(first, first + rows)
              .map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipeItem={recipe}
                  updateFavouriteList={(x) => updateFavouriteList(x)}
                ></RecipeCard>
              ))
          ) : (
            <span className="noCard">
              {recipe.favourite
                ? "Vous n'avez pas encore sélectionné vos recettes préférées !"
                : "Je n'ai aucune recette à vous afficher malheureusement ..."}
            </span>
          )
        ) : (
          <div className="recipeContainer_loader">
            <Loader></Loader>
          </div>
        )}
      </div>
      {filteredRecipes && (
        <Paginator
          first={first}
          totalRecords={filteredRecipes.length}
          rows={rows}
          onPageChange={(e) => {
            window.scroll({
              top: ref.current?.offsetTop,
              behavior: "smooth",
            });
            setFirst(e.first);
          }}
        ></Paginator>
      )}
    </div>
  );
};

RecipeContainer.propType = {
  dataToCall: PropTypes.string,
};

export default RecipeContainer;
