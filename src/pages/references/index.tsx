import {
  Description as CalculatorsDescription,
  Title as CalculatorsTitle,
} from "./@components/text";
import {
  DisclaimerDefault,
  Description as DisclaimerDescription,
  Title as DisclaimerTitle,
} from "./@components/disclaimer";
import {
  CarbLoading,
  CookedIngredients,
  Dehydration,
  EatingDisorder,
  Osmolarity,
} from "./@components/items";

const PageReferences = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto py-10 w-full md:w-full lg:w-[70%]">
      <div className="flex flex-col gap-4 p-10">
        <DisclaimerTitle />
        <DisclaimerDescription />
        <DisclaimerDefault />
      </div>
      <div className="flex flex-col gap-4 p-10">
        <CalculatorsTitle />
        <CalculatorsDescription />
        <Dehydration />
        <CarbLoading />
        <CookedIngredients />
        <Osmolarity />
        <EatingDisorder />
      </div>
    </div>
  );
};

export default PageReferences;
