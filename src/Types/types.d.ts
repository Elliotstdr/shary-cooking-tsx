interface User {
  id: number,
  name: string,
  lastname: string,
  email: string,
  imageUrl: string
}

interface Recipe {
  id: number,
  title: string,
  time: string,
  number: number,
  imageUrl: string,
  createdAt: string,
  type: Type,
  regime: Regime,
  savedByUsers: Array<RestrictedUser>,
  postedByUser: RestrictedUser,
  ingredients: Array<Ingredient>,
  steps: Array<Steps>,
}

interface RecipeShopping extends Recipe {
  multiplyer?: number
}

interface Type {
  id: number,
  label: string
}

interface Regime {
  id: number,
  label: string
}

interface Unit {
  id: number,
  label: string
}

interface IngredientType {
  id: number,
  label: string
}

interface IngredientData {
  id?: number,
  name: string,
  type: Type,
  frequency: number|null
}

interface Ingredient {
  id?: number,
  quantity: number,
  label: string,
  unit: Unit,
}

interface Step {
  id?: number,
  description: string,
  stepIndex: number
}

interface RestrictedUser {
  id: number,
  name: string,
  imageUrl: string
}