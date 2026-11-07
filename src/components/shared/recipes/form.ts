import { useMemo } from "react";
import useForm from "@src/hooks/form";
import { ValidateMaxLength, ValidateStringRequired } from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";
import type { CustomRecipe } from "@src/services/tanstack/user/customRecipes";

export const fieldIds = {
  name: "name",
  description: "description",
} as const;

const buildConfig = (recipe: CustomRecipe | null | undefined) =>
  [
    {
      id: fieldIds.name,
      type: "text",
      currentValue: recipe?.name ?? "",
      validation: [
        (value) => ValidateStringRequired(value as string),
        (value) => ValidateMaxLength(value as string, 120),
      ],
      inputProps: {
        label: "forms:customRecipes.fields.name",
        placeholder: "...",
      },
    } as InputState<"text">,
    {
      id: fieldIds.description,
      type: "textarea",
      currentValue: recipe?.description ?? "",
      validation: [(value) => ValidateMaxLength(value as string, 2000)],
      inputProps: {
        label: "forms:customRecipes.fields.description",
        placeholder: "...",
      },
    } as InputState<"textarea">,
  ] as InputState<"text" | "textarea">[];

/**
 * Nombre y descripción de una receta propia. Los alimentos no caben en useForm (lista variable)
 * y los lleva el componente. Con `recipe` el formulario empieza con sus valores (editar).
 */
export const useCustomRecipeForm = (recipe: CustomRecipe | null | undefined) => {
  // useForm recrea el Form cuando cambia la config: solo debe pasar al cambiar de receta
  const recipeId = recipe?.id;
  const config = useMemo(() => buildConfig(recipe), [recipeId]);
  return useForm({ config });
};
