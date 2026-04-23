import { IdxReferences } from "@src/components/references";

const PageReferences = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto py-10 w-full md:w-full lg:w-[70%]">
      <div className="flex flex-col gap-4 p-10">
        <IdxReferences.Disclaimer.Title />
        <IdxReferences.Disclaimer.Description />
        <IdxReferences.Disclaimer.DisclaimerDefault />
      </div>
      <div className="flex flex-col gap-4 p-10">
        <IdxReferences.Text.Title />
        <IdxReferences.Text.Description />
        <IdxReferences.Calculators.Text.Dehydration />
        <IdxReferences.Calculators.Text.CarbLoading />
        <IdxReferences.Calculators.Text.CookedIngredients />
        <IdxReferences.Calculators.Text.Osmolarity />
        <IdxReferences.Calculators.Text.EatingDisorder />
      </div>
    </div>
  );
};

export default PageReferences;
