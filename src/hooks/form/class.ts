import type { DerivedStateUpdaterType, FormConfig, FormFieldUpdate, InputState, KeyofInputTypes, ValueOfInputTypes } from "./types";

/**
 * Central form manager — keeps a map of field metadata and values,
 * and notifies registered controllers / field subscribers on changes.
 */
export class Form {
    private config: Map<string, FormFieldUpdate<KeyofInputTypes>>;   // map of field id to field state
    private initialValues: Map<string, unknown>; // map of field id to initial value (for reset)
    derivedStateUpdater?: DerivedStateUpdaterType;  // optional derived state updater function

    /**
     * Builds a new Form instance from config data.
     * Maps config array into internal Map for easy access.
     * 
     * @param c Form config data
     */
    constructor(c: FormConfig) {
        this.config = new Map(c.map((field) => [field.id, field]));
        this.initialValues = new Map(c.map((field) => [field.id, field.currentValue]));
    }

    /**
     * Register a field with the form instance.
     * 
     * @param field Current field state and change handler
     */
    addField(field: FormFieldUpdate<KeyofInputTypes> & { id: string }) {
        const prev = this.config.get(field.id) || {};
        const merged = { ...prev, ...field };
        this.config.set(field.id, merged);
    }

    /**
     * Find field state by its id.
     * 
     * @param id Field data whose Id want to find
     * @returns Field state
     */
    getField(id: string) {
        return this.config.get(id);
    }

    /**
     * Returns the current form state as a record of inputId to currentValue.
     * 
     * @returns Form Record<inputId, currentValue>
     */
    getState() {
        const state: Record<string, unknown> = {};
        this.config.forEach((field, id) => {
            state[id] = field.currentValue;
        });
        return state;
    }

    /**
     * Validates all fields in the form.
     * 
     * @returns True or false based on errorMsgs in inputs
     */
    validateForm(): boolean {
        let isValid = true;
        this.config.forEach((field, id) => {
            const valid = this.validateField(id, field.currentValue);
            if (!valid) {
                isValid = false;
                return;
            }
        });
        return isValid;
    }

    /**
     * Updates the derived state by calling the registered updater function.
     * 
     * @returns void
     */
    private updateDerivedState() {
        if (!this.derivedStateUpdater) return;
        this.derivedStateUpdater(this.getState());
    }

    /**
     * Changes the field state and notifies the field via its change handler.
     * 
     * @param id field Id to update
     * @param newState New state to overRide
     * @returns void
     */
    private updateField(
        id: string,
        newState: Partial<InputState<KeyofInputTypes>>
    ) {
        const field = this.config.get(id);      // get current field state
        if (!field) return;                     // field not found  
        const updatedField: FormFieldUpdate<KeyofInputTypes> = { // merge new state
            ...field,
            ...newState
        };
        this.config.set(id, updatedField);       // save updated state
        if (!updatedField.changeState) return;   // no change handler registered
        updatedField.changeState(updatedField);  // notify field of state change
    }

    /**
     * Validates a field value using its registered validators.
     * 
     * @param id Field Id to validate
     * @param newValue New value to validate
     * @returns True if valid, false if not valid
     */
    private validateField(id: string, newValue: unknown): boolean {
        const field = this.config.get(id);               // get current field state
        if (!field) return true;                         // field not found, consider valid
        if (!field.validation || field.validation.length === 0) {
            this.updateField(id, { errorMsg: "" });      // no validators, clear errorMsg
            return true;                                 // consider valid
        }
        for (const validator of field.validation) {
            const msg = validator(newValue);             // run validator
            if (msg && msg !== "") {                     // validation failed
                this.updateField(id, { errorMsg: msg }); // set errorMsg
                return false;                            // return invalid
            }
        }
        this.updateField(id, { errorMsg: "" });           // all validators passed, clear errorMsg
        return true;                                      // return valid
    }

    /**
     * Applies registered modifiers to transform the field value.
     * 
     * @param id Field Id to modify
     * @param newValue New value to apply modifiers to
     * @returns Partial input state with the modified currentValue
     */
    private modifyField(id: string, newValue: unknown): Partial<InputState<KeyofInputTypes>> {
        const field = this.config.get(id);
        if (!field || !field.modifiers || field.modifiers.length === 0) {
            return { currentValue: newValue as ValueOfInputTypes }; // no modifiers, return original value
        }
        let modified = newValue;
        for (const modifier of field.modifiers) {
            modified = modifier(modified);
        }
        return { currentValue: modified as ValueOfInputTypes };
    }

    /**
     * Notifies all controllers subscribed to the field of a state change.
     * Controllers can update other fields based on the subscribed fields' values.
     * 
     * @param id Field Id whose controllers should be notified
     * @returns void
     */
    private notifyControllers(id: string) {
        const field = this.config.get(id);
        if (!field?.controllers) return;
        for (const controller of field.controllers) {
            const subscribedFields = controller.subscribedIds.map((subId) => {
                const f = this.config.get(subId);
                if (f === undefined) {
                    console.warn("Subscribed field not found:", subId);
                }
                return f;
            }).filter((f): f is InputState<KeyofInputTypes> => f !== undefined);
            const updates = controller.update(...subscribedFields);
            for (const update of updates) {
                this.updateField(update.id, update);
            }
        }
    }

    /**
     * Requests an update to a field value. Validates, modifies, and propagates the change.
     * This is the main entry point for external field value updates.
     * 
     * @param id Field Id to update
     * @param newValue New value to set
     * @returns void
     */
    requestUpdate(id: string, newValue: unknown) {
        const field = this.config.get(id);
        if (!field) return;                                 // field not found
        if (field.isLocked) return;                         // field is locked, ignore update
        this.validateField(id, newValue);                   // whows validation result, but not impeeds value change
        const modified = this.modifyField(id, newValue);    // apply modifiers
        this.updateField(id, modified);                     // update field state
        this.notifyControllers(id);                         // notify controllers 
        this.updateDerivedState();                          // update derived state
    }

    /*** Resets all fields to their initial values. * 
     * * @returns void 
    */ 
    reset() { 
        this.initialValues.forEach((initialValue, id) => { 
            console.log(`Resetting field ${id} to initial value:`, initialValue);
            this.updateField(id, { currentValue: initialValue as ValueOfInputTypes }); // reset to initial value
            this.notifyControllers(id); // notify controllers of reset change
            this.updateDerivedState(); // update derived state after reset
        }); 
    }
}