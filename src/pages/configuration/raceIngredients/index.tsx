import { useTranslation } from "react-i18next";
import { cardStyle } from "@src/components/styles";
import { ConfigurationPages } from "@src/pages/configuration/@components/title";
import { IngredientList } from "./manage";
import { AddIngredientForm } from "./new";

const sectionStyle = `${cardStyle} p-4`;

const ConfigRaceIngredients = () => {
  const { t } = useTranslation();

  return (
    <ConfigurationPages
      title={t("data:configuration.sections.raceIngredients.title")}
      description={t("data:configuration.sections.raceIngredients.description")}
    >
      <div className="grid w-full max-w-5xl grid-cols-1 gap-4 animate-fade-in md:grid-cols-2">
        <section className={sectionStyle}>
          <h2 className="mb-3 text-lg font-semibold text-text-title">
            {t("data:configuration.sections.raceIngredients.listTitle")}
          </h2>
          <IngredientList />
        </section>
        <section className={sectionStyle}>
          <h2 className="mb-3 text-lg font-semibold text-text-title">
            {t("data:configuration.sections.raceIngredients.addTitle")}
          </h2>
          <AddIngredientForm />
        </section>
      </div>
    </ConfigurationPages>
  );
};

export default ConfigRaceIngredients;
