import React from "react";
import "./IngredientsCreation.scss";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BiMoveVertical } from "react-icons/bi";
import { AiOutlineStop } from "react-icons/ai";

interface Props {
  id: number,
  ingredientList: Array<FormIngredient>,
  setIngredientList: React.Dispatch<React.SetStateAction<Array<FormIngredient>>>,
  autocompleteData: Array<IngredientData>,
  setAutocompleteData: React.Dispatch<React.SetStateAction<Array<IngredientData>>>,
  activeIndex: number,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
  ingredientData: Array<IngredientData>,
  ingredient: FormIngredient
}

type FormIngredient = {
  id?: number,
  label: string,
  quantity: number | undefined,
  unit: Unit | null
}

const IngredientsCreation = (props: Props) => {
  const secondaryTables = useSelector((state: RootState) => state.secondaryTables);

  const modifyIngredientList = (word: string, ingredient: FormIngredient) => {
    let tempArray = [...props.ingredientList];
    tempArray.forEach((element) => {
      if (element.id === ingredient.id) {
        element.label = word;
      }
    });
    props.setIngredientList(tempArray);
  };
  const findIngredient = (word: AutoCompleteCompleteEvent) => {
    const filteredData = props.ingredientData
      .filter((element) =>
        element.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            word.query
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      )
      .sort((a, b) => {
        if (a.frequency && b.frequency) {
          return b.frequency - a.frequency
        }
        return 0
      });
    props.setAutocompleteData(filteredData);
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div className="ingredient" ref={setNodeRef} style={style} {...attributes}>
      {props.id === 1 ? (
        <AiOutlineStop className="move_ing"></AiOutlineStop>
      ) : (
        <BiMoveVertical className="move_ing" {...listeners}></BiMoveVertical>
      )}
      <div className="ingredient_name" id="ingredient_name">
        <AutoComplete
          className="recipe__form__field-ingname"
          value={props.ingredient.label}
          suggestions={props.autocompleteData}
          completeMethod={findIngredient}
          field="name"
          placeholder="Tomates, Boeuf, ..."
          onChange={(e) =>
            modifyIngredientList(e.target.value, props.ingredient)
          }
          onClick={() => props.setActiveIndex(props.id)}
          onSelect={(e) => modifyIngredientList(e.value.name, props.ingredient)}
          tooltip={
            props.id === 1
              ? "Privilégiez la sélection des ingrédients proposés pour une meilleure performance du site"
              : undefined
          }
          tooltipOptions={{ position: "top" }}
        ></AutoComplete>
      </div>
      <InputText
        placeholder="3, 2.5..."
        className="recipe__form__field-quantity"
        value={props.ingredient.quantity?.toString()}
        keyfilter="num"
        onChange={(e) => {
          let tempArray = [...props.ingredientList];
          tempArray.forEach((element) => {
            if (element.id === props.id) {
              element.quantity = Number(e.target.value);
            }
          });
          props.setIngredientList(tempArray);
        }}
        tooltip={
          props.id === 1
            ? "Pour les décimaux utilisez le point et non la virgule"
            : undefined
        }
        tooltipOptions={{ position: "top" }}
      />
      <Dropdown
        value={props.ingredient.unit}
        options={secondaryTables.units ?? []}
        optionLabel="label"
        placeholder="kg, unité..."
        className="recipe__form__field-unit"
        onChange={(e) => {
          let tempArray = [...props.ingredientList];
          tempArray.forEach((element) => {
            if (element.id === props.id) {
              element.unit = e.target.value;
            }
          });
          props.setIngredientList(tempArray);
        }}
      ></Dropdown>
      {props.id !== 1 && (
        <RiDeleteBin6Line
          className="bin"
          onClick={(e) => {
            e.preventDefault();
            let tempArray = [...props.ingredientList];
            tempArray = tempArray.filter((element) => element.id !== props.id);
            props.setIngredientList(tempArray);
          }}
        ></RiDeleteBin6Line>
      )}
    </div>
  );
};

export default IngredientsCreation;
