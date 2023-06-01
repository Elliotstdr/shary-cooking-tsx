import React, { useRef, useState } from "react";
import "./ModifyRecipe.scss";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import ImageUpload from "../../../Components/ImageUpload/ImageUpload";
import { Toast } from "primereact/toast";

const ModifyRecipe = (props) => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const cancelToast = useRef(null);
  const uploadToast = useRef(null);
  const [typeId, setTypeId] = useState(props.recipe.type.id);
  const [regimeId, setRegimeId] = useState(props.recipe.regime.id);
  const [stepsList, setStepsList] = useState(props.recipe.steps);
  const [ingredientList, setIngredientList] = useState(
    props.recipe.ingredients
  );
  const [errorStepMessage, setErrorStepMessage] = useState(null);
  const [errorIngredientMessage, setErrorIngredientMessage] = useState(null);

  let defaultValues = {
    title: props.recipe.title,
    number: props.recipe.number,
    time: props.recipe.time,
  };

  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const checkStepsIngredients = () => {
    let response = true;
    setErrorStepMessage(null);
    setErrorIngredientMessage(null);

    stepsList.forEach((step) => {
      if (step.description === "") {
        setErrorStepMessage(
          "Une ou plusieurs étape n'est pas correctement remplie"
        );
        response = false;
      }
    });
    ingredientList.forEach((ingredient) => {
      if (
        ingredient.label === "" ||
        ingredient.quantity === 0 ||
        !ingredient.unit
      ) {
        setErrorIngredientMessage(
          "Un ou plusieurs ingrédient n'est pas correctement rempli"
        );
        response = false;
      }
    });
    return response;
  };

  const postImage = (res) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL_API}/api/recipes/postImage/${res.data.id}`,
        { file: image, fileName: imageName }
      )
      .then(() => {
        window.location.reload(false);
      })
      .catch(() =>
        cancelToast.current.show({
          severity: "error",
          summary: "Suppression : ",
          detail: "Une erreur est survenue lors de l'upload de l'image",
          life: 3000,
        })
      );
  };

  const setFields = () => {
    let data = getValues();
    data.number = Number(data.number);
    data.type = `/api/types/${typeId}`;
    data.regime = `/api/regimes/${regimeId}`;
    data.postedByUser = `/api/users/${props.auth.userConnected.id}`;
    data.steps = stepsList;
    data.ingredients = ingredientList;
    data.id = props.recipe.id;

    data.ingredients.forEach(
      (ingredient) => (ingredient.quantity = Number(ingredient.quantity))
    );
    return data;
  };

  const onSubmit = () => {
    const data = setFields();

    if (checkStepsIngredients()) {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL_API}/api/recipes/${props.recipe.id}`,
          data,
          {
            headers: {
              accept: "application/json",
            },
          }
        )
        .then((res) => {
          if (image) {
            postImage(res);
          } else {
            window.location.reload(false);
          }
        });
    }
  };

  return (
    <div className="modify_recipe">
      <form className="recipe__form" onSubmit={handleSubmit(onSubmit)}>
        <Toast ref={uploadToast} />
        <Toast ref={cancelToast} />
        <div className="recipe__form__field">
          <h4 htmlFor="image">Photo :</h4>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                uploadToast={uploadToast}
                cancelToast={cancelToast}
                setImage={setImage}
                setImageName={setImageName}
              ></ImageUpload>
            )}
          />
          {getFormErrorMessage("image")}
        </div>
        <div className="recipe__form__group">
          <div className="recipe__form__field">
            <h4 htmlFor="title">Titre de la recette</h4>
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Le titre est obligatoire",
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Ma super recette"
                  className="recipe__form__field-title"
                />
              )}
            />
            {getFormErrorMessage("title")}
          </div>
          <div className="recipe__form__field">
            <h4 htmlFor="number">Pour combien de personnes ?</h4>
            <Controller
              name="number"
              control={control}
              rules={{
                required: "Le nombre est obligatoire",
                validate: (value) =>
                  value !== 0 && value !== "0"
                    ? true
                    : "La quantité ne peut pas être nulle",
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="3 personnes"
                  className="recipe__form__field-number"
                  type="number"
                />
              )}
            />
            {getFormErrorMessage("number")}
          </div>
          <div className="recipe__form__field">
            <h4 htmlFor="time">Temps de préparation</h4>
            <Controller
              name="time"
              control={control}
              rules={{
                required: "Le temps est obligatoire",
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="30 minutes"
                  className="recipe__form__field-time"
                />
              )}
            />
            {getFormErrorMessage("time")}
          </div>
        </div>
        <div className="recipe__form__field">
          <h4 htmlFor="type">Type de plat</h4>
          <div className="checkboxes">
            {props.secondaryTables.types.map((type, index) => (
              <div className="checkbox" key={index}>
                <Checkbox
                  checked={type.id === typeId}
                  onChange={() => setTypeId(type.id)}
                />
                <label>{type.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="recipe__form__field">
          <h4 htmlFor="type">Régime alimentaire</h4>
          <div className="checkboxes">
            {props.secondaryTables.regimes.map((regime, index) => (
              <div className="checkbox" key={index}>
                <Checkbox
                  checked={regime.id === regimeId}
                  onChange={() => setRegimeId(regime.id)}
                />
                <label>{regime.label}</label>
              </div>
            ))}
          </div>
        </div>
        <Divider></Divider>
        <div className="recipe__form__field">
          <h4 htmlFor="type">Etapes</h4>
          <div className="steps">
            {stepsList.map((step, index) => (
              <div className="step" key={index}>
                <InputTextarea
                  placeholder="Description de l'étape"
                  className="recipe__form__field-step"
                  value={step.description}
                  onChange={(e) => {
                    let tempArray = [...stepsList];
                    tempArray.forEach((element) => {
                      if (element.stepIndex === step.stepIndex) {
                        element.description = e.target.value;
                      }
                    });
                    setStepsList(tempArray);
                  }}
                />
              </div>
            ))}
            {errorStepMessage && (
              <small className="p-error">{errorStepMessage}</small>
            )}
          </div>
        </div>
        <Divider></Divider>
        <div className="recipe__form__field">
          <h4 htmlFor="type">Ingrédients</h4>
          <div className="ingredients">
            {ingredientList.map((ingredient, index) => (
              <div className="ingredient" key={index}>
                <InputText
                  placeholder="Tomates, Boeuf, Pommes..."
                  className="recipe__form__field-ingredient"
                  value={ingredient.label}
                  onChange={(e) => {
                    let tempArray = [...ingredientList];
                    tempArray.forEach((element) => {
                      if (element.id === ingredient.id) {
                        element.label = e.target.value;
                      }
                    });
                    setIngredientList(tempArray);
                  }}
                />
                <Dropdown
                  value={ingredient.unit}
                  options={props.secondaryTables.units}
                  optionLabel="label"
                  placeholder="kg, unité..."
                  className="recipe__form__field-ingredient"
                  onChange={(e) => {
                    let tempArray = [...ingredientList];
                    tempArray.forEach((element) => {
                      if (element.id === ingredient.id) {
                        element.unit = e.target.value;
                      }
                    });
                    setIngredientList(tempArray);
                  }}
                ></Dropdown>
                <InputText
                  placeholder="3, 2.5..."
                  className="recipe__form__field-ingredient"
                  value={ingredient.quantity}
                  type="number"
                  step={0.5}
                  onChange={(e) => {
                    let tempArray = [...ingredientList];
                    tempArray.forEach((element) => {
                      if (element.id === ingredient.id) {
                        element.quantity = e.target.value;
                      }
                    });
                    setIngredientList(tempArray);
                  }}
                />
              </div>
            ))}
            {errorIngredientMessage && (
              <small className="p-error">{errorIngredientMessage}</small>
            )}
          </div>
        </div>
        <button className="btn-bleu">{"Modifier ma recette"}</button>
      </form>
    </div>
  );
};

ModifyRecipe.propTypes = {
  secondaryTables: PropTypes.object,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  secondaryTables: state.secondaryTables,
  auth: state.auth,
});
export default connect(mapStateToProps)(ModifyRecipe);
