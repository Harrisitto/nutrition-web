import useForm from "@src/hooks/form";
import {
  ValidateMaxLength,
  ValidateMinValue,
  ValidateStringRequired,
} from "@src/hooks/form/service/validate";
import type { InputState } from "@src/hooks/form/types";
import { createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const fieldIds = {
  point: "point",
  inDays: "inDays",
} as const;

const createPointField = () =>
  ({
    id: fieldIds.point,
    type: "text",
    currentValue: "",
    validation: [
      (value) => ValidateStringRequired(value as string),
      (value) => ValidateMaxLength(value as string, 200),
    ],
    inputProps: {
      label: "forms:appointmentThemes.fields.point", // text inputs translate their label
      placeholder: "...",
    },
  }) as InputState<"text">;

const createInDaysField = (label: string) =>
  ({
    id: fieldIds.inDays,
    type: "numeric",
    currentValue: "",
    validation: [
      (value) => (value === "" ? "system:form.required" : ""),
      (value) => (typeof value === "number" ? ValidateMinValue(value, 0) : ""),
    ],
    inputProps: {
      label, // numeric inputs render the label as is, so it arrives translated
    },
  }) as InputState<"numeric">;

const useConfig = () => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      [
        createPointField(),
        createInDaysField(t("forms:appointmentThemes.fields.inDays")),
      ] as InputState<"text" | "numeric">[],
    [t],
  );
};

export const useNewPointForm = () => {
  const config = useConfig();
  return useForm({ config });
};

export const Context = createContext<ReturnType<typeof useNewPointForm> | null>(null);

export const useContextNewPointForm = () => {
  const formData = useContext(Context);
  if (!formData) {
    throw new Error("useContextNewPointForm must be used within a NewPoint Context provider");
  }
  return formData;
};
