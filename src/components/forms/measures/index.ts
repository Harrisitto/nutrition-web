import * as Form from "./form/index";
import * as Actions from "./actions/index";
import * as Text from "./text/index";
import * as Graph from "./plot/components/graph";
import * as Time from "./plot/components/selectDate";
import { PlotProvider } from "./plot/plotProvider";
import { usePlotContext } from "./plot/plotContext";

const IdxMeasures = {
    Text,
    Form,
    Actions,
    ...Graph,
    Time,
    PlotProvider,
}

export default IdxMeasures;
export { usePlotContext };
