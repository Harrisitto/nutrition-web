import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import InputComponent from "@src/components/input";
import { primaryButtonStyle } from "@src/components/styles";
import type { RaceIngredient } from "@src/services/tanstack/data/raceIngredients";
import { usePendingForm, useRaceDraft } from "../../context/raceDraftContext";
import { SelectField } from "../../components/selectField";
import { toNumberInput, useKmField, type NumberInput } from "../../hooks";
import { roundKm } from "../../validation";

export const AddIntakeForm = ({ options }: { options: RaceIngredient[] }) => {
  const { t } = useTranslation();
  const { updateDraft } = useRaceDraft();
  const kmField = useKmField();
  const [ingredientId, setIngredientId] = useState("");
  const [amount, setAmount] = useState<NumberInput>(1);
  const [kmSpan, setKmSpan] = useState<NumberInput>("");

  // El ingrediente se conserva tras añadir: no cuenta como dato sin añadir
  usePendingForm(
    "ingredients",
    kmField.value !== "" || kmSpan !== "" || amount !== 1,
  );

  // save_race_plan exige km + km_span <= distancia
  const { km, maxKm } = kmField;
  const maxKmSpan = km !== null && maxKm !== undefined ? roundKm(maxKm - km) : undefined;
  const isKmSpanValid =
    kmSpan === "" ||
    (kmSpan > 0 &&
      (km === null || maxKm === undefined || roundKm(km + kmSpan) <= roundKm(maxKm)));
  const canAdd = km !== null && !!ingredientId && amount !== "" && amount > 0 && isKmSpanValid;

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    updateDraft((prev) => ({
      ingredients: [
        ...prev.ingredients,
        {
          ingredient_id: Number(ingredientId),
          km,
          amount,
          km_span: kmSpan === "" ? null : kmSpan,
        },
      ],
    }));
    // Se conserva el ingrediente para añadir rápido la misma toma en otro km
    kmField.setValue("");
    setAmount(1);
    setKmSpan("");
  };

  return (
    <form
      onSubmit={onAdd}
      className="grid grid-cols-1 items-end gap-3 md:grid-cols-[7rem_1fr_6rem_7rem_auto]"
    >
      <InputComponent.Numeric
        label={t("data:races.ingredients.km")}
        required
        min={0}
        max={maxKm}
        step="any"
        value={kmField.value}
        onChange={(e) => kmField.setValue(toNumberInput(e.target.value))}
      />
      <SelectField
        label={t("data:races.ingredients.ingredient")}
        placeholder={t("data:races.ingredients.selectIngredient")}
        value={ingredientId}
        options={options.map((option) => ({ value: option.id, label: option.name }))}
        onChange={setIngredientId}
      />
      <InputComponent.Numeric
        label={t("data:races.ingredients.amount")}
        required
        min={0}
        step="any"
        value={amount}
        onChange={(e) => setAmount(toNumberInput(e.target.value))}
      />
      <InputComponent.Numeric
        label={t("data:races.ingredients.kmSpan")}
        min={0}
        max={maxKmSpan}
        step="any"
        value={kmSpan}
        onChange={(e) => setKmSpan(toNumberInput(e.target.value))}
      />
      <button type="submit" disabled={!canAdd} className={primaryButtonStyle}>
        <Plus size={16} />
        {t("data:races.ingredients.add")}
      </button>
    </form>
  );
};
