import React, { useEffect, useRef, useState } from "react";
import RecipeCard from "./RecipeCard/RecipeCard";
import "./RecipeContainer.scss";
import SearchBar from "../SearchBar/SearchBar";
import { useFetchGet } from "../../Services/api";
import { Paginator } from "primereact/paginator";
import Loader from "../../Utils/Loader/loader";
import { useSelector } from "react-redux";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import { ClassRecipe } from "../../Types/class";

interface Props {
  checkboxes?: boolean,
  dataToCall: string
}

const RecipeContainer = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const recipe = useSelector((state: RootState) => state.recipe);
  const rows = 12;
  const [first, setFirst] = useState(0);
  const ref = useRef(null);
  const recipesData = useFetchGet<Recipe[]>(props.dataToCall, new ClassRecipe());
  const [filteredRecipes, setFilteredRecipes] = useState<Array<Recipe>>([]);
  const [boxFavorites, setBoxFavorites] = useState(false);
  const [boxMine, setBoxMine] = useState(false);
  const [startData, setStartData] = useState<Recipe[]>([]);

  useEffect(() => {
    if (recipesData.loaded && recipesData.data) {
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
            (element: RestrictedUser) => element.id === auth.userConnected?.id
          )
        );
      }
      if (boxMine) {
        tempArray = tempArray.filter(
          (recipe) => recipe.postedByUser.id === auth.userConnected?.id
        );
      }
      setStartData(tempArray);
    }
    // eslint-disable-next-line
  }, [boxFavorites, boxMine]);

  return (
    <div className="recipeContainer" ref={ref}>
      {props.checkboxes && (
        <div className="shopping_list_checkboxes">
          <Checkbox
            onChange={(e) => setBoxFavorites(e.checked ?? false)}
            checked={boxFavorites}
          ></Checkbox>
          <span>Favoris</span>
          <Checkbox
            onChange={(e) => setBoxMine(e.checked ?? false)}
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
          activeIndex={undefined}
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
              .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
              .slice(first, first + rows)
              .map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipeItem={recipe}
                  filteredRecipes={filteredRecipes}
                  setFilteredRecipes={setFilteredRecipes}
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
              top: (ref.current as any)?.offsetTop,
              behavior: "smooth",
            });
            setFirst(e.first);
          }}
        ></Paginator>
      )}
    </div>
  );
};

export default RecipeContainer;
