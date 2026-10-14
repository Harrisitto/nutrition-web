import { StepSection } from "../../components/stepSection";
import { RaceFields } from "./raceFields";
import { GpxUpload } from "./gpxUpload";
import { StepsTable } from "./stepsTable";

export const StepProfile = () => {
  return (
    <StepSection step="profile">
      <RaceFields />
      <GpxUpload />
      <StepsTable />
    </StepSection>
  );
};
