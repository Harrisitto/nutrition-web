import IdxUserPreset from "@src/components/forms/presets";

const PageUserPreset = () => {
  return (
    <IdxUserPreset.Form.Provider>
      <div className="p-24 justify-center items-center w-full"> 
      <IdxUserPreset.Text.Title />
      <IdxUserPreset.Text.Description />
      <div className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-4">
        <div className="rounded-lg shadow-md p-6">
          <IdxUserPreset.Text.NewPreset />
          <IdxUserPreset.Form.RenderFields />
        </div>
        <IdxUserPreset.Manage.List />
      </div>
      </div>
    </IdxUserPreset.Form.Provider>
  );
};

export default PageUserPreset;
