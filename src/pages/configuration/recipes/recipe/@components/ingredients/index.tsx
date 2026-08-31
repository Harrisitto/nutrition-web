import { placeholderRecipeImg } from "../../../constants";
import { useFetchRecipeInfo } from "@src/services/tanstack/data/recipes";

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

  return (
    <ul className="flex flex-row flex-wrap gap-3">
      {recipe.all_ingredients
        .filter((ingredient) => {
          const parseSearch = (str: string) =>
            str
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "");
          const search = parseSearch(searchStr);
          const name = parseSearch(ingredient.name);
          return name.includes(search);
        })
        .map((ingredient) => (
          <li
            key={`ingredient-${ingredient.id}`}
            className="w-80 rounded-xl border border-nutrition-green/20 bg-white-green/60 p-3 shadow-sm transition-colors hover:border-nutrition-green/35"
          >
            <img
              src={ingredient.url || placeholderRecipeImg}
              alt={ingredient.name}
              className="w-12 h-12 object-cover rounded-lg mr-2 inline-block"
            />
            <span className="font-medium text-text-title">
              {ingredient.name}
            </span>
            <span className="text-sm text-text-muted ml-2">
              {ingredient.amount}
            </span>
            {ingredient.comment && (
              <p className="text-sm text-text-muted ml-14">
                {ingredient.comment}
              </p>
            )}
          </li>
        ))}
    </ul>
  );
};
