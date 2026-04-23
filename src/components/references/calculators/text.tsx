import { useTranslation } from "react-i18next";

const ReferenceItem = ({
  title,
  description,
  reference,
  url,
}: {
  title: string;
  description: string;
  reference: string;
  url?: string;
}) => {
  const { t } = useTranslation("data");

  return (
    <div className="border border-gray-blue-200 bg-gray-blue-50 p-4 rounded-lg w-full">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-700 mt-2">{description}</p>
      <p className="text-sm text-gray-500 mt-2">
        {reference}
      </p>
      {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {`\n${t("references.viewMore")}`}
          </a>
        ) : null}
    </div>
  );
};

export const Dehydration = () => {
  const { t } = useTranslation();

  return (
    <ReferenceItem
      title={t("data:references.calculators.dehydration01.title")}
      description={t("data:references.calculators.dehydration01.description")}
      reference={t("data:references.calculators.dehydration01.reference")}
    />
  );
};

export const Osmolarity = () => {
  const { t } = useTranslation();

  return (
    <ReferenceItem
      title={t("data:references.calculators.osmolarity01.title")}
      description={t("data:references.calculators.osmolarity01.description")}
      reference={t("data:references.calculators.osmolarity01.reference")}
      url={t("data:references.calculators.osmolarity01.url")}
    />
  );
};

export const CarbLoading = () => {
  const { t } = useTranslation();

  return (
    <ReferenceItem
      title={t("data:references.calculators.carbLoading01.title")}
      description={t("data:references.calculators.carbLoading01.description")}
      reference={t("data:references.calculators.carbLoading01.reference")}
    />
  );
};

export const CookedIngredients = () => {
  const { t } = useTranslation();

  return (
    <ReferenceItem
      title={t("data:references.calculators.cookedIngredients01.title")}
      description={t(
        "data:references.calculators.cookedIngredients01.description",
      )}
      reference={t("data:references.calculators.cookedIngredients01.reference")}
      url={t("data:references.calculators.cookedIngredients.01.url")}
    />
  );
};

export const EatingDisorder = () => {
  const { t } = useTranslation();

  return (
    <ReferenceItem
      title={t("data:references.calculators.eatingDisorder01.title")}
      description={t(
        "data:references.calculators.eatingDisorder01.description",
      )}
      reference={t("data:references.calculators.eatingDisorder01.reference")}
      url={t("data:references.calculators.eatingDisorder01.url")}
    />
  );
};
