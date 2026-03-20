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
    default:
      return null;
  }
};

export default memo(SwitchField);