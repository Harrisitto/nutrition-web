import { useCallback, useEffect, useState } from "react";
import { Form } from "../class";
import type { FormFieldUpdate } from "../types";

/**
 * Hook used internally by Field component: returns live field state and
 * registers a stable change handler with the Form instance.
 */
export default function useFormInputHandler(form: Form, id: string) {
  const saved = form.getField(id);
  const [field, setField] = useState<FormFieldUpdate | null>(saved ?? null);

  // stable updater passed into the Form - receives the full InputState
  const change = useCallback((newState: FormFieldUpdate) => {
    setField((prev) => ({ ...(prev ?? {}), ...newState }));
  }, []);

  useEffect(() => {
    if(field?.changeState !== undefined) return; // already registered
    form.addField({ id, changeState: change });  // register field with form
  }, [form, id, change, field]);

  return { field };
}