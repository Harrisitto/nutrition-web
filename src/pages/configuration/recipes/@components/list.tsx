import { useFetchRecipes } from "@src/services/tanstack/data/recipes";
import { Loader } from "lucide-react";
import { placeholderRecipeImg } from "../constants";

export const List = ({
  typeId,
  searchStr,
  onSelectRecipe,
}: {
  typeId?: number;
  searchStr: string;
  onSelectRecipe: (id: number) => void;
}) => {
  const { data: recipes, isLoading } = useFetchRecipes({ searchStr });
  
  return isLoading ? (
    <div className="flex items-center justify-center space-x-2 p-8 text-nutrition-green">
      <Loader className="animate-spin" />
    </div>
  ) : (
    <ul className="flex flex-row flex-wrap justify-around gap-3">
      {recipes
      ?.filter((recipe) => !typeId || (recipe.type_id.id === typeId))
      .sort((a, b) => {
        if (!a.nutri_recipe[0]?.rating) return 1;
        if (!b.nutri_recipe[0]?.rating) return -1;
        return b.nutri_recipe[0].rating - a.nutri_recipe[0].rating;
      })
      .map((recipe) => {
        if (!recipe.type_id) return null;
       
        const score = recipe.nutri_recipe[0]?.rating || 0
        const stars = Math.round(score / 20);
        return (
          <li
            key={recipe.id}
            className="group w-80 cursor-pointer overflow-hidden rounded-xl border border-nutrition-green/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-nutrition-green/40 hover:shadow-md"
            onClick={() => onSelectRecipe(recipe.id)}
          >
            <div className="grid grid-cols-[1fr_1.2fr] gap-4 p-4">
              <div className="relative">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-white-green/50">
                  <img
                    alt={recipe.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    src={recipe.url || placeholderRecipeImg}
                  />
                  <div className="absolute top-1 left-1 flex flex-row gap-1 rounded px-2 py-0.5">
                    {Array.from({ length: stars }).map((_, index) => (
                      <span
                        key={index}
                        className="text-xl font-bold text-yellow-400"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <div className="min-w-0">
                  <h3 className="max-h-12 overflow-hidden text-base font-semibold uppercase leading-snug text-text-title break-words">
                    {recipe.name}
                  </h3>
                </div>
                <div className="flex flex-col w-full items-center justify-center overflow-hidden">
                  <p className="text-md text-nutrition-green font-bold">
                    {recipe.type_id.name}
                  </p>
                  <p className="ml-2 truncate text-sm text-text-muted">
                    {recipe.type_id.kcal} kcal
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
