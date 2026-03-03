import { useEffect, useMemo, useRef, useState } from "react";
import { useTableContext } from "../tableContext";

const formatString = (str: string) => {
    if (!str) return "";
    return str.trim().toLowerCase().replace(/\s+/g, "");
}

const compareStrings = (str1: string, str2: string) => {
    return formatString(str1).includes(formatString(str2));
}

export const SideSelectOptions = ({
    initialId,
    options,
    onSelect,
}: {
    initialId?: string;
    options: [string, string][];
    onSelect: (optionId: string) => void;
}) => {

    const { cancelFocus } = useTableContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState<number>(
        options.findIndex(([id]) => id === initialId) || 0
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter(([, label]) => compareStrings(label, searchTerm)) || [];
    }, [options, searchTerm]);

    /**
     * Focus the input when the component mounts, so user can start typing immediately.
     */
    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.focus();
    }, []);


    useEffect(() => {

        const numOptions = filteredOptions.length;

        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current?.contains(e.target as Node)) return;
            setSearchTerm("");
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % numOptions);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + numOptions) % numOptions);
                    break;
                case "Enter":
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < numOptions) {
                        onSelect(filteredOptions[selectedIndex][0]);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    setSearchTerm("");
                    cancelFocus();
                    break;
            }
        };

        window.addEventListener("click", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("click", handleClickOutside);
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [filteredOptions, selectedIndex, onSelect, cancelFocus]);

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder="..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-48 overflow-y-auto">
                {filteredOptions.map(([id, label], index) => (
                    <div
                        key={id}
                        className={`px-2 py-1 cursor-pointer text-sm rounded ${index === selectedIndex ? "bg-gray-200" : "hover:bg-gray-100"}`}
                        onClick={() => onSelect(id)}
                    >
                        {label}
                    </div>
                ))}
            </div>
        </div>
    )
}

