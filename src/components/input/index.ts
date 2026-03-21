import type { TextInputProps, MultiLineTextInputProps } from "./text/text";
import * as Text from "./text/text";
import { One } from "./select/one";
import { Numeric } from "./numeric";

const InputComponent = {
    Text,
    Numeric,
    Select: {
        One,
    },
}

export default InputComponent;
export type { TextInputProps, MultiLineTextInputProps };