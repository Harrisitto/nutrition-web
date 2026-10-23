import type { ReactNode } from "react";
import { StepSection } from "../components/stepSection";

// Los campos los crea la pagina con useAppointmentForm: "Guardar y continuar" los valida y guarda
export const StepDetails = ({ fields }: { fields: ReactNode }) => {
  return (
    <StepSection step="details">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">{fields}</div>
    </StepSection>
  );
};
