import React from "react";
import "./IngredientsCreation.scss";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Bouton from "../../../Utils/Bouton/Bouton";
import { AutoComplete } from "primereact/autocomplete";

const IngredientsCreation = (props) => {
  const modifyIngredientList = (word, ingredient) => {
    let tempArray = [...props.ingredientList];
    tempArray.forEach((element) => {
      if (element.id === ingredient.id) {
        element.label = word;
      }
    });
    props.setIngredientList(tempArray);
  };
  const findIngredient = (word) => {
    const filteredData = props.ingredientData.filter((element) =>
      element.name.toLowerCase().includes(word.query.toLowerCase())
    );
    props.setAutocompleteData(filteredData);
  };
  return (
    <>
      <div className="ingredients">
        {props.ingredientList.map((ingredient, index) => (
          <div className="ingredient" key={index}>
            <div className="ingredient_name" id="ingredient_name">
              <AutoComplete
                className="recipe__form__field-ingname"
                value={ingredient.label}
                suggestions={props.autocompleteData}
                completeMethod={findIngredient}
                field="name"
                placeholder="Tomates, Boeuf, ..."
                onChange={(e) =>
                  modifyIngredientList(e.target.value, ingredient)
                }
                onClick={() => props.setActiveIndex(index)}
                onSelect={(e) => modifyIngredientList(e.value.name, ingredient)}
                tooltip={
                  index === 0 &&
                  "Privilégiez la sélection des ingrédients proposés pour une meilleure performance du site"
                }
                tooltipOptions={{ position: "top" }}
              ></AutoComplete>
            </div>
            <InputText
              placeholder="3, 2.5..."
              className="recipe__form__field-quantity"
              value={ingredient.quantity}
              keyfilter="num"
              onChange={(e) => {
                let tempArray = [...props.ingredientList];
                tempArray.forEach((element) => {
                  if (element.id === ingredient.id) {
                    element.quantity = e.target.value;
                  }
                });
                props.setIngredientList(tempArray);
              }}
            />
            <Dropdown
              value={ingredient.unit}
              options={props.secondaryTables.units}
              optionLabel="label"
              placeholder="kg, unité..."
              className="recipe__form__field-unit"
              onChange={(e) => {
                let tempArray = [...props.ingredientList];
                tempArray.forEach((element) => {
                  if (element.id === ingredient.id) {
                    element.unit = e.target.value;
                  }
                });
                props.setIngredientList(tempArray);
              }}
            ></Dropdown>
            {ingredient.id !== 1 && !props.nobutton && (
              <RiDeleteBin6Line
                className="bin"
                onClick={(e) => {
                  e.preventDefault();
                  let tempArray = [...props.ingredientList];
                  tempArray = tempArray.filter(
                    (element) => element.id !== ingredient.id
                  );
                  props.setIngredientList(tempArray);
                }}
              ></RiDeleteBin6Line>
            )}
          </div>
        ))}
      </div>
      {!props.nobutton && (
        <Bouton
          type={"normal"}
          btnAction={(e) => {
            e.preventDefault();
            props.setIngredientList([
              ...props.ingredientList,
              {
                unit: null,
                label: "",
                quantity: "",
                id:
                  props.ingredientList[props.ingredientList.length - 1].id + 1,
              },
            ]);
          }}
        >
          <AiOutlinePlusCircle />
          Ajouter un ingrédient
        </Bouton>
      )}
    </>
  );
};

IngredientsCreation.propTypes = {
  secondaryTables: PropTypes.object,
};

const mapStateToProps = (state) => ({
  secondaryTables: state.secondaryTables,
});
export default connect(mapStateToProps)(IngredientsCreation);
