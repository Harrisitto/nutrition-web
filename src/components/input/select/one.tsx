import type { SelectHTMLAttributes } from "react";

interface Option {
  label: string;
  value: string;
}

export interface SelectOneInputProps {
  label: string;
  options: Option[];
  value?: string;
  onChange?: (selectedOption: Option) => void;
  maxWidth?: string | number;
}

export const One = ({
  label,
  value,
  onChange,
  options,
  ...rest
}: SelectOneInputProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">) => {
  return (
    <label className="flex flex-col gap-2 w-48">
      <span className="text-sm text-gray-blue-600">{label}</span>
      <select
        aria-label="Select option"
        value={value ?? ""}
        className="w-full px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500"
        onChange={(event) => {
          const selectedOption = options.find(
            (option) => option.value === event.target.value,
          );
          if (!selectedOption) return;
          onChange?.(selectedOption);
        }}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
