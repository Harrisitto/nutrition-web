import type { TextInputProps, MultiLineTextInputProps } from "@src/components/input";
import type { ReactElement } from "react";


interface InputTypes {
  text: {
    props: Partial<TextInputProps>;
    value: string;
  };
  textarea: {
    props: Partial<MultiLineTextInputProps>;
    value: string;
  };
  selectOne: {
    props: {
      label?: string;
      options: { value: string; label: string }[];
    };
    value: string;
  };
  numeric: {
    props: {
      label?: string;
    };
    value: number | "";
  };
  date: {
    props: {
      label?: string;
    };
    value: string; // ISO date string (e.g., "2024-01-31")
  };
  dateRange: {
    props: {
      label?: string;
    };
    value: {
      startDate: string; // ISO date string
      endDate: string;   // ISO date string
    };
  };
}

export type ValueOfInputTypes = InputTypes[KeyofInputTypes]['value'];

export type KeyofInputTypes = keyof InputTypes;

export type FormConfig = InputState<KeyofInputTypes>[];

export type DerivedStateUpdaterType = (state: Record<string, unknown>) => void;

export interface FormFieldUpdate<T extends KeyofInputTypes> extends Partial<InputState<T>> {
  changeState?: (newState: FormFieldUpdate<T>) => void;
}

export type InputState<T extends KeyofInputTypes> = {
  id: string;
  type: T;
  currentValue: InputTypes[T]['value'];
  inputProps: InputTypes[T]['props'];
  errorMsg?: string; // T function key for error message
  searchContext?: string;
  isLocked?: boolean;
  isHidden?: boolean;
  sharedRowElement?: ReactElement;
  controllers?: {
    subscribedIds: string[];
    update: (...ids: InputState<KeyofInputTypes>[]) => InputState<KeyofInputTypes>[];
  }[];
  // Use `any` for validation/modifier input parameter so specific
  // InputState<T> variants (e.g. numeric) are assignable to the
  // general FormConfig union type without parameter mismatch errors.
  validation?: ((value: unknown) => string)[];
  modifiers?: ((value: unknown) => InputTypes[T]['value'])[];
  explanation?: string; // T function key for explanation tooltip
};