import { SelectDateCalendar } from "./@components/calendar";
import {
  NavigateMeasures,
  NavigateUserPreset,
} from "./@components/header/navigate";
import { Navigation, UserName } from "./@components/header/titles";
import {
  Email,
  LastSeen,
  Phone,
  Weight,
  Goal,
} from "./@components/header/fields";
import { WeeklyMeals } from "./@components/table";

const PagePlaningForm = () => {
  return (
    <div>
      <div className="flex flex-row items-center gap-2 m-4 justify-between">
        <div className="flex flex-1 flex-col gap-2 justify-start">
          <UserName />
          <div className="my-2 h-px w-full bg-nutrition-green/20" />
          <div className="flex flex-row gap-2">
            <Navigation />
            <NavigateUserPreset />
            <NavigateMeasures />
          </div>
          <div className="flex flex-row flex-wrap justify-between gap-2">
            <LastSeen />
            <Email />
            <Phone />
            <Weight />
            <Goal />
          </div>
        </div>
        <SelectDateCalendar />
      </div>

      <div className="my-4" />
      <WeeklyMeals />
    </div>
  );
};

export default PagePlaningForm;
