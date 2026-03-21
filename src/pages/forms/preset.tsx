import IdxUserPreset from "@src/components/forms/presets";

const PageUserPreset = () => {
  return (
    <IdxUserPreset.Form.Provider>
      <div className="p-24 justify-center items-center w-full">
        <IdxUserPreset.Text.Title />
        <IdxUserPreset.Text.Description />
        <div className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-[520px_minmax(0,1fr)] gap-4">
          <div className="rounded-lg shadow-md p-6">
            <IdxUserPreset.Text.NewPreset />
            <IdxUserPreset.Form.FieldText />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <IdxUserPreset.Text.Meals />
                <div className="my-2" />
                <IdxUserPreset.Form.FieldMeal />
              </div>
              <div>
                <IdxUserPreset.Text.TrainingHc />
                <div className="my-2" />
                <IdxUserPreset.Form.FieldTrainingHc />
              </div>
            </div>
          </div>
          <IdxUserPreset.Manage.List />
        </div>
      </div>
    </IdxUserPreset.Form.Provider>
  );
};

export default PageUserPreset;
