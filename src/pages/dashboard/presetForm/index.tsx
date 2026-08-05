import IdxUserPreset from "@src/components/forms/presets";

const PageUserPreset = () => {
  return (
    <IdxUserPreset.Form.Provider>
      <div className="p-24 justify-center items-center w-full">
        <IdxUserPreset.Text.Title />
        <IdxUserPreset.Text.Description />
        <div className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-[720px_minmax(0,1fr)] gap-4 items-start">
          <div className="rounded-lg border border-nutrition-green/20 p-6">
            <IdxUserPreset.Text.NewPreset />
            <IdxUserPreset.Form.FieldText />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <IdxUserPreset.Text.FormResume />
                <div className="my-2" />
                <IdxUserPreset.Form.Resume />
                </div>
            </div>
            <IdxUserPreset.Form.InsertData />
          </div>
          <IdxUserPreset.Manage.List />
        </div>
      </div>
    </IdxUserPreset.Form.Provider>
  );
};

export default PageUserPreset;
