import * as Form from "./form/logicComponents";
import * as Manage from "./manage";
import * as Text from "./text";
import { useInsert } from "./form/insert";

const IdxUserPreset = {
    Text,
    Manage,
    Form: {
        ...Form,
        useInsert,
    },
}

export default IdxUserPreset;