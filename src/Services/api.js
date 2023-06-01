import axios from "axios";
import { useState, useEffect } from "react";

export const useFetchGet = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, {
        headers: {
          accept: "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, loaded };
};

export const useFetchGetConditional = (url, reduxData) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!reduxData || reduxData.length === 0) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, {
          headers: {
            accept: "application/json",
          },
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    } else {
      setData(reduxData);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, loaded };
};

export const fetchGet = async (url) => {
  const data = await axios
    .get(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, {
      headers: {
        accept: "application/json",
      },
    })
    .then(() => {})
    .catch((error) => console.log(error));
  return data;
};

export const FetchPost = (
  url,
  data,
  thenFunction = null,
  catchFunction = null
) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL_API}/api${url}`, data, {
      headers: {
        accept: "application/json",
      },
    })
    .then((response) => {
      thenFunction && thenFunction(response);
    })
    .catch((error) => catchFunction && catchFunction(error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
};

export const exportRecipe = (chosenRecipes, data) => {
  let ingredientList = [];
  let finalList = [];

  let tempArray = chosenRecipes.map((recipe) => {
    if (recipe.multiplyer) {
      let updatedIngredients = recipe.ingredients.map((element) => {
        let updatedElement = { ...element };
        updatedElement.quantity = updatedElement.quantity * recipe.multiplyer;
        return updatedElement;
      });

      return {
        ...recipe,
        ingredients: updatedIngredients,
      };
    } else {
      return recipe;
    }
  });

  tempArray.forEach(
    (recipe) => (ingredientList = ingredientList.concat(recipe.ingredients))
  );

  ingredientList.forEach((ingredient) => {
    let isIn = false;
    finalList.forEach((element, index) => {
      if (
        (element.label.toLowerCase() === ingredient.label.toLowerCase() ||
          element.label.toLowerCase() + "s" ===
            ingredient.label.toLowerCase() ||
          element.label.toLowerCase() + "x" ===
            ingredient.label.toLowerCase() ||
          element.label.toLowerCase() ===
            ingredient.label.toLowerCase() + "s" ||
          element.label.toLowerCase() ===
            ingredient.label.toLowerCase() + "x") &&
        element.unit.label === ingredient.unit.label
      ) {
        let updatedElement = { ...element };
        updatedElement.quantity += ingredient.quantity;
        finalList[index] = updatedElement;
        isIn = true;
      }
    });
    if (!isIn) {
      const elementInBase = data.find(
        (element) => element.name === ingredient.label
      );
      if (elementInBase) {
        ingredient.type = elementInBase.type.label;
      } else {
        ingredient.type = "unknown";
      }
      finalList.push(ingredient);
    }
  });

  let shoppingList = "";
  if (finalList.length > 0) {
    finalList
      .sort((a, b) => a.type.localeCompare(b.type))
      .forEach((element) => {
        let elementString =
          element.quantity +
          " " +
          element.unit.label +
          " de " +
          element.label +
          " \n";
        shoppingList += elementString;
      });
  }

  return shoppingList;
};
