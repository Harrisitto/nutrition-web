import { getTrailingRoute } from "@src/hooks/navigation/routes";
import { useLocation } from "react-router-dom";

export const Header = ({
  sections,
}: {
  sections: Array<{
    route: string;
    label: string;
    onClick: () => void;
  }>;
}) => {
  const location = useLocation();
  return (
    <nav className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-nutrition-green/20 bg-white-green/50 p-2 shadow-sm">
      {sections.map((section) => {
        const isActive = location.pathname.includes(
          getTrailingRoute(section.route),
        );
        return (
          <button
            key={section.route}
            type="button"
            onClick={section.onClick}
            className={`flex rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "bg-nutrition-green text-white-green shadow"
                : "bg-white text-dark-green hover:bg-white-green"
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </nav>
  );
};
