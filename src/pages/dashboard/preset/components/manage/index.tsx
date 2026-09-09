import {
  useDeletePreset,
  useFetchPresets,
} from "@src/services/tanstack/user/preset";
import { ChevronDown, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Chart } from "./trainingHcChart";
import { KcalResume } from "./kcalResume";
import { calculateKcalFromMacros } from "@src/hooks/helpers/constants";
import { MacrosResume } from "./macrosResume";

type Preset = NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number];

const Header = ({
  id,
  title,
  isSelected,
  viewDetails,
}: {
  id: number;
  title: string;
  isSelected: boolean;
  viewDetails: () => void;
}) => {
  const deleteQuery = useDeletePreset();
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-nutrition-green/20 bg-white-green/60 px-4 py-3 transition-colors hover:bg-white-green/80">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 text-left font-bold"
        onClick={viewDetails}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-text-subtitle transition-transform duration-200 ${isSelected ? "rotate-180" : "rotate-0"}`}
        />
        <h3
          className={`truncate text-sm md:text-base ${isSelected ? "font-semibold text-text-title" : "font-medium text-text-subtitle"}`}
        >
          {title}
        </h3>
      </button>
      <button
        type="button"
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-nutrition-red/10 hover:text-nutrition-red"
        aria-label={`Delete ${title}`}
        onClick={() => deleteQuery.mutateAsync(id)}
      >
        <Trash className="h-4 w-4 cursor-pointer" />
      </button>
    </div>
  );
};

const Details = ({
  meals,
  trainingHc,
  comment,
}: {
  meals: Preset["user_preset_meal"];
  trainingHc: Preset["training_hc"];
  comment: Preset["comment"];
}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-3 space-y-4 rounded-xl border border-nutrition-green/20 bg-white px-4 py-4 text-sm text-text-body shadow-sm animate-fade-in">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t("forms:preset.fields.meals")}
        </h3>
        <ul className="space-y-1.5">
          {meals.map((meal) => (
            <li
              key={`${meal.meal_id}-${meal.type_id?.id}`}
              className="rounded-md bg-nutrition-green/10 px-3 py-2 text-text-title font-bold"
            >
              <span className="text-xs text-text-muted">
                {meal.meal_id.name}
              </span>
              <br />
              {meal.type_id.name || t("forms:preset.fields.unknownMealType")}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t("forms:preset.fields.trainingHc")}
        </h3>
        <Chart data={trainingHc} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t("forms:preset.fields.comment")}
        </h3>
        <p className="rounded-md border border-nutrition-green/20 bg-white-green/40 px-3 py-2 text-sm text-text-body">
          {comment || "-"}
        </p>
      </div>

      <KcalResume
        mealKcal={meals.map((meal) => ({
          kcal: meal.type_id.kcal,
          name: meal.meal_id.name,
        }))}
        trainingKcal={trainingHc.reduce(
          (total, hc) => total + calculateKcalFromMacros({ carbs: hc }),
          0,
        )}
      />
    </div>
  );
};

const RenderOne = ({ preset }: { preset: Preset }) => {
  const [viewDetails, setViewDetails] = useState(false);
  return (
    <div className="">
      <Header
        id={preset.id}
        title={preset.name}
        isSelected={viewDetails}
        viewDetails={() => setViewDetails((prev) => !prev)}
      />
      {viewDetails && (
        <>
          <Details
            meals={preset.user_preset_meal}
            trainingHc={preset.training_hc}
            comment={preset.comment}
          />
          <MacrosResume preset={preset} />
        </>
      )}
    </div>
  );
};

export const List = () => {
  const presetsQuery = useFetchPresets();
  if (!presetsQuery.data?.length) {
    return (
      <div className="rounded-lg border border-nutrition-green/20 bg-white-green/30 px-3 py-5 text-center text-sm text-text-muted">
        -
      </div>
    );
  }
  return (
    <div className="h-fit self-start space-y-3 rounded-2xl border border-nutrition-green/20 bg-white-green/30 p-3 shadow-sm">
      {presetsQuery.data?.map((preset) => (
        <RenderOne key={preset.id} preset={preset} />
      ))}
    </div>
  );
};
