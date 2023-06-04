import React, { useEffect, useRef, useState } from "react";
import RecipeCard from "./RecipeCard/RecipeCard";
import "./RecipeContainer.scss";
import SearchBar from "../SearchBar/SearchBar";
import { useFetchGet } from "../../Services/api";
import { Paginator } from "primereact/paginator";
import Loader from "../../Utils/Loader/loader";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Accordion, AccordionTab } from "primereact/accordion";

const RecipeContainer = (props) => {
  const rows = 12;
  const [first, setFirst] = useState(0);
  const ref = useRef(null);
  const recipesData = useFetchGet(props.dataToCall);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    recipesData.loaded && setFilteredRecipes(recipesData.data);
  }, [recipesData.loaded, recipesData.data]);
  return (
    <div className="recipeContainer" ref={ref}>
      <div className="recipeContainer_searchbar">
        <SearchBar
          startData={recipesData.data}
          filteredRecipes={filteredRecipes}
          setFilteredRecipes={setFilteredRecipes}
        ></SearchBar>
        <Accordion
          activeIndex=""
          expandIcon="pi pi-sliders-h"
          collapseIcon="pi pi-sliders-h"
        >
          <AccordionTab header="Filtrer">
            <SearchBar
              startData={recipesData.data}
              filteredRecipes={filteredRecipes}
              setFilteredRecipes={setFilteredRecipes}
            ></SearchBar>
          </AccordionTab>
        </Accordion>
      </div>
      <div className="recipeContainer_cards">
        {filteredRecipes ? (
          filteredRecipes
            .slice(first, first + rows)
            .map((recipe, index) => (
              <RecipeCard key={index} recipeItem={recipe}></RecipeCard>
            ))
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

const mapStateToProps = () => ({});
export default connect(mapStateToProps)(RecipeContainer);
