import type { TextInputProps, MultiLineTextInputProps } from "./text/text";
import * as Text from "./text/text";
import { One } from "./select/one";

const InputComponent = {
    Text,
    Select: {
        One,
    },
}

export default InputComponent;
export type { TextInputProps, MultiLineTextInputProps };