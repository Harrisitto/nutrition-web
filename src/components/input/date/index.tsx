type BaseDateInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">;

type SingleDateProps = BaseDateInputProps & {
    label?: string;
    value?: string;
    onChange: (newDate: string) => void;
};

type RangeValue = {
    startDate: string;
    endDate: string;
};

type RangeDateProps = BaseDateInputProps & {
    label?: string;
    onChange: (startDate: string, endDate: string) => void;
    value?: RangeValue;
};

export const SingleDate = ({
    label,
    value,
    onChange,
    ...props
}: SingleDateProps) => {
    return (
        <label className="flex flex-col gap-2">
            {label && <span className="text-sm text-gray-blue-600">{label}</span>}
            <input
                type="date"
                {...props}
                value={value}
                className="w-full px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500"
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
};

export const RangeDate = ({
    label,
    onChange,
    value,
    ...props
}: RangeDateProps) => {
    return (
        <label className="flex flex-col gap-2">
            {label && <span className="text-sm text-gray-blue-600">{label}</span>}
            <input
                type="date"
                {...props}
                value={value?.startDate || ""}
                className="w-full px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500"
                onChange={(e) => {
                    const newStartDate = e.target.value;
                    onChange(newStartDate, value?.endDate || "");
                }}
            />
            <input
                type="date"
                {...props}
                value={value?.endDate || ""}
                className="w-full px-3 py-2 rounded-md bg-gray-blue-50 border border-gray-blue-300 text-gray-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-blue-400 focus:border-gray-blue-500"
                onChange={(e) => {
                    const newEndDate = e.target.value;
                    onChange(value?.startDate || "", newEndDate);
                }}
            />
        </label>
    );
};