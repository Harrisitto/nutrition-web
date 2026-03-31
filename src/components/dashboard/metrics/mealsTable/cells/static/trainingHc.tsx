import { useTableContext } from "../../tableContext";

const RowNameCell = ({ name }: { name: string }) => {
  return (
    <div
      className={`border col-start-1 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green`}
    >
      {name}
    </div>
  );
};

export const HCEmptyCol = () => {
  const { planing, tableFragmentIndex } = useTableContext();
  return (
    <div
      className="border p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
      style={{
        gridColumn: 9,
        gridRow: `${tableFragmentIndex.trainingRows.start + 2} / span ${planing.maxTrainingHours + 1}`,
      }}
    />
  );
};

export const ColTrainingHc = () => {
  const { planing } = useTableContext();
  return Array.from({ length: planing.maxTrainingHours }, (_, i) => {
    return <RowNameCell key={`training-hc-${i}`} name={`${i + 1}h`} />;
  });
};
