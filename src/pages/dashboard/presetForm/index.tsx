import { FieldMeal, FieldText, FieldTrainingHc, InsertData, Provider } from "./components/form/logicComponents";
import { List } from "./components/manage";
import { Description, FormResume, Meals, NewPreset, Title, TrainingHc } from "./components/text";

const PageUserPreset = () => {
  return (
    <Provider>
      <div className="p-24 justify-center items-center w-full">
        <Title />
        <Description />
        <div className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-[720px_minmax(0,1fr)] gap-4 items-start">
          <div className="rounded-lg border border-nutrition-green/20 p-6">
            <NewPreset />
            <FieldText />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Meals />
                <div className="my-2" />
                <FieldMeal />
              </div>
              <div>
                <TrainingHc />
                <div className="my-2" />
                <FieldTrainingHc />
              </div>
              <div>
                <FormResume />
                <div className="my-2" />
                <FormResume />
                </div>
            </div>
            <InsertData />
          </div>
          <List />
        </div>
      </div>
    </Provider>
  );
};

export default PageUserPreset;
