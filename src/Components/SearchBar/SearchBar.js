import React, { useEffect, useState } from "react";
import "./SearchBar.scss";
import { MultiSelect } from "primereact/multiselect";
import { useFetchGet } from "../../Services/api";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const SearchBar = (props) => {
  const usersData = useFetchGet("/users");
  // const ingredientsData = useFetchGet("/ingredients");

  const [regime, setRegime] = useState(null);
  const [type, setType] = useState(null);
  const [user, setUser] = useState(null);
  // const [ingredient, setIngredient] = useState(null);

  useEffect(() => {
    let tempRecipes = props.startData;
    if (user && user?.length !== 0) {
      tempRecipes = tempRecipes.filter((recipe) =>
        user.some((user) => user.id === recipe.postedByUser.id)
      );
    }
    if (regime && regime?.length !== 0) {
      tempRecipes = tempRecipes.filter((recipe) =>
        regime.some((reg) => reg.id === recipe.regime.id)
      );
    }
    if (type && type?.length !== 0) {
      tempRecipes = tempRecipes.filter((recipe) =>
        type.some((typ) => typ.id === recipe.type.id)
      );
    }

    if (
      (!user || user?.length === 0) &&
      (!regime || regime?.length === 0) &&
      (!type || type?.length === 0)
    ) {
      props.setFilteredRecipes(props.startData);
    } else {
      props.setFilteredRecipes(tempRecipes);
    }
    // eslint-disable-next-line
  }, [user, regime, type]);

  return (
    <div className="searchbar_container">
      <MultiSelect
        showClear
        value={user}
        onChange={(e) => {
          setUser(e.value);
        }}
        options={usersData.data}
        optionLabel="name"
        filter
        placeholder="Créée par"
        maxSelectedLabels={2}
        selectedItemsLabel={user?.length + " éléments choisis"}
      ></MultiSelect>
      <MultiSelect
        showClear
        value={regime}
        onChange={(e) => {
          setRegime(e.value);
        }}
        options={props.secondaryTables.regimes}
        optionLabel="label"
        placeholder="Régime alimentaire"
        maxSelectedLabels={2}
        selectedItemsLabel={regime?.length + " éléments choisis"}
      ></MultiSelect>
      <MultiSelect
        showClear
        value={type}
        onChange={(e) => {
          setType(e.value);
        }}
        options={props.secondaryTables.types}
        optionLabel="label"
        placeholder="Type de plat"
        maxSelectedLabels={2}
        selectedItemsLabel={type?.length + " éléments choisis"}
      ></MultiSelect>
      {/* <MultiSelect
        showClear
        value={ingredient}
        onChange={(e) => {
          setIngredient(e.value);
        }}
        options={ingredientsData.data}
        optionLabel="label"
        filter
        placeholder="Ingrédient"
        maxSelectedLabels={2}
        selectedItemsLabel={ingredient?.length + " éléments choisis"}
      ></MultiSelect> */}
    </div>
  );
};

SearchBar.propTypes = {
  filteredRecipes: PropTypes.array,
  setFilteredRecipes: PropTypes.func,
  startData: PropTypes.array,
  secondaryTables: PropTypes.object,
};

const mapStateToProps = (state) => ({
  secondaryTables: state.secondaryTables,
});

export default connect(mapStateToProps)(SearchBar);
