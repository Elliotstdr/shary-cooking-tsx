import React from "react";
import "./IngredientsCreation.scss";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Bouton from "../../../Utils/Bouton/Bouton";

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
      element.name.toLowerCase().includes(word.toLowerCase())
    );
    props.setAutocompleteData(filteredData);
  };
  return (
    <>
      <div className="ingredients">
        {props.ingredientList.map((ingredient, index) => (
          <div className="ingredient" key={index}>
            <div className="ingredient_name">
              <InputText
                placeholder="Tomates, Boeuf, Pommes..."
                className="recipe__form__field-ingredient"
                value={ingredient.label}
                onChange={(e) => {
                  modifyIngredientList(e.target.value, ingredient);
                  if (e.target.value.length > 2) {
                    findIngredient(e.target.value);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.setActiveIndex(index);
                }}
              />
              <div
                className={`ingredient_name_autocomplete ${
                  props.autocompleteData.length > 0 &&
                  props.activeIndex === index
                    ? "visible"
                    : "hidden"
                }`}
              >
                {props.autocompleteData
                  .slice(0, 10)
                  .sort((a, b) => a.name.length - b.name.length)
                  .map((element, index) => (
                    <span
                      key={index}
                      onClick={(e) => {
                        modifyIngredientList(e.target.textContent, ingredient);
                      }}
                    >
                      {element.name}
                    </span>
                  ))}
              </div>
            </div>
            <Dropdown
              value={ingredient.unit}
              options={props.secondaryTables.units}
              optionLabel="label"
              placeholder="kg, unité..."
              className="recipe__form__field-ingredient"
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
            <InputText
              placeholder="3, 2.5..."
              className="recipe__form__field-ingredient"
              value={ingredient.quantity}
              type="number"
              step={0.5}
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
          btnAction={(e) => {
            e.preventDefault();
            props.setIngredientList([
              ...props.ingredientList,
              {
                unit: null,
                label: "",
                quantity: 0,
                id:
                  props.ingredientList[props.ingredientList.length - 1].id + 1,
              },
            ]);
          }}
        >
          <AiOutlinePlusCircle />
          Ajouter une étape
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
