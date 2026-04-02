import IdxMeasures from "@src/components/forms/measures";

const PageMeasures = () => {
  return (
    <IdxMeasures.Form.Provider>
      <IdxMeasures.PlotProvider>
        <IdxMeasures.Text.Title />
        <IdxMeasures.Text.Description />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div className="min-w-0 px-6">
            <IdxMeasures.Time.SelectDateRange />
            <div className="my-4" />
            <IdxMeasures.Graph.Graph />
            <IdxMeasures.Time.SelectFocusedDateRange />
            <div className="my-4" />
            <IdxMeasures.Graph.DisplayedMeasures />
          </div>
          <div className="min-w-0 h-min rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm">
            <div className="grid auto-rows-min grid-cols-2 gap-3 md:grid-cols-2 [&>*]:rounded-lg [&>*]:border [&>*]:border-slate-200 [&>*]:bg-white [&>*]:p-3">
              <IdxMeasures.Form.Fields />

              <div className="col-start-2 row-start-2 self-end justify-self-end border-dashed bg-slate-50/70">
                <IdxMeasures.Actions.BtnInsertMeasure />
              </div>
            </div>

            <IdxMeasures.Graph.ManageMeasures />
          </div>
        </div>
      </IdxMeasures.PlotProvider>
    </IdxMeasures.Form.Provider>
  );
};

export default PageMeasures;
