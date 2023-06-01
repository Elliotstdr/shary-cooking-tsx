import React, { useRef, useState } from "react";
import "./CreateRecipe.scss";
import NavBar from "../../Components/NavBar/NavBar";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import { Toast } from "primereact/toast";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import { useFetchGet } from "../../Services/api";

const CreateRecipe = (props) => {
  const ingredientData = useFetchGet("/ingredient_datas");
  const [activeIndex, setActiveIndex] = useState(-1);
  // const [visibleAutocomplete, setVisibleAutocomplete] = useState(false);
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const cancelToast = useRef(null);
  const uploadToast = useRef(null);
  const [typeId, setTypeId] = useState(props.secondaryTables.types[0]?.id);
  const [regimeId, setRegimeId] = useState(
    props.secondaryTables.regimes[0]?.id
  );
  const [stepsList, setStepsList] = useState([
    {
      description: "",
      stepIndex: 1,
    },
  ]);
  const [ingredientList, setIngredientList] = useState([
    {
      unit: null,
      quantity: 0,
      label: "",
      index: 1,
    },
  ]);
  const [errorStepMessage, setErrorStepMessage] = useState(null);
  const [errorIngredientMessage, setErrorIngredientMessage] = useState(null);

  let defaultValues = {
    title: "",
    number: 0,
    time: "",
    image: null,
  };

  const {
    control,
    getValues,
    reset,
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

  const resetForm = () => {
    setTypeId(props.secondaryTables.types[0]?.id);
    setRegimeId(props.secondaryTables.regimes[0]?.id);
    setStepsList([
      {
        description: "",
        stepIndex: 1,
      },
    ]);
    setIngredientList([
      {
        unit: null,
        quantity: 0,
        label: "",
        index: 1,
      },
    ]);
    uploadToast.current.show({
      severity: "success",
      summary: "Succès : ",
      detail: "Votre recette a bien été créée",
      life: 3000,
    });
  };

  const postImage = (res) => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL_API}/api/recipes/postImage/${res.data.id}`,
        { file: image, fileName: imageName }
      )
      .then(() => {
        reset();
        resetForm();
        setImage(null);
        setImageName("");
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
    return data;
  };

  const onSubmit = () => {
    const data = setFields();

    if (checkStepsIngredients()) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL_API}/api/recipes`, data, {
          headers: {
            accept: "application/json",
          },
        })
        .then((res) => {
          if (image) {
            postImage(res);
          } else {
            resetForm();
            reset();
          }
        })
        .catch(() =>
          cancelToast.current.show({
            severity: "error",
            summary: "Suppression : ",
            detail:
              "Une erreur est survenue lors de la création de votre recette",
            life: 3000,
          })
        );
    }
  };

  const modifyIngredientList = (word, ingredient) => {
    let tempArray = [...ingredientList];
    tempArray.forEach((element) => {
      if (element.index === ingredient.index) {
        element.label = word;
      }
    });
    setIngredientList(tempArray);
  };

  const findIngredient = (word) => {
    const filteredData = ingredientData.data.filter((element) =>
      element.name.toLowerCase().includes(word.toLowerCase())
    );
    setAutocompleteData(filteredData);
  };

  return (
    <div
      onClick={() => {
        setAutocompleteData([]);
        setActiveIndex(-1);
      }}
    >
      <NavBar></NavBar>
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
                {step.stepIndex !== 1 && (
                  <RiDeleteBin6Line
                    className="bin"
                    onClick={(e) => {
                      e.preventDefault();
                      let tempArray = [...stepsList];
                      tempArray = tempArray.filter(
                        (element) => element.stepIndex !== step.stepIndex
                      );
                      setStepsList(tempArray);
                    }}
                  ></RiDeleteBin6Line>
                )}
              </div>
            ))}
            {errorStepMessage && (
              <small className="p-error">{errorStepMessage}</small>
            )}
          </div>
          <button
            className="btn-blanc"
            onClick={(e) => {
              e.preventDefault();
              setStepsList([
                ...stepsList,
                {
                  description: "",
                  stepIndex: stepsList[stepsList.length - 1].stepIndex + 1,
                },
              ]);
            }}
          >
            <AiOutlinePlusCircle />
            Ajouter une étape
          </button>
        </div>
        <Divider></Divider>
        <div className="recipe__form__field">
          <h4 htmlFor="type">Ingrédients</h4>
          <div className="ingredients">
            {ingredientList.map((ingredient, index) => (
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
                      setActiveIndex(index);
                    }}
                  />
                  <div
                    className={`ingredient_name_autocomplete ${
                      autocompleteData.length > 0 && activeIndex === index
                        ? "visible"
                        : "hidden"
                    }`}
                  >
                    {autocompleteData
                      .slice(0, 10)
                      .sort((a, b) => a.name.length - b.name.length)
                      .map((element, index) => (
                        <span
                          key={index}
                          onClick={(e) => {
                            modifyIngredientList(
                              e.target.textContent,
                              ingredient
                            );
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
                    let tempArray = [...ingredientList];
                    tempArray.forEach((element) => {
                      if (element.index === ingredient.index) {
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
                      if (element.index === ingredient.index) {
                        element.quantity = e.target.value;
                      }
                    });
                    setIngredientList(tempArray);
                  }}
                />
                {ingredient.index !== 1 && (
                  <RiDeleteBin6Line
                    className="bin"
                    onClick={(e) => {
                      e.preventDefault();
                      let tempArray = [...ingredientList];
                      tempArray = tempArray.filter(
                        (element) => element.index !== ingredient.index
                      );
                      setIngredientList(tempArray);
                    }}
                  ></RiDeleteBin6Line>
                )}
              </div>
            ))}
            {errorIngredientMessage && (
              <small className="p-error">{errorIngredientMessage}</small>
            )}
          </div>
          <button
            className="btn-blanc"
            onClick={(e) => {
              e.preventDefault();
              setIngredientList([
                ...ingredientList,
                {
                  unit: null,
                  label: "",
                  quantity: 0,
                  index: ingredientList[ingredientList.length - 1].index + 1,
                },
              ]);
            }}
          >
            <AiOutlinePlusCircle />
            Ajouter une étape
          </button>
        </div>
        <button className="btn-bleu">{"Créer ma recette"}</button>
      </form>
    </div>
  );
};

CreateRecipe.propTypes = {
  secondaryTables: PropTypes.object,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  secondaryTables: state.secondaryTables,
  auth: state.auth,
});
export default connect(mapStateToProps)(CreateRecipe);
