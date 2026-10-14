import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { RaceStep } from "../constants";
import { sectionStyle } from "./formStyles";

// Tarjeta de un paso con su título y descripción; aside va a la derecha del título
export const StepSection = ({
  step,
  aside,
  children,
}: {
  step: RaceStep;
  aside?: ReactNode;
  children: ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <section className={sectionStyle}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-title">
            {t(`data:races.steps.${step}.title`)}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {t(`data:races.steps.${step}.description`)}
          </p>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
};
