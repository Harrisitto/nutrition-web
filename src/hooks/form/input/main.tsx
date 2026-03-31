import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../class";
import InputComponent from "@src/components/input";
import type { FormFieldUpdate, KeyofInputTypes } from "../types";

const SwitchField = ({
  field,
  form,
  id,
}: {
  field: FormFieldUpdate<KeyofInputTypes> | null;
  form: Form;
  id: string;
}) => {
  const { t } = useTranslation();
  switch (field?.type) {
    case undefined:
      return null;
    case "text": {
      const thisField = field as FormFieldUpdate<'text'>;
      return (
        <InputComponent.Text.SingleLine
          label={t(thisField.inputProps?.label ?? "")}
          value={thisField.currentValue}
          onChange={(newValue) => {
            form.requestUpdate(id, newValue.target.value);
          }}
        />
      );
    }
    case "textarea": {
      const thisField = field as FormFieldUpdate<'textarea'>;
      return (
        <InputComponent.Text.MultiLine
          label={t(thisField.inputProps?.label ?? "")}
          value={thisField.currentValue}
          onChange={(newValue) => {
            form.requestUpdate(id, newValue.target.value);
          }}
        />
      );
    }
    case "selectOne": {
      const thisField = field as FormFieldUpdate<"selectOne">;
      return (
        <InputComponent.Select.One
          label={thisField.inputProps?.label ?? ""}
          value={thisField.currentValue}
          options={thisField.inputProps?.options ?? []}
          onChange={(newValue) => {
            form.requestUpdate(id, newValue.value);
          }}
        />
      );
    }
    case "numeric": {
      const thisField = field as FormFieldUpdate<"numeric">;
      return (
        <InputComponent.Numeric
          label={thisField.inputProps?.label ?? ""}
          value={thisField.currentValue === null ? "" : thisField.currentValue}
          onChange={(newValue) => {
            const parsedValue = parseFloat(newValue.target.value);
            if (!isNaN(parsedValue)) {
              form.requestUpdate(id, parsedValue);
            } else {
              form.requestUpdate(id, null);
            }
          }}
        />
      );
    }
    case "date": {
      const thisField = field as FormFieldUpdate<"date">;
      return (
        <InputComponent.Date.SingleDate
          label={thisField.inputProps?.label ?? ""}
          value={thisField.currentValue}
          onChange={(newValue) => {
            form.requestUpdate(id, newValue);
          }}
        />
      );
    }
    case "dateRange": {
      const thisField = field as FormFieldUpdate<"dateRange">;
      return (
        <InputComponent.Date.RangeDate
          label={thisField.inputProps?.label ?? ""}
          value={thisField.currentValue}
          onChange={(startDate, endDate) => {
            form.requestUpdate(id, { startDate, endDate });
          }}
        />
      );
    }
    default:
      return null;
  }
};

export default memo(SwitchField);