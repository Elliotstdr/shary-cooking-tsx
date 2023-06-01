import React, { useRef, useState } from "react";
import "./CreateRecipe.scss";
import NavBar from "../../Components/NavBar/NavBar";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import { Toast } from "primereact/toast";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import { errorToast, successToast, useFetchGet } from "../../Services/api";
import IngredientsCreation from "../../Components/FormElements/IngredientsCreation/IngredientsCreation";
import StepsCreation from "../../Components/FormElements/StepsCreation/StepsCreation";

const CreateRecipe = (props) => {
  const ingredientData = useFetchGet("/ingredient_datas");
  const [activeIndex, setActiveIndex] = useState(-1);
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
      id: 1,
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
        id: 1,
      },
    ]);
    successToast("Votre recette a bien été créée", uploadToast);
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
        errorToast(
          "Une erreur est survenue lors de l'upload de l'image",
          cancelToast
        )
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
          errorToast(
            "Une erreur est survenue lors de la création de votre recette",
            cancelToast
          )
        );
    }
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
          <StepsCreation
            stepsList={stepsList}
            setStepsList={setStepsList}
            errorStepMessage={errorStepMessage}
          ></StepsCreation>
        </div>
        <Divider></Divider>
        <div className="recipe__form__field">
          <h4 htmlFor="type">Ingrédients</h4>
          <IngredientsCreation
            ingredientList={ingredientList}
            setIngredientList={setIngredientList}
            ingredientData={ingredientData.data}
            autocompleteData={autocompleteData}
            setAutocompleteData={setAutocompleteData}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            errorIngredientMessage={errorIngredientMessage}
          ></IngredientsCreation>
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
