import { useCallback, useEffect, useState } from "react";
import { Form } from "../class";
import type { FormFieldUpdate, KeyofInputTypes } from "../types";

/**
 * Hook used internally by Field component: returns live field state and
 * registers a stable change handler with the Form instance.
 */
export default function useFormInputHandler(form: Form, id: string) {
  const [field, setField] = useState<FormFieldUpdate<KeyofInputTypes> | null>(() =>
    form.getField(id) ?? null,
  );

  // stable updater passed into the Form - receives the full InputState
  const change = useCallback((newState: FormFieldUpdate<KeyofInputTypes>) => {
    setField((prev) => {
      const nextField = { ...(prev ?? {}), ...newState };
      form.addField({ id, ...nextField, changeState: change });
      return nextField;
    });
  }, [form, id]);

  useEffect(() => {
    setField(form.getField(id) ?? null);
    form.addField({ id, changeState: change });
  }, [form, id, change]);

  return { field };
}