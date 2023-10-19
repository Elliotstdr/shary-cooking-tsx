import { store } from "../Store/store";

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
        let elementString = "";
        element.unit.label !== "unité"
          ? (elementString =
              element.quantity +
              " " +
              element.unit.label +
              " de " +
              element.label.toLowerCase() +
              " \n")
          : (elementString =
              element.quantity + " " + element.label.toLowerCase() + " \n");
        shoppingList += elementString;
      });
  }

  return shoppingList;
};

export const timeToString = (time) => {
  const splittedTime = time.split(":");
  const hours = Number(splittedTime[0]);
  const minutes = Number(splittedTime[1]);

  if (hours === 1) {
    if (minutes === 0) {
      return hours + " heure";
    } else {
      return hours + "h" + minutes;
    }
  } else if (hours > 1) {
    if (minutes === 0) {
      return hours + " heures";
    } else {
      return hours + "h" + minutes;
    }
  } else {
    return minutes + " minutes";
  }
};

export const successToast = (message, summary = "Succès") => {
  const reduxStore = store.getState();
  reduxStore.auth.toast.current.show({
    severity: "success",
    summary: `${summary} : `,
    detail: message,
    life: 3000,
  });
};

export const errorToast = (message, summary = "Erreur") => {
  const reduxStore = store.getState();
  reduxStore.auth.toast.current.show({
    severity: "error",
    summary: `${summary} : `,
    detail: message,
    life: 3000,
  });
};
