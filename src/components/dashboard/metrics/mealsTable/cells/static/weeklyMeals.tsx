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

export const ColWeeklyMeals = () => {
  const { meals } = useTableContext();

  return meals.map((meal) => {
    return (
      <RowNameCell key={`meal-${meal.id}-name`} name={meal.name} />
    );
  }); 
};