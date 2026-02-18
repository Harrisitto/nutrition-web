import type React from "react";

const emptyChange = () => {
    console.warn("No onChange handler provided for TextInput");
};

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SingleLine = ({ label, ...props }: TextInputProps) => {
    return (
        <label className="flex flex-col gap-2">
            {label && <span className="text-sm text-gray-blue-600">{label}</span>}
            <input
                type="text"
                value={props.value || ""}
                placeholder={"..."}
                className="w-full px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500"
                onChange={props.onChange || emptyChange}
                {...props}
            />
        </label>
    );
}

export interface MultiLineTextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const MultiLine = ({ label, ...props }: MultiLineTextInputProps) => {
    return (
        <label className="flex flex-col gap-2">
            {label && <span className="text-sm text-gray-blue-600">{label}</span>}
            <textarea
                value={props.value || ""}
                placeholder={"..."}
                className="w-full px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500 resize-none"
                onChange={props.onChange || emptyChange}
                {...props}
            />
        </label>
    );
}

