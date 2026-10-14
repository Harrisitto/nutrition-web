import { ChevronLeft } from "lucide-react";

export const BackButton = ({
  label,
  onBack,
}: {
  label: string;
  onBack: () => void;
}) => {
  return (
    <button
      type="button"
      title={label}
      className="inline-flex items-center gap-1 rounded-lg p-2 text-nutrition-green transition-colors hover:bg-white-green/60"
      onClick={onBack}
    >
      <ChevronLeft />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};
