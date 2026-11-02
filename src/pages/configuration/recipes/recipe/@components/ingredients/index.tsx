import { useFetchRecipeInfo } from "@src/services/tanstack/data/recipes";

const parseSearch = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export const IngredientsList = ({
  recipeId,
  searchStr,
}: {
  searchStr: string;
  recipeId: number;
}) => {
  const { data: recipe } = useFetchRecipeInfo({ recipeId });

  if (!recipe) {
    return null;
  }

  const search = parseSearch(searchStr);

  return (
    // Columnas segun el ancho del contenedor, no de la pantalla
    <ul className="grid max-h-[28rem] grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
      {recipe.all_ingredients
        .filter((ingredient) => parseSearch(ingredient.name).includes(search))
        .map((ingredient) => (
          <li
            key={`ingredient-${ingredient.id}`}
            className="flex items-start gap-3 rounded-xl border border-nutrition-green/15 bg-white-green/40 p-2.5 transition-colors hover:border-nutrition-green/35 hover:bg-white-green/70"
          >
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-nutrition-green/60" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="font-semibold leading-tight text-text-title">
                {ingredient.name}
              </p>
              {ingredient.amount && (
                <p className="text-sm font-medium leading-snug text-nutrition-green">
                  {ingredient.amount}
                </p>
              )}
              {ingredient.comment && (
                <p className="text-xs italic leading-snug text-text-muted">
                  {ingredient.comment}
                </p>
              )}
            </div>
          </li>
        ))}
    </ul>
  );
};
