import type { ConfigurationSectionKey } from "./context";
import { useConfigurationContext } from "./context";

export const ConfigurationHeader = ({
	sections,
}: {
	sections: Array<{
		key: ConfigurationSectionKey;
		label: string;
	}>;
}) => {
	const { selectedSection, setSelectedSection } = useConfigurationContext();

	return (
		<nav className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-nutrition-green/20 bg-white-green/50 p-2 shadow-sm">
			{sections.map((section) => {
				const isActive = selectedSection === section.key;
				return (
					<button
						key={section.key}
						type="button"
						onClick={() => setSelectedSection(section.key)}
						className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
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
