import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cardStyle } from "@src/components/styles";
import type {
  CustomRecipe,
  CustomRecipesQuery,
} from "@src/services/tanstack/user/customRecipes";
import CustomRecipeForm from "./index";
import { CustomRecipeList } from "./list";

/**
 * Lista de recetas propias + formulario. Al pulsar editar, el formulario carga esa receta;
 * al guardar o cancelar vuelve a "nueva receta".
 */
export const CustomRecipesManager = ({
  query,
  toClient = false,
  showOwner = false,
}: {
  query: CustomRecipesQuery;
  toClient?: boolean;
  /** La lista mezcla recetas del cliente y del nutricionista: se indica de quién es cada una */
  showOwner?: boolean;
}) => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<number | null>(null);
  // Se busca en los datos de la query para que el formulario no se quede con una receta borrada
  const editing = query.data?.find((recipe) => recipe.id === editingId) ?? null;

  const onDeleted = (recipe: CustomRecipe) => {
    if (recipe.id === editingId) setEditingId(null);
  };

  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-4 animate-fade-in md:grid-cols-2">
      <section className={`${cardStyle} p-4`}>
        <h2 className="mb-3 text-lg font-semibold text-text-title">
          {showOwner
            ? t("data:customRecipes.list.titleWithClient")
            : t("data:customRecipes.list.title")}
        </h2>
        <CustomRecipeList
          query={query}
          editingId={editingId}
          onEdit={(recipe) => setEditingId(recipe.id)}
          onDeleted={onDeleted}
          showOwner={showOwner}
        />
      </section>
      <CustomRecipeForm
        // Remontar al cambiar de receta: el form y el borrador de alimentos se inicializan con ella
        key={editing?.id ?? "new"}
        recipe={editing}
        toClient={toClient}
        onSaved={() => setEditingId(null)}
        onCancel={editing ? () => setEditingId(null) : undefined}
      />
    </div>
  );
};
