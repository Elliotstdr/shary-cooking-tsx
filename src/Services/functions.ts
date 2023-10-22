import { store } from "../Store/store";

interface ExtendedIngredient extends Ingredient {
  type: string
}
export const exportRecipe = (chosenRecipes: Array<RecipeShopping>, data: Array<IngredientData>) => {
  let ingredientList: Array<Ingredient> = [];
  let finalList: Array<ExtendedIngredient> = [];

  let tempArray = chosenRecipes.map((recipe: RecipeShopping) => {
    if (recipe.multiplyer) {
      let updatedIngredients = recipe.ingredients.map((element: Ingredient) => {
        let updatedElement = { ...element };
        updatedElement.quantity = recipe.multiplyer
          ? updatedElement.quantity * recipe.multiplyer
          : updatedElement.quantity;
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
    (recipe: Recipe) => (ingredientList = ingredientList.concat(recipe.ingredients))
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

      const type = elementInBase
        ? elementInBase.type.label
        : "unknown"
      finalList.push({...ingredient, type});
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

export const timeToString = (time: string) => {
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

export const successToast = (message: string, summary: string = "Succès") => {
  const reduxStore = store.getState();
  reduxStore.auth.toast.current.show({
    severity: "success",
    summary: `${summary} : `,
    detail: message,
    life: 3000,
  });
};

export const errorToast = (message: string, summary: string = "Erreur") => {
  const reduxStore = store.getState();
  reduxStore.auth.toast.current.show({
    severity: "error",
    summary: `${summary} : `,
    detail: message,
    life: 3000,
  });
};
