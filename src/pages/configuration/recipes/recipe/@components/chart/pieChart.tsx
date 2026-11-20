import { useFetchRecipeInfo } from "@src/services/tanstack/data/recipes";
import { useTranslation } from "react-i18next";
import { Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { renderMacroLabel } from "./macroLabel";

export const RecipePieChart = ({ recipeId }: { recipeId: number }) => {
  const { data: recipe } = useFetchRecipeInfo({ recipeId });
  const { t } = useTranslation();
  if (!recipe) {
    return null;
  }
  return (
    <div className="relative flex h-64 w-64 flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 24, right: 24, bottom: 24, left: 24 }}>
          <Pie
            data={[
              {
                name: t("data:macronutrients.carbs"),
                value: Math.round(recipe.macros.hc),
                fill: "#455e19",
              },
              {
                name: t("data:macronutrients.protein"),
                value: Math.round(recipe.macros.prot),
                fill: "#30556b",
              },
              {
                name: t("data:macronutrients.fats"),
                value: Math.round(recipe.macros.fat),
                fill: "#6b2f55",
              },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={80}
            paddingAngle={2}
            label={renderMacroLabel}
            stroke="none"
            shape={(props) => (
              <Sector {...props} fill={props.payload?.fill ?? "#455e19"} />
            )}
          />
          <Tooltip formatter={(v) => `${v}g`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {t("data:macronutrients.kcal")}
        </span>
        <span className="text-2xl font-bold text-nutrition-green">
          {Math.round(recipe.macros.kcal)}
        </span>
        <span className="text-xs text-text-muted">kcal</span>
      </div>
    </div>
  );
};
