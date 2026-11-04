import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { useFetchTopRecipesForUser } from "@src/services/tanstack/data/recipes";
import SelectEditor from "./default/selectInput";

const NO_RECIPE_ID = -1;

interface RecipeOption {
  id: number;
  name: string;
  url: string | null;
  isClear?: boolean;
}

interface RecipeSelectEditorProps {
  typeId: number;
  /** null = sin receta fija */
  onSave: (recipeId: number | null) => void;
  onClose: () => void;
}

const RecipeSelectEditor = ({
  typeId,
  onSave,
  onClose,
}: RecipeSelectEditorProps) => {
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useFetchTopRecipesForUser({ typeId });

  const options = useMemo<RecipeOption[]>(() => {
    const noRecipe: RecipeOption = {
      id: NO_RECIPE_ID,
      name: t("data:dashboardTable.noFixedRecipe"),
      url: null,
      isClear: true,
    };
    const recipes = data?.pages.flat() ?? [];
    return [noRecipe, ...recipes];
  }, [data, t]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SelectEditor<RecipeOption>
      title={t("data:dashboardTable.selectRecipe")}
      options={options}
      getOptionId={(opt) => opt.id}
      getOptionLabel={(opt) => opt.name}
      onSave={(opt) => onSave(opt.isClear ? null : opt.id)}
      onClose={onClose}
      onScrollEnd={loadMore}
      searchable
      listFooter={
        isFetching && (
          <p className="text-center text-xs text-gray-500">
            {t("system:messages.loading")}
          </p>
        )
      }
      renderOption={(opt) => {
        if (opt.isClear) {
          return (
            <div className="py-1 font-semibold text-rose-600">{opt.name}</div>
          );
        }

        return (
          <div className="flex items-center gap-3 py-1">
            {opt.url ? (
              <img
                src={opt.url}
                alt={opt.name}
                loading="lazy"
                className="size-10 shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="size-10 shrink-0 rounded-md bg-nutrition-green/10" />
            )}
            <span className="text-sm text-dark-green">{opt.name}</span>
          </div>
        );
      }}
    />
  );
};

export default RecipeSelectEditor;
