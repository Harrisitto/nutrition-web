import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { sectionStyle } from "../../../races/components/formStyles";
import type { AppointmentStep } from "../constants";

// Tarjeta de un paso con su título y descripción, como en carreras
export const StepSection = ({
  step,
  children,
}: {
  step: AppointmentStep;
  children: ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <section className={sectionStyle}>
      <header>
        <h2 className="text-lg font-semibold text-text-title">
          {t(`data:appointments.form.steps.${step}.title`)}
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          {t(`data:appointments.form.steps.${step}.description`)}
        </p>
      </header>
      {children}
    </section>
  );
};
