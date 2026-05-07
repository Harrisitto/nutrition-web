import { placeholderRecipeImg } from "../../constants";
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
    <ul className="flex flex-row flex-wrap gap-5">
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
          <li key={`ingredient-${ingredient.id}`} className="w-80">
            <img
              src={ingredient.url || placeholderRecipeImg}
              alt={ingredient.name}
              className="w-12 h-12 object-cover rounded mr-2 inline-block"
            />
            <span className="font-medium">{ingredient.name}</span>
            <span className="text-sm text-gray-500 ml-2">
              {ingredient.amount}
            </span>
            {ingredient.comment && (
              <p className="text-sm text-gray-600 ml-14">
                {ingredient.comment}
              </p>
            )}
          </li>
        ))}
    </ul>
  );
};
