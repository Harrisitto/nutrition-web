export const Numeric = ({
  label,
  value,
  onChange,
  ...props
}: {
  label?: string;
  value?: number | "";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className="flex flex-col gap-2">
      {label && <span className="text-sm text-gray-blue-600">{label}</span>}
      <input
        type="number"
        value={value !== undefined ? value : ""}
        placeholder={"..."}
        className="w-full px-3 py-1 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500"
        onChange={onChange}
        {...props}
      />
    </label>
  );
};
