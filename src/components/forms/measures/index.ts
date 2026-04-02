import * as Form from "./form/index";
import * as Actions from "./actions/index";
import * as Text from "./text/index";
import * as Graph from "./plot/components/graph";
import * as Time from "./plot/components/selectDate";
import { PlotProvider } from "./plot/plotProvider";
import { usePlotContext } from "./plot/plotContext";
import { DisplayedMeasures } from "./plot/components/displayedMeasures";
import { ManageMeasures } from "./plot/components/manageMeasure";

const IdxMeasures = {
    Text,
    Form,
    Actions,
    Graph: {
        ...Graph,
        DisplayedMeasures,
        ManageMeasures
    },

    Time,
    PlotProvider,
}

export default IdxMeasures;
export { usePlotContext };
