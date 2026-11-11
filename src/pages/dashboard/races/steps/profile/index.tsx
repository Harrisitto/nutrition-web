import { StepSection } from "../../components/stepSection";
import { RaceFields } from "./raceFields";
import { GpxUpload } from "./gpxUpload";
import { ProfileImageUpload } from "./profileImageUpload";
import { StepsTable } from "./stepsTable";

export const StepProfile = () => {
  return (
    <StepSection step="profile">
      <RaceFields />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <GpxUpload />
        <ProfileImageUpload />
      </div>
      <StepsTable />
    </StepSection>
  );
};
