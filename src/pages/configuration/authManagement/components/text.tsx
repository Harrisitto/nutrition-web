import { useTranslation } from 'react-i18next';

interface SectionTitleProps {
  translationKey: string;
}

export const SectionTitle = ({ translationKey }: SectionTitleProps) => {
  const { t } = useTranslation();
  return (
    <h1 className="
      text-2xl md:text-3xl font-bold text-text-title
      tracking-tight pb-2 border-b-2 border-nutrition-green/20
      mb-4
    ">
      {t(translationKey)}
    </h1>
  );
};

// Accesos directos convenientes:
export const TitleRegion = () => (
  <SectionTitle translationKey="data:configuration.sections.authManagement.regionSettings" />
);

export const TitleUser = () => (
  <SectionTitle translationKey="data:configuration.sections.authManagement.userSettings" />
);
