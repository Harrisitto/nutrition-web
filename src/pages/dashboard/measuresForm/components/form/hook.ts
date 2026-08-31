import FromDate from "@src/helpers/dates";
import useForm from "@src/hooks/form";
import type { InputState } from "@src/hooks/form/types";
import { useFetchAllMeasures } from "@src/services/tanstack/user/measures";
import { createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

type MeasureType = NonNullable<
  ReturnType<typeof useFetchAllMeasures>["data"]
>[number];

export const fieldIds = {
  date: "date",
  selectMeasure: "choose-measure",
  measure: {
    generateId: (measureId: number) => `measure-${measureId}`,
    parseId: (id: string) => {
      const prefix = "measure-";
      if (!id.startsWith(prefix)) return null;
      const measureIdStr = id.slice(prefix.length);
      const measureId = parseInt(measureIdStr, 10);
      return isNaN(measureId) ? null : measureId;
    },
  },
} as const;

const createDateField = (label: string) =>
  ({
    id: fieldIds.date,
    type: "date",
    currentValue: new FromDate().save(),
    inputProps: {
      label,
    },
    explanation: "",
    isHidden: false,
  }) as InputState<"date">;

const createMeasureField = (measure: MeasureType) => {
  return {
    id: fieldIds.measure.generateId(measure.id),
    type: "numeric",
    currentValue: "",
    inputProps: {
      label: `${measure.name} ${measure.units || ""}`,
    },
    explanation: measure.description,
    isHidden: true,
  } as InputState<"numeric">;
};

const createSelectMeasureField = (label: string, measures: MeasureType[]) => {
  const options = measures.map((measure) => ({
    label: measure.name,
    value: measure.id.toString(),
  }));

  const emptyOption = {
    label: " - ",
    value: "",
  };

  return {
    id: fieldIds.selectMeasure,
    type: "selectOne",
    currentValue: "",
    inputProps: {
      label,
      options: [emptyOption, ...options],
    },
    controllers: [
      {
        subscribedIds: [
          fieldIds.selectMeasure,
          ...measures.map((measure) => fieldIds.measure.generateId(measure.id)),
        ],
        update: (...ids) => {
          const [s, ...m] = ids;
          const selectedMeasureId = s.currentValue;
          return m.map((value) => {
            const measureId = fieldIds.measure.parseId(value.id);
            if (measureId === null) return value;
            return {
              ...value,
              isHidden: measureId.toString() !== selectedMeasureId,
            };
          });
        },
      },
    ],
    validation: [
      (value) => {
        if (typeof value !== "string" || value === "") return "";
        return measures.some((measure) => measure.id.toString() === value)
          ? ""
          : "system:messages.error";
      },
    ],
  } as InputState<"selectOne">;
};

const useConfig = () => {
  const measures = useFetchAllMeasures();
  const { t } = useTranslation();

  const measureFields = useMemo(() => {
    if (!measures.data) return [];
    return measures.data.map(createMeasureField);
  }, [measures.data]);

  const selectMeasureField = useMemo(() => {
    if (!measures.data) return null;
    return createSelectMeasureField(
      t("forms:measures.fields.selectMeasure"),
      measures.data,
    );
  }, [measures.data, t]);

  return [
    createDateField(t("forms:measures.fields.date")),
    ...(selectMeasureField ? [selectMeasureField] : []),
    ...measureFields,
  ] as InputState<"date" | "numeric" | "selectOne">[];
};

export const useMeasuresForm = () => {
  const config = useConfig();

  const form = useForm({
    config,
  });

  return form;
};

export const Context = createContext<ReturnType<typeof useMeasuresForm> | null>(
  null,
);

export const useContextMeasuresForm = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useContextMeasuresForm must be used within a MeasuresFormProvider",
    );
  }
  return context;
};
