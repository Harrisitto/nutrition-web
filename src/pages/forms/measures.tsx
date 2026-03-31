import IdxMeasures from "@src/components/forms/measures";

const PageMeasures = () => {
  return (
    <IdxMeasures.Form.Provider>
      <IdxMeasures.PlotProvider>
        <IdxMeasures.Text.Title />
        <IdxMeasures.Text.Description />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-12">
            <IdxMeasures.Graph />
          </div>
          <div className="p-12">
            {/**
             * RENDER INSERT MEASURE OR DELETE MEASURES FROM THE SELECTED DATE RANGE
             * BASED ON USER INTERACTION WITH A CUSTOM BUTTON
             */}
            <IdxMeasures.Form.Fields />
          </div>
        </div>
      </IdxMeasures.PlotProvider>
    </IdxMeasures.Form.Provider>
  );
};

export default PageMeasures;
