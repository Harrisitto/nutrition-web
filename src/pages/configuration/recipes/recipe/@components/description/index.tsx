// Encabezados en mayusculas seguidos de ":" (p. ej. "PREPARACIÓN:", "VARIACIONES:")
const SECTION_REGEX = /([A-ZÀ-ÖØ-Þ]{3,}(?: [A-ZÀ-ÖØ-Þ]{2,})*):\s*/g;

const parseSections = (description: string) => {
    const parts = description.split(SECTION_REGEX);
    const sections: { title: string | null; items: string[] }[] = [];

    const intro = parts[0].trim();
    if (intro) {
        sections.push({ title: null, items: [intro] });
    }

    for (let i = 1; i < parts.length; i += 2) {
        const body = parts[i + 1]?.trim() ?? "";
        if (!body) continue;
        sections.push({
            title: parts[i],
            items: body.split(/;\s*/).map((item) => item.trim()).filter(Boolean),
        });
    }

    return sections;
};

export const RecipeDescription = ({
    description,
}: {
    description: string | null;
}) => {
    if (!description) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {parseSections(description).map((section, index) => (
                <section key={index}>
                    {section.title && (
                        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-nutrition-green">
                            {section.title}
                        </h3>
                    )}
                    {section.items.length > 1 ? (
                        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-text-subtitle marker:text-nutrition-green/60">
                            {section.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm leading-relaxed text-text-subtitle">
                            {section.items[0]}
                        </p>
                    )}
                </section>
            ))}
        </div>
    );
};
