import React, { useRef, useState, useMemo, useEffect } from "react";
import "./CreateRecipe.scss";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import { Toast } from "primereact/toast";
import ImageUpload from "../../Components/ImageUpload/ImageUpload";
import { errorToast, successToast, useFetchGet } from "../../Services/api";
import IngredientsCreation from "../../Components/FormElements/IngredientsCreation/IngredientsCreation";
import StepsCreation from "../../Components/FormElements/StepsCreation/StepsCreation";
import { RadioButton } from "primereact/radiobutton";
import Bouton from "../../Utils/Bouton/Bouton";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Loader from "../../Utils/Loader/loader";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const CreateRecipe = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const ingredientData = useFetchGet("/ingredient_datas");
  const [isCreating, setIsCreating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const cancelToast = useRef(null);
  const uploadToast = useRef(null);
  const ref = useRef(null);
  const [typeId, setTypeId] = useState(
    props.recipe ? props.recipe.type.id : props.secondaryTables.types[0]?.id
  );
  const [regimeId, setRegimeId] = useState(
    props.recipe ? props.recipe.regime.id : props.secondaryTables.regimes[0]?.id
  );
  const [stepsList, setStepsList] = useState(
    props.recipe
      ? props.recipe.steps
          .sort((a, b) => a.stepIndex - b.stepIndex)
          .map((step) => {
            return {
              description: step.description,
              stepIndex: step.stepIndex,
            };
          })
      : [
          {
            description: "",
            stepIndex: 1,
          },
        ]
  );
  const [ingredientList, setIngredientList] = useState(
    props.recipe
      ? props.recipe.ingredients.map((ingredient, index) => {
          ingredient.id = index + 1;
          return ingredient;
        })
      : [
          {
            unit: null,
            quantity: "",
            label: "",
            id: 1,
          },
        ]
  );
  const regimeTooltips = [
    "Contient tout type de nourriture",
    "Régime sans viande ni poisson mais avec des produits d'origine animale",
    "Régime végétarien à l'exception des produits de la mer",
    "Régime sans viande, poisson ou produits d'origine animale",
  ];

  let defaultValues = props.recipe
    ? {
        title: props.recipe.title,
        number: props.recipe.number,
        time: props.recipe.time,
      }
    : {
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

  const checkSteps = () => {
    let response = true;
    stepsList.forEach((step) => {
      if (step.description === "") {
        response = "Une ou plusieurs étape n'est pas correctement remplie";
      }
    });
    return response;
  };

  const checkIngredients = () => {
    let response = true;
    ingredientList.forEach((ing) => {
      if (
        ing.label === "" ||
        ing.quantity === 0 ||
        ing.quantity === "" ||
        !ing.unit
      ) {
        response = "Un ou plusieurs ingrédient n'est pas correctement rempli";
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
        quantity: "",
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
        { file: image, fileName: imageName },
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${props.auth.token}`,
          },
        }
      )
      .then(() => {
        if (props.recipe) {
          window.location.reload(false);
        } else {
          reset();
          resetForm();
          setImage(null);
          setImageName("");
          setIsCreating(false);
        }
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
    data.createdAt = new Date();
    data.number = Number(data.number);
    data.type = `/api/types/${typeId}`;
    data.regime = `/api/regimes/${regimeId}`;
    data.postedByUser = `/api/users/${props.auth.userConnected.id}`;
    data.steps = stepsList;
    data.ingredients = ingredientList;
    data.ingredients.forEach((ingredient) => {
      ingredient.quantity = Number(ingredient.quantity);
      delete ingredient.id;
    });
    if (props.recipe) {
      data.id = props.recipe.id;
    }
    return data;
  };

  const onSubmit = () => {
    setIsCreating(true);
    window.scroll({
      top: ref.current?.offsetTop,
      behavior: "smooth",
    });

    if (props.recipe) {
      putRecipeFunction();
    } else {
      createRecipeFunction();
    }
  };

  const createRecipeFunction = () => {
    const data = setFields();
    axios
      .post(`${process.env.REACT_APP_BASE_URL_API}/api/recipes`, data, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${props.auth.token}`,
        },
      })
      .then((res) => {
        if (image) {
          postImage(res);
        } else {
          resetForm();
          reset();
          setIsCreating(false);
        }
      })
      .catch(() =>
        errorToast(
          "Une erreur est survenue lors de la création de votre recette",
          cancelToast
        )
      );
  };

  const putRecipeFunction = () => {
    const data = setFields();

    axios
      .put(
        `${process.env.REACT_APP_BASE_URL_API}/api/recipes/${props.recipe.id}`,
        data,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${props.auth.token}`,
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
  };

  const itemIds = useMemo(
    () => ingredientList.map((item) => item.id),
    [ingredientList]
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setIngredientList((ingredientList) => {
        const oldIndex = ingredientList.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = ingredientList.findIndex(
          (item) => item.id === over.id
        );

        return arrayMove(ingredientList, oldIndex, newIndex);
      });
    }
  };

  return (
    <div
      className={props.recipe && "modify_recipe"}
      onClick={() => {
        setAutocompleteData([]);
        setActiveIndex(-1);
      }}
      ref={ref}
    >
      {!props.recipe && <NavBar></NavBar>}
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
                  keyfilter="num"
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
                  type="time"
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
                <RadioButton
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
                <RadioButton
                  checked={regime.id === regimeId}
                  onChange={() => setRegimeId(regime.id)}
                  tooltip={regimeTooltips[index]}
                  tooltipOptions={{ position: "bottom" }}
                />
                <label>{regime.label}</label>
              </div>
            ))}
          </div>
        </div>
        <Divider></Divider>
        <div className="recipe__form__field">
          <h4 htmlFor="ingredients">Ingrédients</h4>
          <Controller
            name="ingredients"
            control={control}
            rules={{
              validate: () => checkIngredients(),
            }}
            render={({ field }) => (
              <>
                <div className="ingredients">
                  <IngredientsCreation
                    key={ingredientList[0].id}
                    id={ingredientList[0].id}
                    ingredient={ingredientList[0]}
                    ingredientList={ingredientList}
                    setIngredientList={setIngredientList}
                    ingredientData={ingredientData.data}
                    autocompleteData={autocompleteData}
                    setAutocompleteData={setAutocompleteData}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  ></IngredientsCreation>
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={itemIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {ingredientList.map(
                        (ingredient) =>
                          ingredient.id !== 1 && (
                            <IngredientsCreation
                              key={ingredient.id}
                              id={ingredient.id}
                              ingredient={ingredient}
                              ingredientList={ingredientList}
                              setIngredientList={setIngredientList}
                              ingredientData={ingredientData.data}
                              autocompleteData={autocompleteData}
                              setAutocompleteData={setAutocompleteData}
                              activeIndex={activeIndex}
                              setActiveIndex={setActiveIndex}
                            ></IngredientsCreation>
                          )
                      )}
                    </SortableContext>
                  </DndContext>
                </div>
                <Bouton
                  type={"normal"}
                  btnAction={(e) => {
                    e.preventDefault();
                    setIngredientList([
                      ...ingredientList,
                      {
                        unit: null,
                        label: "",
                        quantity: "",
                        id: ingredientList[ingredientList.length - 1].id + 1,
                      },
                    ]);
                  }}
                >
                  <AiOutlinePlusCircle />
                  Ajouter un ingrédient
                </Bouton>
              </>
            )}
          />
          {getFormErrorMessage("ingredients")}
        </div>
        <Divider></Divider>
        <div className="recipe__form__field">
          <h4 htmlFor="steps">Etapes</h4>
          <Controller
            name="steps"
            control={control}
            rules={{
              validate: () => checkSteps(),
            }}
            render={({ field }) => (
              <StepsCreation
                stepsList={stepsList}
                setStepsList={setStepsList}
              ></StepsCreation>
            )}
          />
          {getFormErrorMessage("steps")}
        </div>
        <Divider></Divider>
        {isCreating ? (
          <Loader></Loader>
        ) : (
          <button className="bouton slide">
            {props.recipe ? "Modifier ma recette" : "Créer ma recette"}
          </button>
        )}
      </form>
      {!props.recipe && <Footer></Footer>}
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
