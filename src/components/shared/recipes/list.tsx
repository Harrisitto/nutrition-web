import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { SectionLoading } from "@src/components/global/Animations";
import { deleteButtonStyle, iconButtonStyle } from "@src/components/styles";
import {
  useDeleteCustomRecipe,
  type CustomRecipe,
  type CustomRecipesQuery,
} from "@src/services/tanstack/user/customRecipes";
import { useGetAuthSession } from "@src/services/tanstack/auth/get";
import { useNotification } from "@src/store/slices/notification/hook";
import { RecipeMacrosChart } from "./@components/macrosChart";
import { normalizeSearch, recipeMacros } from "./helpers";

type Owner = "client" | "mine";

// Quién es el dueño: borde izquierdo de color + etiqueta, para distinguirlas de un vistazo
const OWNER_STYLES: Record<Owner, { border: string; badge: string }> = {
  client: { border: "border-l-nutrition-green", badge: "bg-nutrition-green/15 text-nutrition-green" },
  mine: { border: "border-l-nutrition-blue", badge: "bg-nutrition-blue/10 text-nutrition-blue" },
};

const RecipeItem = ({
  recipe,
  owner,
  isEditing,
  onEdit,
  onDeleted,
}: {
  recipe: CustomRecipe;
  /** Sin él no se indica el dueño (todas son del mismo) */
  owner?: Owner;
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
      } ${owner ? `border-l-4 ${OWNER_STYLES[owner].border}` : ""}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="min-w-0 truncate font-semibold text-text-title"
            title={recipe.name}
          >
            {recipe.name}
          </p>
          {owner && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${OWNER_STYLES[owner].badge}`}
            >
              {t(`data:customRecipes.list.owner.${owner}`)}
            </span>
          )}
        </div>
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

/**
 * Lista de recetas propias con buscador por nombre, editar y eliminar. La query la elige el padre
 * (nutri, cliente o ambos). Con `showOwner` cada receta indica si es del cliente o del nutricionista
 */
export const CustomRecipeList = ({
  query,
  editingId,
  onEdit,
  onDeleted,
  showOwner = false,
}: {
  query: CustomRecipesQuery;
  editingId: number | null;
  onEdit: (recipe: CustomRecipe) => void;
  onDeleted: (recipe: CustomRecipe) => void;
  showOwner?: boolean;
}) => {
  const { t } = useTranslation();
  const { data: recipes, isLoading, isError } = query;
  const nutriId = useGetAuthSession().data?.userId;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = normalizeSearch(search.trim());
    if (!term) return recipes ?? [];
    return (recipes ?? []).filter((recipe) => normalizeSearch(recipe.name).includes(term));
  }, [recipes, search]);

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
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 rounded-lg border border-gray-blue-300 bg-gray-blue-50 px-3 py-2 focus-within:ring-2 focus-within:ring-nutrition-green/40">
        <Search size={16} className="shrink-0 text-gray-blue-400" aria-hidden />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("data:customRecipes.list.search")}
          aria-label={t("data:customRecipes.list.search")}
          className="min-w-0 flex-1 bg-transparent text-sm text-text-body placeholder:text-text-muted focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label={t("data:customRecipes.list.clearSearch")}
            className="shrink-0 rounded p-0.5 text-gray-blue-400 hover:text-gray-blue-600"
          >
            <X size={14} />
          </button>
        )}
      </label>

      {filtered.length === 0 ? (
        <p className="p-4 text-center text-sm text-text-muted">
          {t("data:customRecipes.list.noResults")}
        </p>
      ) : (
        <ul className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto pr-1">
          {filtered.map((recipe) => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              owner={
                showOwner ? (recipe.owner_id === nutriId ? "mine" : "client") : undefined
              }
              isEditing={recipe.id === editingId}
              onEdit={() => onEdit(recipe)}
              onDeleted={() => onDeleted(recipe)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
