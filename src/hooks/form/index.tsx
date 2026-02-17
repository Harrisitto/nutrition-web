import { useEffect, useMemo, useState } from "react";
import { Form } from "./class";
import Field from "./input/index";
import type { FormConfig } from "./types";

interface FormProps<T> {
  config: FormConfig;
  search?: string;
  calculateDerivedState?: (state: Record<string, unknown>) => T;
}

/**
 * Field is bound to the created form instance and can be used anywhere in the tree.
 */
export default function useForm<DS extends object>({
  config, // form configuration, an array of input states, containint all necessary info
  search, // optional search string to filter fields by their searchContext
  calculateDerivedState, // optional function to calculate derived state based on current form state
}: FormProps<DS>) {
  /**
   * Initialize form instance only once per hook usage,
   * Form controlls all field states and updates.
   */
  const form = useMemo(() => {
    return { current: new Form(config) };
  }, [config]);

  /**
   * Derived state management
   * Calculated based on form ids and their current values
   */
  const [derivedState, setDS] = useState<DS>();

  /**
   * Derived state updater registration
   */
  useEffect(() => {
    if (!calculateDerivedState) return; // no derived state calculation needed
    // Register derived state updater in form instance
    form.current.derivedStateUpdater = (state: Record<string, unknown>) => {
      if (!calculateDerivedState) return;
      const derived = calculateDerivedState(state);
      setDS(derived);
    };
    // Initial calculation, needed to set initial derived state
    form.current.derivedStateUpdater(form.current.getState());
  }, [calculateDerivedState, form]);

  /**
   * Render form fields based on config and search context
   */
  const Fields = useMemo(() => {
    let configToUse = config;

    if (search && search.trim().length > 0) {
      // apply search filter
      const lowerSearch = search.toLowerCase().trim(); // normalize search string
      configToUse = config.filter((field) => {
        if (!field.searchContext) return false; // no search context means no match
        return field.searchContext.trim().toLowerCase().includes(lowerSearch); // return match result
      });
    }

    return configToUse.map((fieldConfig) => {
      // render each field
      return (
        <Field key={fieldConfig.id} form={form.current} id={fieldConfig.id} />
      );
    });
  }, [config, form, search]);

  // Return form instance, derived state and rendered fields
  return { form: form.current, derivedState, Fields };
}
