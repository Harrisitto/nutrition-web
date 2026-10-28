// Interruptor on/off. Dentro de un <label> toma de el su nombre accesible y el label entero lo
// activa; suelto, necesita label (aria-label)
export const Toggle = ({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nutrition-green/50 focus-visible:ring-offset-1 disabled:opacity-50 ${
      checked ? "bg-nutrition-green" : "bg-dark-green/20"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white-green shadow transition-transform ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);
