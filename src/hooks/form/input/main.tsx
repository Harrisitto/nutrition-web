import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../class";
import InputComponent from "@src/components/input";
import type { FormFieldUpdate } from "../types";

const SwitchField = ({
  field,
  form,
  id,
}: {
  field: FormFieldUpdate | null;
  form: Form;
  id: string;
}) => {
  const { t } = useTranslation();
  switch (field?.type) {
    case undefined:
      return null;
    case "text": {
      return (
        <InputComponent.Text.SingleLine
          label={t(field.inputProps?.label ?? "")}
          value={field.currentValue}
          onChange={(newValue) => {
            form.requestUpdate(id, newValue.target.value);
          }}
        />
      );
    }
    case "textarea": {
      return (
        <InputComponent.Text.MultiLine
          label={t(field.inputProps?.label ?? "")}
          value={field.currentValue}
          onChange={(newValue) => {
            form.requestUpdate(id, newValue.target.value);
          }}
        />
      );
    }
    default:
      return null;
  }
};

export default memo(SwitchField);