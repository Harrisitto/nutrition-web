import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { SectionLoading } from "@src/components/global/Animations";
import { deleteButtonStyle, iconButtonStyle } from "@src/components/styles";
import {
  useDeleteCustomRecipe,
  type CustomRecipe,
  type useFetchMyCustomRecipes,
} from "@src/services/tanstack/user/customRecipes";
import { useNotification } from "@src/store/slices/notification/hook";
import { RecipeMacrosChart } from "./@components/macrosChart";
import { recipeMacros } from "./helpers";

const RecipeItem = ({
  recipe,
  isEditing,
  onEdit,
  onDeleted,
}: {
  recipe: CustomRecipe;
  isEditing: boolean;
  onEdit: () => void;
  onDeleted: () => void;
}) => {
  const { t } = useTranslation();
  const { addMutationError } = useNotification();
  const deleteRecipe = useDeleteCustomRecipe();

  const onDelete = () => {
    if (
      !window.confirm(
        t("data:customRecipes.list.confirmDelete", { name: recipe.name }),
      )
    )
      return;
    deleteRecipe.mutate(recipe.id, {
      onSuccess: onDeleted,
      onError: addMutationError,
    });
  };

  return (
    <li
      className={`flex items-start gap-3 rounded-lg border bg-white p-2 ${
        isEditing ? "border-nutrition-green" : "border-nutrition-green/20"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-semibold text-text-title"
          title={recipe.name}
        >
          {recipe.name}
        </p>
        <p className="text-xs text-text-muted">
          {t("data:customRecipes.list.ingredientsCount", {
            count: recipe.ingredients.length,
          })}
        </p>
        {recipe.description && (
          <p className="mt-1 line-clamp-2 text-xs text-text-muted">
            {recipe.description}
          </p>
        )}
        <div className="mt-2">
          <RecipeMacrosChart
            macros={recipeMacros(recipe)}
            typeName={recipe.type?.name}
          />
        </div>
      </div>
      <button
        type="button"
        title={t("data:customRecipes.list.edit")}
        aria-label={t("data:customRecipes.list.edit")}
        onClick={onEdit}
        className={iconButtonStyle}
      >
        <Pencil size={18} />
      </button>
      <button
        type="button"
        title={t("data:customRecipes.list.delete")}
        aria-label={t("data:customRecipes.list.delete")}
        disabled={deleteRecipe.isPending}
        onClick={onDelete}
        className={deleteButtonStyle}
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
};

/** Lista de recetas propias con editar y eliminar. La query la elige el padre (nutri o cliente) */
export const CustomRecipeList = ({
  query,
  editingId,
  onEdit,
  onDeleted,
}: {
  query: ReturnType<typeof useFetchMyCustomRecipes>;
  editingId: number | null;
  onEdit: (recipe: CustomRecipe) => void;
  onDeleted: (recipe: CustomRecipe) => void;
}) => {
  const { t } = useTranslation();
  const { data: recipes, isLoading, isError } = query;

  if (isLoading) {
    return <SectionLoading />;
  }

  if (isError) {
    return (
      <p className="p-4 text-sm text-red-500">
        {t("data:customRecipes.list.loadError")}
      </p>
    );
  }

  if (!recipes?.length) {
    return (
      <p className="p-4 text-sm text-text-muted">
        {t("data:customRecipes.list.empty")}
      </p>
    );
  }

  return (
    <ul className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto pr-1">
      {recipes.map((recipe) => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe}
          isEditing={recipe.id === editingId}
          onEdit={() => onEdit(recipe)}
          onDeleted={() => onDeleted(recipe)}
        />
      ))}
    </ul>
  );
};
