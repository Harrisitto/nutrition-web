import type { TextInputProps, MultiLineTextInputProps } from "./text/text";
import * as Text from "./text/text";
import * as Date from "./date/index";
import { One } from "./select/one";
import { Numeric } from "./numeric";

const InputComponent = {
    Text,
    Numeric,
    Date,
    Select: {
        One,
    },
}

export default InputComponent;
export type { TextInputProps, MultiLineTextInputProps };