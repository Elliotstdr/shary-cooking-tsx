export class ClassUser implements User {
  id = 0;
  name = "";
  lastname = "";
  email = "";
  imageUrl = ""
}
export class ClassRestrictedUser implements RestrictedUser {
  id = 0;
  name = "";
  imageUrl = ""
}
export class ClassRecipe implements Recipe {
  id = 0;
  title = "";
  time = "";
  number = 0;
  imageUrl = "";
  createdAt = "";
  type = new ClassType();
  regime = new ClassRegime();
  savedByUsers = [new ClassRestrictedUser()];
  postedByUser = new ClassRestrictedUser();
  ingredients = [new ClassIngredient()];
  steps = [new ClassStep()];
}
export class ClassStep implements Step {
  description = "";
  stepIndex = 0
}
export class ClassIngredient implements Ingredient {
  quantity = 0;
  label = "";
  unit = new ClassUnit();
}
export class ClassType implements Type {
  id = 0;
  label = ""
}
export class ClassRegime implements Regime {
  id = 0;
  label = ""
}
export class ClassUnit implements Unit {
  id = 0;
  label = ""
}
export class ClassIngredientType implements IngredientType {
  id = 0;
  label = ""
}
export class ClassIngredientData implements IngredientData {
  name = "";
  type = new ClassType();
  frequency = 0
}
export class ClassUpdateUserResponse {
  imageUrl= "";
  token= ""
}
export class ClassResetPasswordResponse {
  user = new ClassUser();
  token = ""
}