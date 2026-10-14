import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputComponent from "@src/components/input";
import { fileInputStyle, primaryButtonStyle } from "@src/components/styles";
import {
  useAddRaceIngredient,
  RaceIngredientImageError,
} from "@src/services/tanstack/data/raceIngredients";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  amountFields,
  emptyIngredient,
  type AmountKey,
} from "./constants";

export const AddIngredientForm = () => {
  const { t } = useTranslation();
  const [ingredient, setIngredient] = useState(emptyIngredient);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // Cambiar la key remonta el input de fichero: es la única forma de vaciarlo
  const [fileInputKey, setFileInputKey] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const { mutate: addIngredient, isPending, error } = useAddRaceIngredient();

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const onSelectImage = (file: File | null) => {
    setImageError(null);
    if (file && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError(t("data:configuration.sections.raceIngredients.imageTypeError"));
    } else if (file && file.size > MAX_IMAGE_SIZE) {
      setImageError(t("data:configuration.sections.raceIngredients.imageSizeError"));
    } else {
      setImage(file);
      return;
    }
    setImage(null);
    setFileInputKey((key) => key + 1);
  };

  const reset = () => {
    setIngredient(emptyIngredient);
    setImage(null);
    setFileInputKey((key) => key + 1);
  };

  const setAmount = (key: AmountKey, value: string) =>
    setIngredient((prev) => ({
      ...prev,
      [key]: value === "" ? null : Number(value),
    }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredient.name.trim()) return;
    addIngredient(
      { ingredient: { ...ingredient, name: ingredient.name.trim() }, image },
      {
        onSuccess: reset,
        // El ingrediente ya se ha creado (sin imagen): reintentar lo duplicaría
        onError: (error) => {
          if (error instanceof RaceIngredientImageError) reset();
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <InputComponent.Text.SingleLine
        label={t("data:configuration.sections.raceIngredients.fields.name")}
        value={ingredient.name}
        required
        onChange={(e) =>
          setIngredient((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      {amountFields.map(({ key, unit }) => (
        <InputComponent.Numeric
          key={key}
          label={`${t(`data:configuration.sections.raceIngredients.fields.${key}`)} (${unit})`}
          value={ingredient[key] ?? ""}
          min={0}
          step="any"
          onChange={(e) => setAmount(key, e.target.value)}
        />
      ))}
      <label className="flex flex-col gap-2">
        <span className="text-sm text-gray-blue-600">
          {t("data:configuration.sections.raceIngredients.fields.image")}
        </span>
        <div className="flex items-center gap-3">
          {preview && (
            <img
              alt=""
              src={preview}
              className="h-12 w-12 shrink-0 rounded-md object-cover"
            />
          )}
          <input
            key={fileInputKey}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            onChange={(e) => onSelectImage(e.target.files?.[0] ?? null)}
            className={fileInputStyle}
          />
        </div>
      </label>
      {imageError && <p className="text-sm text-red-500">{imageError}</p>}
      {error && (
        <p className="text-sm text-red-500">
          {error instanceof RaceIngredientImageError
            ? t("data:configuration.sections.raceIngredients.imageUploadError")
            : t("data:configuration.sections.raceIngredients.saveError")}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending || !ingredient.name.trim()}
        className={`${primaryButtonStyle} mt-2`}
      >
        {t("data:configuration.sections.raceIngredients.add")}
      </button>
    </form>
  );
};
