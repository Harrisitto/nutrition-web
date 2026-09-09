import { Fields, Provider } from "./components/form";
import { PlotProvider } from "./components/plot/plotProvider";
import { Description, Title } from "./components/text";
import { SelectDateRange, SelectFocusedDateRange } from "./components/plot/components/selectDate";
import { Graph } from "./components/plot/components/graph";
import { DisplayedMeasures } from "./components/plot/components/displayedMeasures";
import { BtnInsertMeasure } from "./components/actions";
import { ManageMeasures } from "./components/plot/components/manageMeasure";

const PageMeasures = () => {
  return (
    <Provider>
      <PlotProvider>
        <Title />
        <Description />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div className="min-w-0 px-6">
            <SelectDateRange />
            <div className="my-4" />
            <Graph />
            <SelectFocusedDateRange />
            <div className="my-4" />
            <DisplayedMeasures />
          </div>
          <div className="min-w-0 h-min rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm">
            <div className="grid auto-rows-min grid-cols-2 gap-3 md:grid-cols-2 [&>*]:rounded-lg [&>*]:border [&>*]:border-slate-200 [&>*]:bg-white [&>*]:p-3">
              <Fields />

              <div className="col-start-2 row-start-2 self-end justify-self-end border-dashed bg-slate-50/70">
                <BtnInsertMeasure />
              </div>
            </div>

            <ManageMeasures />
          </div>
        </div>
      </PlotProvider>
    </Provider>
  );
};

export default PageMeasures;
