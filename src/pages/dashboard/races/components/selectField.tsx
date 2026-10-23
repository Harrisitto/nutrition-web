// <select> con el aspecto de @src/components/input: Select.One no admite una
// opción vacía para obligar a elegir y tiene un ancho fijo
export const SelectField = ({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  // className: para resaltar una opción (p. ej. la sugerida)
  options: { value: string | number; label: string; className?: string }[];
  onChange: (value: string) => void;
}) => {
  // El <select> cerrado muestra la opción elegida: con su mismo resaltado
  const selectedClassName =
    options.find((option) => String(option.value) === value)?.className ?? "";

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-gray-blue-600">{label}</span>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border border-gray-blue-300 bg-gray-blue-50 px-3 py-2 text-gray-blue-700 focus:border-gray-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 ${selectedClassName}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className={option.className}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
