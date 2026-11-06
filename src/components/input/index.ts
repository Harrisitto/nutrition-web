import type { TextInputProps, MultiLineTextInputProps } from "./text/text";
import * as Text from "./text/text";
import * as Date from "./date/index";
import { One } from "./select/one";
import { Numeric } from "./numeric";
import { Toggle } from "./toggle";
import { FileInput } from "./file";

const InputComponent = {
    Text,
    Numeric,
    Date,
    Toggle,
    File: FileInput,
    Select: {
      One,
    },
}

export default InputComponent;
export type { TextInputProps, MultiLineTextInputProps };
